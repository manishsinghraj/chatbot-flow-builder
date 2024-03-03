import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { SideBar } from './components/SideBar';
import { UpdateNode } from './components/UpdateNode';
import { Header } from './components/Header';


// const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'input' },
//     position: { x: 250, y: 5 },
//   },
// ];

let id = 0;
const getId = () => `dndNode_${id++}`;

const App = () => {

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [updateNodePanel, setUpdateNodePanel] = useState(false);
  const [currentNode, setCurrentNode] = useState(null); //To get the current selected Node.
  const [status, setStatus] = useState(""); // status shown when save changes || error || reset
  const [error, setError] = useState(false);

  console.log("reactFlowInstance", reactFlowInstance)
  //  from react flow doc
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );


  //  from react flow doc
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  //  from react flow doc
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/nodeType');
      const nodeName = event.dataTransfer.getData('application/reactflow/nodeName');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${nodeName}` },
        sourcePosition: "right", //The black dot on node
        targetPosition: "left" //The black dot on node
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );


  // from react flow doc : Delete Nodes (Currently unable to figure out how it works from react flow doc)
  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );


  console.log("edges", edges)
  console.log("nodes", nodes)


  //Custom functionalites
  const handleOpenUpdateNodePanel = (node) => {
    setCurrentNode(node);
    setUpdateNodePanel(true);
  }

  const handleCloseUpdateNodePanel = () => {
    setUpdateNodePanel(false);
  }

  const isvalidFlow = () => {

    // empty nodes or edges if there arent changes observed
    if (nodes.length === 0) {
      console.log("empty nodes or edges");
      setError(true);
      setStatus("No changes done");
      return false;
    }

    // if any node in flow has no edges
    const nodeWithoutEdges = nodes.find((node) => {
      const connectingEdges = edges.filter((edge) => edge.source === node.id  || edge.target === node.id);
      return connectingEdges.length === 0;
    });

    if (nodeWithoutEdges) {
      console.log("node without edges");
      setError(true);
      setStatus("Cannot save flow");
      return false;
    }

    setError(false);
    return true;

  }


  const handleSave = () => {
    const validFlow = isvalidFlow();

    if (validFlow) {
      setStatus("");
      localStorage.setItem('nodes', JSON.stringify(nodes));
      localStorage.setItem('edges', JSON.stringify(edges));
      setStatus("Changes saved");
      setError(false);
    }
  }

  const handleReset = () => {
    localStorage.removeItem('nodes');
    localStorage.removeItem('edges');
    setNodes([]);
    setEdges([]);
    setStatus("reset done");
    setError(false);
  }




  useEffect(() => {
    const storedNodes = localStorage.getItem('nodes');
    const storedEdges = localStorage.getItem('edges');

    if (storedNodes) {
      setNodes(JSON.parse(storedNodes));
    }

    if (storedEdges) {
      setEdges(JSON.parse(storedEdges));
    }
  }, []);


  const options = {
    setNodes,
    setEdges,
    handleCloseUpdateNodePanel,
    node: currentNode
  }

  useEffect(() => {
    let timeOutId = "";
    if (status !== "") {
      timeOutId = setTimeout(() => {
        setStatus("");
      }, 2000)
    }

    return () => {
      clearTimeout(timeOutId);
    }

  }, [status])


  return (
    <>
      {status !== "" && <button className={`status status__button ${error ? "red" : "green"}`}>{status}</button>}
      <Header handleSave={handleSave} handleReset={handleReset} status={status} />
      <div className="dndflow" >
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodesDelete={onNodesDelete}
              data-heading="Node Heading Text"
              fitView
              onNodeDoubleClick={(event, node) => {
                handleOpenUpdateNodePanel(node);
              }}>
              <Controls />
            </ReactFlow>
          </div>

          {updateNodePanel ? <UpdateNode {...options} /> : <SideBar />}

        </ReactFlowProvider>
      </div>
    </>
  );
};

export default App;
