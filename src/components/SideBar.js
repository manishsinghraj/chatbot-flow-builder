import React from 'react';
import { NodeTypes } from './NodeTypes';

export const SideBar = () => {


    //Different node Types considered for future references
    const nodeTypes = [
        {
            nodeName: "message node",
            nodeType: "default",
            classNameNode: "message"
        },
        {
            nodeName: "entity node", //different node other than message type
            nodeType: "default",
            classNameNode: "enity"
        },
        {
            nodeName: "logic node", // different node other than message type
            nodeType: "default",
            classNameNode: "logic"
        }
    ]

    return (
        <aside>
            <div className="description">You can drag these nodes to the pane on the right.</div>
            {nodeTypes.map((node, index) => {
                return <NodeTypes node={node} key={index} />
            })}
        </aside>
    );
};
