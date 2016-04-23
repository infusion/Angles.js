
var should = require('should');
var angles = require('../angles.js');

var tests = [
  {m: angles.between, p: [38, 13, 45], r: true, s: 360},
  {m: angles.between, p: [38, 40, 45], r: false, s: 360},
  {m: angles.between, p: [12, 5, 18], r: true, s: 60},
  {m: angles.between, p: [15, 2, 18], r: true, s: 12},
  {m: angles.between, p: [38 + 360 * 3, 13 - 360 * 2, 45 + 360], r: true, s: 360},
  {m: angles.toRad, p: [90], r: Math.PI / 2, s: 360},
  {m: angles.toDeg, p: [Math.PI], r: 180, s: Math.PI * 2},
  {m: angles.toRad, p: [180], r: Math.PI, s: 360},
  {m: angles.toDeg, p: [Math.PI], r: 180, s: Math.PI * 2},
  {m: angles.distance, p: [1, 359], r: 2, s: 360},
  {m: angles.distance, p: [358, 1], r: 3, s: 360},
  {m: angles.distance, p: [18, 25], r: 7, s: 360},
  {m: angles.distance, p: [1, 359], r: 2, s: 360},
  {m: angles.normalize, p: [55], r: 55, s: 360},
  {m: angles.normalize, p: [55 + 360], r: 55, s: 360},
  {m: angles.normalize, p: [-55], r: 305, s: 360},
  {m: angles.normalize, p: [-190], r: 170, s: 360},
  {m: angles.normalizeHalf, p: [55], r: 55, s: 360},
  {m: angles.normalizeHalf, p: [55 + 360], r: 55, s: 360},
  {m: angles.normalizeHalf, p: [-55], r: -55, s: 360},
  {m: angles.normalizeHalf, p: [-190], r: 170, s: 360},
  {m: angles.fromSlope, p: [[1, 1], [5, 10]], r: 66.03751102542182, s: 360},
  {m: angles.fromSlope, p: [[124, 8984], [234, 10322]], r: 85.30015415271286, s: 360},
  {m: angles.fromSlope, p: [[424, 8984], [234, 10322]], r: 98.08213603676147, s: 360},
  {m: angles.fromSlope, p: [[345, -78445], [3475890, 8495]], r: 1.4329425927144732, s: 360},
  {m: angles.shortestDirection, p: [50, 60], r: -1, s: 360},
  {m: angles.shortestDirection, p: [60, 50], r: 1, s: 360},
  {m: angles.shortestDirection, p: [60 + 360 * 3, 50 + 360 * 7], r: 1, s: 360},
  {m: angles.shortestDirection, p: [60 - 360 * 3, 50 - 360 * 7], r: 1, s: 360},
  {m: angles.fromSinCos, p: [Math.sin(0.3), Math.cos(0.3)], r: 0.3, s: Math.PI * 2},
  {m: angles.fromSinCos, p: [Math.sin(-0.3), Math.cos(-0.3)], r: Math.PI * 2 - 0.3, s: Math.PI * 2},
  {m: angles.fromSinCos, p: [Math.sin(0.7), Math.cos(0.7)], r: 0.7, s: Math.PI * 2},
  {m: angles.fromSinCos, p: [Math.sin(-0.7), Math.cos(-0.7)], r: Math.PI * 2 - 0.7, s: Math.PI * 2}
];

for (var i = 0; i <= 360; i += 2) {

  if (i % 90 === 0)
    kl = 0;
  else if (i < 90)
    kl = 1;
  else if (i < 180)
    kl = 2;
  else if (i < 270)
    kl = 3;
  else
    kl = 4;

  if (i < 22.5 + 45 * 0) {
    dir = 'N';
  } else if (i < 22.5 + 45 * 1) {
    dir = 'NE';
  } else if (i < 22.5 + 45 * 2) {
    dir = 'E';
  } else if (i < 22.5 + 45 * 3) {
    dir = 'SE';
  } else if (i < 22.5 + 45 * 4) {
    dir = 'S';
  } else if (i < 22.5 + 45 * 5) {
    dir = 'SW';
  } else if (i < 22.5 + 45 * 6) {
    dir = 'W';
  } else if (i < 22.5 + 45 * 7) {
    dir = 'NW';
  } else {
    dir = 'N';
  }

  tests.push({m: angles.quadrant, p: [
      Math.cos(i / 180 * Math.PI),
      Math.sin(i / 180 * Math.PI)
    ], r: kl, s: 360, label: 'Quadrant of angle ' + i});

  tests.push({m: angles.compass, p: [i], r: dir, s: 360, label: 'Direction of angle ' + i});
}

describe('Angles', function() {

  for (var i = 0; i < tests.length; i++) {

    (function(i) {

      it('Should work with test ' + (tests[i].label || "#" + i), function() {

        var c = tests[i];
        angles.SCALE = c.s;
        if (typeof c.r === 'string')
          c.m.apply(angles, c.p).should.be.equal(c.r);
        else
          c.m.apply(angles, c.p).should.be.approximately(c.r, 1e-15);
      });

    })(i);
  }
});