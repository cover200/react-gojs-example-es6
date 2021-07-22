import * as go from 'gojs';

const $ = go.GraphObject.make;

const linkTemplateMap = new go.Map();
const PathPatterns = new go.Map();

const definePathPattern = (name, geostr, cap) => {
    if (typeof name !== 'string' || typeof geostr !== 'string')
        throw new Error('invalid name or geometry string argument: ' + name + ' ' + geostr);

    if (cap === undefined) cap = 'square';
    PathPatterns.set(
        name,
        $(go.Shape, {
            geometryString: geostr,
            fill: 'transparent',
            stroke: 'black',
            strokeWidth: 1,
            strokeCap: cap
        })
    );
};

definePathPattern('Single', 'M0 0 L1 0');
definePathPattern('Double', 'M0 0 L1 0 M0 3 L1 3');
definePathPattern('Triple', 'M0 0 L1 0 M0 3 L1 3 M0 6 L1 6');
definePathPattern('Dash', 'M0 0 M4 0 L6 0');
definePathPattern('DoubleDash', 'M0 0 M3 0 L6 0 M3 3 L6 3');
//definePathPattern("TripleDash", "M0 0 M3 0 L6 0 M3 3 L6 3 M3 6 L6 6");
definePathPattern('Dot', 'M0 0 M4 0 L4.1 0', 'round');
definePathPattern('DoubleDot', 'M0 0 M4 0 L4.1 0 M4 3 L4.1 3', 'round');
definePathPattern('Zigzag', 'M0 3 L1 0 3 6 4 3');
definePathPattern('BigZigzag', 'M0 4 L2 0 6 8 8 4');
definePathPattern('DoubleZigzag', 'M0 3 L1 0 3 6 4 3 M0 9 L1 6 3 12 4 9');
definePathPattern('Cross', 'M0 0 M3 0 M1 0 L1 8');
//definePathPattern("Railroad", "M0 2 L3 2 M0 6 L3 6 M1 0 L1 8");  // also == Double & Cross
definePathPattern('BackSlash', 'M0 3 L2 6 M1 0 L5 6 M4 0 L6 3');
definePathPattern('Slash', 'M0 3 L2 0 M1 6 L5 0 M4 6 L6 3');
definePathPattern('Coil', 'M0 0 C2.5 0  5 2.5  5 5  C5 7.5  5 10  2.5 10  C0 10  0 7.5  0 5  C0 2.5  2.5 0  5 0');
definePathPattern('Square', 'M0 0 M1 0 L7 0 7 6 1 6z');
definePathPattern('Circle', 'M0 3 A3 3 0 1 0 6 4  A3 3 0 1 0 0 3');
definePathPattern('BigCircle', 'M0 5 A5 5 0 1 0 10 5  A5 5 0 1 0 0 5');
definePathPattern('Triangle', 'M0 0 L4 4 0 8z');
definePathPattern('Diamond', 'M0 4 L4 0 8 4 4 8z');
definePathPattern('Dentil', 'M0 0 L2 0  2 6  6 6  6 0  8 0');
definePathPattern('Greek', 'M0 0 L1 0  1 3  0 3  M0 6 L4 6  4 0  8 0  M8 3 L7 3  7 6  8 6');
definePathPattern('Seed', 'M0 0 A9 9 0 0 0 12 0  A9 9 180 0 0 0 0');
definePathPattern('SemiCircle', 'M0 0 A4 4 0 0 1 8 0');
definePathPattern('BlindHem', 'M0 4 L2 4  4 0  6 4  8 4');
definePathPattern('Zipper', 'M0 4 L1 4 1 0 8 0 8 4 9 4  M0 6 L3 6 3 2 6 2 6 6 9 6');
//definePathPattern("Zipper2", "M0 4 L1 4 1 0 8 0 8 4 9 4  M0 7 L3 7 3 3 6 3 6 7 9 7");
definePathPattern('Herringbone', 'M0 2 L2 4 0 6  M2 0 L4 2  M4 6 L2 8');
definePathPattern('Sawtooth', 'M0 3 L4 0 2 6 6 3');

// แต่งงานกัน
const marriageLink = $(go.Link, { selectable: false, curve: go.Link.Bezier }, $(go.Shape));
linkTemplateMap.add('marriage', marriageLink);

// อยู่ด้วยกัน
const togetherLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape, { stroke: 'transparent', pathPattern: PathPatterns.get('Dash') }),
    $(go.Shape, 'LineH', {
        width: 15,
        height: 1,
        segmentIndex: 0,
        segmentOffset: new go.Point(0, 0),
        segmentOrientation: go.Link.OrientUpright
    }),
    $(go.Shape, 'LineH', {
        width: 15,
        height: 1,
        segmentIndex: -1,
        segmentOffset: new go.Point(0, 0),
        segmentOrientation: go.Link.OrientUpright
    })
);
linkTemplateMap.add('together', togetherLink);

// อย่าร้าง/แยกกันอยู่
const divorceLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape),
    $(
        go.Panel,
        'Horizontal',
        {
            segmentOffset: new go.Point(0, 0),
            segmentOrientation: go.Link.OrientUpright
        },
        $(go.Shape, 'LineV', {
            width: 1,
            height: 20,
            angle: 30
        }),
        $(go.Shape, 'LineV', {
            width: 1,
            height: 20,
            angle: 30
        })
    )
);
linkTemplateMap.add('divorce', divorceLink);

// ทะเลาะ/ขัดแย้ง
const quarrelLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape, { stroke: 'transparent', pathPattern: PathPatterns.get('BigZigzag') })
);
linkTemplateMap.add('quarrel', quarrelLink);

// ห่างเหินกัน
const distantLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape, { stroke: 'transparent', pathPattern: PathPatterns.get('Dash') })
);
linkTemplateMap.add('distant', distantLink);

// สนิทกัน
const closeFriendLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape, { stroke: 'transparent', pathPattern: PathPatterns.get('Double') })
);
linkTemplateMap.add('closeFriend', closeFriendLink);

// สนิทกันมากเป็นพิเศษ
const verycloseFriendLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape, { stroke: 'transparent', pathPattern: PathPatterns.get('Triple') })
);
linkTemplateMap.add('veryCloseFriend', verycloseFriendLink);

// ควบคุม/มีอำนาจเหนือกว่า
const controlLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape),
    $(go.Shape, { toArrow: 'Standard', fill: 'black', scale: 1.5, strokeWidth: 1.5 })
);
linkTemplateMap.add('control', controlLink);

// ใช้ความรุนแรง
const violenceLink = $(
    go.Link,
    { selectable: false, curve: go.Link.Bezier },
    $(go.Shape, { stroke: 'transparent', pathPattern: PathPatterns.get('BigZigzag') }),
    $(go.Shape, { toArrow: 'Standard', fill: 'black', scale: 1.5, strokeWidth: 1.5 })
);
linkTemplateMap.add('violence', violenceLink);

// ลูก
const childLink = $(
    go.Link,
    {
        routing: go.Link.Orthogonal,
        selectable: false,
        fromSpot: go.Spot.Bottom,
        toSpot: go.Spot.Top
    },
    $(go.Shape)
);
linkTemplateMap.add('child', childLink);

export default linkTemplateMap;
