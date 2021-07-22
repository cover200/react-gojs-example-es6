import React, { useState, useRef } from 'react';
import * as go from 'gojs';
import { ToolManager, Diagram } from 'gojs';
// import { GojsDiagram } from 'react-gojs';

import DiagramButtons from './DiagramButtons';
import GojsDiagram from './CustomGojsDiagram';

import nodeTemplateMap from '../Helpers/genogramTemplate';
import linkTemplateMap from '../Helpers/linkTemplate';
import './MyDiagram.css';

const initialState = {
    selectedNodeKeys: [],
    model: {
        nodeDataArray: [
            {
                key: 'male1',
                label: 'Male 1',
                desc: 'description 1st male',
                category: 'male',
                options: [{ type: 'death' }, { type: 'patient' }]
            },
            {
                key: 'male2',
                label: 'Male 2',
                desc: 'description 2nd male',
                category: 'male',
                options: [{ type: 'death' }, { type: 'patient' }]
            },
            {
                key: 'male3',
                label: 'Male 3',
                desc: 'description 3rd male',
                category: 'male',
                options: [{ type: 'death' }, { type: 'patient' }]
            },
            {
                key: 'male4',
                label: 'Male 4',
                desc: 'description 4th male',
                category: 'male',
                options: [{ type: 'death' }, { type: 'patient' }],
                group: 1
            },
            {
                key: 'female1',
                label: 'Female 1',
                desc: 'description 1st female',
                category: 'abortion',
                options: [{ type: 'death' }, { type: 'patient' }]
            },
            {
                key: 'female2',
                label: 'Female 2',
                desc: 'description 2nd female',
                category: 'female',
                options: [{ type: 'death' }, { type: 'patient' }]
            },
            {
                key: 'female3',
                label: 'Female 3',
                desc: 'description 3rd female',
                category: 'misscarriage',
                options: [{ type: 'death', stroke: 'white' }, { type: 'patient', stroke: 'white' }],
                group: 1
            },
            {
                key: 'pregant1',
                label: 'pregant 1',
                desc: 'description 1st pregant',
                category: 'pregant',
                options: [{ type: 'death' }, { type: 'patient' }]
            },
            {
                key: 'unknown1',
                label: 'Unknown 1',
                desc: 'description 1st unknown',
                category: 'unknown',
                options: [{ type: 'death' }, { type: 'patient' }],
                group: 1
            },
            {
                key: 'male1-female1',
                category: 'linkLabel'
            },
            { key: 1, isGroup: true }
        ],
        linkDataArray: [
            { from: 'male1', to: 'male2', labelKeys: ['male1-female1'], category: 'veryCloseFriend' },
            { from: 'male1', to: 'male2', category: 'quarrel' },
            { from: 'male3', to: 'male4', category: 'divorce' },
            { from: 'male2', to: 'male4', category: 'together' },
            { from: 'male2', to: 'female1', category: 'marriage' },
            { from: 'female2', to: 'female3', category: 'distant' },
            { from: 'female2', to: 'pregant1', category: 'closeFriend' },
            { from: 'female2', to: 'pregant1', category: 'control' },
            { from: 'pregant1', to: 'unknown1', category: 'violence' },
            { from: 'male1-female1', to: 'female3', category: 'child' }
        ]
    }
};

const Genogram = () => {
    const [state, setState] = useState(initialState);
    const canvasRef = useRef(null);
    const $ = go.GraphObject.make;

    const createDiagram = diagramId => {
        const myDiagram = $(Diagram, diagramId, {
            initialAutoScale: Diagram.Uniform,
            initialContentAlignment: go.Spot.Center,
            'undoManager.isEnabled': true
        });

        myDiagram.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;

        myDiagram.nodeTemplateMap = nodeTemplateMap;

        myDiagram.linkTemplateMap = linkTemplateMap;

        myDiagram.groupTemplate = $(
            go.Group,
            'Auto',
            $(go.Shape, 'RoundedRectangle', { fill: null, stroke: 'black', strokeWidth: 2 }),
            $(go.Panel, 'Auto', $(go.Placeholder, { padding: 10 }))
        );

        return myDiagram;
    };

    const initModelHandler = () => {
        setState({ ...initialState });
    };

    const convertCanvas = () => {
        // const canvasId = 'genogramDiv';
        // const canvas = document.getElementById(canvasId).children[0];
        // const imgData = canvas.toDataURL('image/png');

        // console.log(canvas);
        // console.log(imgData);

        const { myDiagram } = canvasRef.current;
        const img = myDiagram.makeImage({
            background: 'white',
            type: 'image/jpeg'
        });

        const w = window.open();
        w.document.body.appendChild(img);
    };

    return [
        <DiagramButtons key="diagramButtons" onInit={initModelHandler} />,
        <div key="convert-key" className="inline-element" onClick={convertCanvas}>
            <button type="button">Convert</button>
        </div>,
        <GojsDiagram
            ref={canvasRef}
            key="gojsDiagram"
            diagramId="genogramDiv"
            model={state.model}
            createDiagram={createDiagram}
            className="myDiagram"
            // onModelChange={modelChangeHandler}
        />
    ];
};

export default Genogram;
