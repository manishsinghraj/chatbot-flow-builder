import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";

export const UpdateNode = (props) => {
    const { setNodes, handleCloseUpdateNodePanel, node } = props;

    const [currentNode, setCurrentNode] = useState({});
    const [nodeName, setNodeName] = useState(null);


    //when clicked on back arrow, update the nodeName(text)
    const handleUpdate = () => {
        setNodes((nodes) =>
            nodes.map((nd) => {
                if (nd.id === currentNode.id) { //doubleclicked node
                    nd.data.label = nodeName;
                }
                return nd;
            })
        );

        handleCloseUpdateNodePanel();
    };


    // whwn particular node gets doubleclicked, the label needs to be rendered in text area
    useEffect(() => {
        setCurrentNode(node);
        setNodeName(node?.data?.label || '');
    }, [node]);


    
    const handleNodeNameChange = (evt) => {
        setNodeName(evt.target.value);
    };



    return (
        <div className="updatenode__controls">
            <div className='node__header'>
                <div className='back__arrow'>
                    <IoIosArrowRoundBack className='icon' onClick={handleUpdate} />
                </div>
                <div className='node__name'>
                    <p>Message</p>
                </div>
            </div>
            <div className='text__area'>
                <p>Text</p>
                <textarea rows={5} value={nodeName} onChange={handleNodeNameChange} />
            </div>
        </div>
    );
};
