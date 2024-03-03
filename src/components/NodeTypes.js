import React from 'react';

export const NodeTypes = ({ node }) => {


    //required data transfer
    const onDragStart = (event, nodeType, nodeName) => {
        event.dataTransfer.setData('application/reactflow/nodeType', nodeType);
        event.dataTransfer.setData('application/reactflow/nodeName', nodeName);
        event.dataTransfer.effectAllowed = 'move';
    };


    return (
        <div className={`dndnode input ${node.classNameNode}`} onDragStart={(event) => onDragStart(event, node.nodeType, node.nodeName)} draggable>
            {node.nodeName}
        </div>
    );
};
