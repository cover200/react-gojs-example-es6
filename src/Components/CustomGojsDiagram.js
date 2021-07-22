import React, { forwardRef } from 'react';
import * as go from 'gojs';
import { GojsDiagram } from 'react-gojs';

GojsDiagram.prototype.init = function() {
    var _a = this.props,
        createDiagram = _a.createDiagram,
        diagramId = _a.diagramId,
        onModelChange = _a.onModelChange,
        defaultSelectedNode = _a.defaultSelectedNode;
    this.myDiagram = createDiagram(diagramId);
    if (onModelChange) {
        this.myDiagram.addModelChangedListener(this.modelChangedHandler);
    }
    this.myDiagram.model = go.GraphObject.make(
        go.GraphLinksModel,
        Object.assign(
            {},
            this.props.makeUniqueKeyFunction && {
                makeUniqueKeyFunction: this.props.makeUniqueKeyFunction
            },
            {
                linkLabelKeysProperty: 'labelKeys',
                linkFromPortIdProperty: this.props.linkFromPortIdProperty || '',
                linkToPortIdProperty: this.props.linkToPortIdProperty || '',
                nodeDataArray: this.props.model.nodeDataArray.slice(),
                linkDataArray: this.props.model.linkDataArray.slice(),
                nodeCategoryProperty: this.props.nodeCategoryProperty || 'category',
                linkKeyProperty: this.props.linkKeyProperty || '',
                makeUniqueLinkKeyFunction: this.props.makeUniqueLinkKeyFunction || null,
                copyNodeDataFunction: this.props.copyNodeDataFunction || null
            }
        )
    );
    if (defaultSelectedNode) {
        this.myDiagram.select(this.myDiagram.findNodeForKey(defaultSelectedNode));
    }
};

const CustomGojsDiagram = forwardRef((props, ref) => <GojsDiagram ref={ref} {...props} />);

export default CustomGojsDiagram;
