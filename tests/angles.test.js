
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
  {m: angles.shortestDirection, p: [50, 60], r: -1, s: 360},
  {m: angles.shortestDirection, p: [60, 50], r: 1, s: 360},
  {m: angles.shortestDirection, p: [60 + 360 * 3, 50 + 360 * 7], r: 1, s: 360},
  {m: angles.shortestDirection, p: [60 - 360 * 3, 50 - 360 * 7], r: 1, s: 360},
  {m: angles.fromSinCos, p: [Math.sin(0.3), Math.cos(0.3)], r: 0.3, s: Math.PI * 2},
  {m: angles.fromSinCos, p: [Math.sin(-0.3), Math.cos(-0.3)], r: Math.PI * 2 - 0.3, s: Math.PI * 2},
  {m: angles.fromSinCos, p: [Math.sin(0.7), Math.cos(0.7)], r: 0.7, s: Math.PI * 2},
  {m: angles.fromSinCos, p: [Math.sin(-0.7), Math.cos(-0.7)], r: Math.PI * 2 - 0.7, s: Math.PI * 2}
];

describe('Angles', function() {

  for (var i = 0; i < tests.length; i++) {

    (function(i) {

      it('Should work with test #' + (i + 1), function() {

        var c = tests[i];
        angles.SCALE = c.s;
        c.m.apply(angles, c.p).should.be.approximately(c.r, 1e-15);
      });

    })(i);
  }
});