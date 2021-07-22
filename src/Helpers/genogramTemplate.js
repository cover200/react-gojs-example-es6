import * as go from 'gojs';

const $ = go.GraphObject.make;

const DEFAULT_SIZE = 100;
const SMALLER_SIZE = DEFAULT_SIZE - 30;

const DEFAULT_SHAPE = {
    RECTANGLE: (size = DEFAULT_SIZE) => $(go.Shape, 'Rectangle', { fill: null, width: size, height: size }),
    CIRCLE: (size = DEFAULT_SIZE, fill = null) =>
        $(go.Shape, 'Ellipse', { fill, width: size, height: size }, new go.Binding('stroke')),
    DIAMOND: (size = DEFAULT_SIZE, point = [0, 0]) =>
        $(go.Shape, 'Diamond', { position: new go.Point(...point), fill: null, width: size, height: size + 20 }),
    TRIANGLE: (size = DEFAULT_SIZE, point = [0, 0]) =>
        $(go.Shape, 'TriangleUp', { position: new go.Point(...point), fill: null, width: size, height: size }),
    PLUS: (size = DEFAULT_SIZE) => $(go.Shape, 'PlusLine', { fill: null, width: size, height: size }),
    X: (size = DEFAULT_SIZE) =>
        $(go.Shape, 'XLine', { fill: 'white', width: size, height: size }, new go.Binding('stroke'))
};

const TEXT_BLOCK = {
    LABEL: (width = DEFAULT_SIZE, height = DEFAULT_SIZE, stroke = 'black') =>
        $(
            go.TextBlock,
            {
                textAlign: 'center',
                verticalAlignment: go.Spot.Center,
                width,
                height,
                font: 'bold 12pt sans-serif',
                stroke
                // background: 'lightgray'
            },
            new go.Binding('text', 'label')
        ),
    DESCRIPTION: () => $(go.TextBlock, new go.Binding('text', 'desc'))
};

// options
const itemTemplateMap = new go.Map();

itemTemplateMap.add('death', $(go.Panel, DEFAULT_SHAPE.X(), new go.Binding('stroke')));
itemTemplateMap.add('patient', $(go.Panel, DEFAULT_SHAPE.CIRCLE(SMALLER_SIZE)));

const templateMap = new go.Map();

// ผู้ชาย
const maleTemplate = $(
    go.Node,
    'Vertical',
    $(
        go.Panel,
        'Auto',
        DEFAULT_SHAPE.RECTANGLE(),
        TEXT_BLOCK.LABEL(),
        $(
            go.Panel,
            'Auto',
            {
                itemCategoryProperty: 'type',
                itemTemplateMap
            },
            new go.Binding('itemArray', 'options')
        )
    ),
    $(go.TextBlock, new go.Binding('text', 'desc'))
);
templateMap.add('male', maleTemplate);

// ผู้หญิง
const femaleTemplate = $(
    go.Node,
    'Vertical',
    $(
        go.Panel,
        'Auto',
        DEFAULT_SHAPE.CIRCLE(),
        TEXT_BLOCK.LABEL(),
        $(
            go.Panel,
            'Auto',
            {
                itemCategoryProperty: 'type',
                itemTemplateMap: itemTemplateMap
            },
            new go.Binding('itemArray', 'options')
        )
    ),
    $(go.TextBlock, new go.Binding('text', 'desc'))
);
templateMap.add('female', femaleTemplate);

// ทำแท้ง
const abortionTemplate = $(
    go.Node,
    'Vertical',
    $(
        go.Panel,
        { position: new go.Point(0, 0) },
        DEFAULT_SHAPE.CIRCLE(),
        DEFAULT_SHAPE.PLUS(),
        TEXT_BLOCK.LABEL(),
        $(
            go.Panel,
            'Auto',
            {
                itemCategoryProperty: 'type',
                itemTemplateMap: itemTemplateMap
            },
            new go.Binding('itemArray', 'options')
        )
    ),
    $(go.TextBlock, new go.Binding('text', 'desc'))
);
templateMap.add('abortion', abortionTemplate);

// แท้งเอง
const misscarriageTemplate = $(
    go.Node,
    'Vertical',
    $(
        go.Panel,
        'Auto',
        DEFAULT_SHAPE.CIRCLE(undefined, 'black'),
        TEXT_BLOCK.LABEL(undefined, undefined, 'white'),
        $(
            go.Panel,
            'Auto',
            {
                itemCategoryProperty: 'type',
                itemTemplateMap: itemTemplateMap
            },
            new go.Binding('itemArray', 'options')
        )
    ),
    $(go.TextBlock, new go.Binding('text', 'desc'))
);
templateMap.add('misscarriage', misscarriageTemplate);

// กำลังตั้งครรภ์
const pregantTemplate = $(
    go.Node,
    'Vertical',
    $(
        go.Panel,
        { position: new go.Point(0, 0) },
        DEFAULT_SHAPE.TRIANGLE(undefined, [0, -14]),
        TEXT_BLOCK.LABEL(),
        $(
            go.Panel,
            'Auto',
            {
                itemCategoryProperty: 'type',
                itemTemplateMap
            },
            new go.Binding('itemArray', 'options')
        )
    ),
    $(go.TextBlock, new go.Binding('text', 'desc'))
);
templateMap.add('pregant', pregantTemplate);

// ไม่ทราบเพศ
const unknownGenderTemplate = $(
    go.Node,
    'Vertical',
    $(
        go.Panel,
        { position: new go.Point(0, 0) },
        DEFAULT_SHAPE.DIAMOND(undefined, [0, -9]),
        TEXT_BLOCK.LABEL(DEFAULT_SIZE, DEFAULT_SIZE + 10),
        $(
            go.Panel,
            'Auto',
            {
                itemCategoryProperty: 'type',
                itemTemplateMap
            },
            new go.Binding('itemArray', 'options')
        )
    ),
    $(go.TextBlock, new go.Binding('text', 'desc'))
);
templateMap.add('unknown', unknownGenderTemplate);

// จุดบนเส้น
const linkLabelTemplate = $(go.Node, { selectable: false, width: 1, height: 1, fromEndSegmentLength: 20 });
templateMap.add('linkLabel', linkLabelTemplate);

export default templateMap;
