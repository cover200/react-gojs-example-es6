import React, { useState } from 'react';
import * as go from 'gojs';
import { ToolManager, Diagram } from 'gojs';
import { GojsDiagram, ModelChangeEventType } from 'react-gojs';
import DiagramButtons from './DiagramButtons';
import { getRandomColor } from '../Helpers/ColorHelper';
import SelectionDetails from './SelectionDetails';

import './MyDiagram.css';

const initialState = {
    selectedNodeKeys: [],
    model: {
        nodeDataArray: [{ key: 'Alpha', label: 'Alpha', color: 'lightblue' }],
        linkDataArray: []
    }
};

const MyDiagram = () => {
    const [state, setState] = useState(initialState);
    let nodeId = 0;

    const initModelHandler = () => {
        setState({
            ...state,
            model: {
                nodeDataArray: [
                    { key: 'Alpha', label: 'Alpha', color: 'lightblue' },
                    { key: 'Beta', label: 'Beta', color: 'orange' },
                    { key: 'Gamma', label: 'Gamma', color: 'lightgreen' },
                    { key: 'Delta', label: 'Delta', color: 'pink' },
                    { key: 'Omega', label: 'Omega', color: 'grey' }
                ],
                linkDataArray: [
                    { from: 'Alpha', to: 'Beta' },
                    { from: 'Alpha', to: 'Gamma' },
                    { from: 'Beta', to: 'Delta' },
                    { from: 'Gamma', to: 'Omega' }
                ]
            }
        });
    };

    const updateColorHandler = () => {
        const updatedNodes = state.model.nodeDataArray.map(node => {
            return {
                ...node,
                color: getRandomColor()
            };
        });

        setState({
            ...state,
            model: {
                ...state.model,
                nodeDataArray: updatedNodes
            }
        });
    };

    const createDiagram = diagramId => {
        const $ = go.GraphObject.make;

        const myDiagram = $(go.Diagram, diagramId, {
            initialContentAlignment: go.Spot.LeftCenter,
            layout: $(go.TreeLayout, {
                angle: 0,
                arrangement: go.TreeLayout.ArrangementVertical,
                treeStyle: go.TreeLayout.StyleLayered
            }),
            isReadOnly: false,
            allowHorizontalScroll: true,
            allowVerticalScroll: true,
            allowZoom: false,
            allowSelect: true,
            autoScale: Diagram.Uniform,
            contentAlignment: go.Spot.LeftCenter,
            TextEdited: onTextEdited
        });

        myDiagram.toolManager.panningTool.isEnabled = false;
        myDiagram.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;

        myDiagram.nodeTemplate = $(
            go.Node,
            'Auto',
            {
                selectionChanged: node => nodeSelectionHandler(node.key, node.isSelected)
            },
            $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
            $(go.TextBlock, { margin: 8, editable: true }, new go.Binding('text', 'label'))
        );

        return myDiagram;
    };

    const modelChangeHandler = event => {
        switch (event.eventType) {
            case ModelChangeEventType.Remove:
                if (event.nodeData) {
                    removeNode(event.nodeData.key);
                }
                if (event.linkData) {
                    removeLink(event.linkData);
                }
                break;
            default:
                break;
        }
    };

    const addNode = () => {
        const newNodeId = 'node' + nodeId;
        const linksToAdd = state.selectedNodeKeys.map(parent => {
            return { from: parent, to: newNodeId };
        });
        setState({
            ...state,
            model: {
                ...state.model,
                nodeDataArray: [
                    ...state.model.nodeDataArray,
                    { key: newNodeId, label: newNodeId, color: getRandomColor() }
                ],
                linkDataArray:
                    linksToAdd.length > 0
                        ? [...state.model.linkDataArray].concat(linksToAdd)
                        : [...state.model.linkDataArray]
            }
        });
        nodeId += 1;
    };

    const removeNode = nodeKey => {
        const nodeToRemoveIndex = state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
        if (nodeToRemoveIndex === -1) {
            return;
        }
        setState({
            ...state,
            model: {
                ...state.model,
                nodeDataArray: [
                    ...state.model.nodeDataArray.slice(0, nodeToRemoveIndex),
                    ...state.model.nodeDataArray.slice(nodeToRemoveIndex + 1)
                ]
            }
        });
    };

    const removeLink = linKToRemove => {
        const linkToRemoveIndex = state.model.linkDataArray.findIndex(
            link => link.from === linKToRemove.from && link.to === linKToRemove.to
        );
        if (linkToRemoveIndex === -1) {
            return;
        }
        return {
            ...state,
            model: {
                ...state.model,
                linkDataArray: [
                    ...state.model.linkDataArray.slice(0, linkToRemoveIndex),
                    ...state.model.linkDataArray.slice(linkToRemoveIndex + 1)
                ]
            }
        };
    };

    const updateNodeText = (nodeKey, text) => {
        const nodeToUpdateIndex = state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
        if (nodeToUpdateIndex === -1) {
            return;
        }
        setState({
            ...state,
            model: {
                ...state.model,
                nodeDataArray: [
                    ...state.model.nodeDataArray.slice(0, nodeToUpdateIndex),
                    {
                        ...state.model.nodeDataArray[nodeToUpdateIndex],
                        label: text
                    },
                    ...state.model.nodeDataArray.slice(nodeToUpdateIndex + 1)
                ]
            }
        });
    };

    const nodeSelectionHandler = (nodeKey, isSelected) => {
        if (isSelected) {
            setState({
                ...state,
                selectedNodeKeys: [...state.selectedNodeKeys, nodeKey]
            });
        } else {
            const nodeIndexToRemove = state.selectedNodeKeys.findIndex(key => key === nodeKey);
            if (nodeIndexToRemove === -1) {
                return;
            }
            setState({
                ...state,
                selectedNodeKeys: [
                    ...state.selectedNodeKeys.slice(0, nodeIndexToRemove),
                    ...state.selectedNodeKeys.slice(nodeIndexToRemove + 1)
                ]
            });
        }
    };

    const onTextEdited = e => {
        const tb = e.subject;
        console.log(tb);
        console.log(e);
        if (tb === null) {
            return;
        }
        const node = tb.part;
        if (node instanceof go.Node) {
            updateNodeText(node.key, tb.text);
        }
    };

    return [
        <DiagramButtons
            key="diagramButtons"
            onInit={initModelHandler}
            onUpdateColor={updateColorHandler}
            onAddNode={addNode}
        />,
        <SelectionDetails key="selectionDetails" selectedNodes={state.selectedNodeKeys} />,
        <GojsDiagram
            key="gojsDiagram"
            diagramId="myDiagramDiv"
            model={state.model}
            createDiagram={createDiagram}
            className="myDiagram"
            onModelChange={modelChangeHandler}
        />
    ];
};

export default MyDiagram;
