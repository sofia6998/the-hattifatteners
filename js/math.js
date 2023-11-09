class M3x3 {
  constructor(initValue) {
    this.matrix = initValue || [
      [1,0,0],
      [0,1,0],
      [0,0,1]
    ]
  }

  multiply(m) {
    return [
      [
        rowXCol(getRow(this.matrix, 0), getColumn(m, 0)),
        rowXCol(getRow(this.matrix, 0), getColumn(m, 1)),
        rowXCol(getRow(this.matrix, 0), getColumn(m, 2)),
      ],
      [
        rowXCol(getRow(this.matrix, 1), getColumn(m, 0)),
        rowXCol(getRow(this.matrix, 1), getColumn(m, 1)),
        rowXCol(getRow(this.matrix, 1), getColumn(m, 2)),
      ],
      [
        rowXCol(getRow(this.matrix, 2), getColumn(m, 0)),
        rowXCol(getRow(this.matrix, 2), getColumn(m, 1)),
        rowXCol(getRow(this.matrix, 2), getColumn(m, 2)),
      ]
    ];
  }

  transition(x, y) {
    const res = new M3x3(this.matrix);
    res.matrix[0][2] += x;
    res.matrix[1][2] += y;
    return res;
  }

  getFloatArray() {
    return new Float32Array(this.matrix.flat());
  }

  scale(x, y) {
    return new M3x3([
      [
        rowXCol(getRow(this.matrix, 0), [x, x, x]),
        rowXCol(getRow(this.matrix, 0), [x, x, x]),
        rowXCol(getRow(this.matrix, 0), [x, x, x]),
      ],
      [
        rowXCol(getRow(this.matrix, 1), [y, y, y]),
        rowXCol(getRow(this.matrix, 1), [y, y, y]),
        rowXCol(getRow(this.matrix, 1), [y, y, y]),
      ],
      getRow(this.matrix, 2),
    ]);
  }
}

function getRow(m, index) {
  return m[index];
}

function getColumn(m, index) {
  return m.map(x => x[index]);
}

function rowXCol(row, col) {
  return row[0] * col[0] + row[1] * col[1] + row[2] * col[2];
}

const m1 = new M3x3([
  [1,0,0],
  [2,5,0],
  [0,0,1]
])

const m2 = [
  [3,0,6],
  [0,3,4],
  [0,0,1]
];

class VMath {
  static add(...vectors) {
    return  vectors.reduce((v, acc) => [acc[0] + v[0], acc[1] + v[1]], [0,0]);
  }
  static mult(v1, a) {
    return [v1[0] * a, v1[1] * a];
  }
}

function getPointByIndex(points, i) {
  return [points[i * 2], points[i * 2  + 1]];
}
function getPointOnBezierCurve(points, offset, t) {
  const invT = (1 - t);
  return VMath.add(VMath.mult(getPointByIndex(points, offset + 0), invT * invT * invT),
    VMath.mult(getPointByIndex(points, offset + 1), 3 * t * invT * invT),
    VMath.mult(getPointByIndex(points, offset + 2), 3 * invT * t * t),
    VMath.mult(getPointByIndex(points, offset + 3), t * t  *t));
}

function getPointsOnBezierCurve(points, offset, numPoints) {
  const cpoints = [];
  for (let i = 0; i < numPoints; ++i) {
    const t = i / (numPoints - 1);
    cpoints.push(getPointOnBezierCurve(points, offset, t));
  }
  return cpoints.flat();
}

