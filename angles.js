/**
 * @license Angles.js v0.1.0 08/04/2016
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function(root) {

  'use strict';

  var TAU = 2 * Math.PI;
  var EPS = 1e-15;

  var DIRECTIONS = [
    "N", "NE", "E", "SE", "S", "SW", "W", "NW"
  ];

  var Angles = {
    'SCALE': 360,
    /**
     * Normalize an arbitrary angle to the interval [-180, 180)
     * 
     * @param {number} n
     * @returns {number}
     */
    'normalizeHalf': function(n) {

      var c = this['SCALE'];
      var h = this['SCALE'] / 2;
      // return mod(a + 180, 360) - 180;
      return (n % c + c + h) % c - h;
    },
    /**
     * Normalize an arbitrary angle to the interval [0, 360)
     * 
     * @param {number} n
     * @returns {number}
     */
    'normalize': function(n) {

      var c = this['SCALE'];
      var h = this['SCALE'] / 2;
      // return mod(a, 360);
      return (n % c + c) % c;
    },
    /**
     * Gets the shortest direction to rotate to another angle
     * 
     * @param {number} from
     * @param {number} to
     * @returns {number}
     */
    'shortestDirection': function(from, to) {

      var z = from - to;
      // mod(-z, 360) < mod(z, 360) <=> mod(z + 180, 360) < 180       , for all z \ 180

      // if (mod(-z, 360) < mod(z, 360)) {
      if (this['normalizeHalf'](z) < 0) {
        return -1; // Left
      } else {
        return +1; // Right
      }
    },
    /**
     * Checks if an angle is between two other angles
     * 
     * @param {number} n
     * @param {number} a
     * @param {number} b
     * @returns {boolean}
     */
    'between': function(n, a, b) { // Check if an angle n is between a and b

      var c = this['SCALE'];
      n = (n % c + c) % c;
      a = (a % c + c) % c;
      b = (b % c + c) % c;

      if (a < b)
        return a <= n && n <= b;
      // return 0 <= n && n <= b || a <= n && n < 360;
      return a <= n || n <= b;
    },
    /**
     * Calculates the angular difference between two angles
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    'diff': function(a, b) {
      return Math.abs(b - a) % this['SCALE'];
    },
    /**
     * Calculate the minimal distance between two angles
     * 
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    'distance': function(a, b) {

      var m = this['SCALE'];

      // One-Liner:
      //return Math.min(mod(a - b, m), mod(b - a, m));

      var diff = this['normalizeHalf'](a - b);

      if (diff > m / 2)
        diff = diff - m;

      return Math.abs(diff);
    },
    /**
     * Calculate radians from current angle
     * 
     * @param {number} n
     * @returns {number}
     */
    'toRad': function(n) {
      // https://en.wikipedia.org/wiki/Radian
      return n / this['SCALE'] * TAU;
    },
    /**
     * Calculate degrees from current angle
     * 
     * @param {number} n
     * @returns {number}
     */
    'toDeg': function(n) {
      // https://en.wikipedia.org/wiki/Degree_(angle)
      return n / this['SCALE'] * 360;
    },
    /**
     * Calculate gons from current angle
     * 
     * @param {number} n
     * @returns {number}
     */
    'toGon': function(n) {
      // https://en.wikipedia.org/wiki/Gradian
      return n / this['SCALE'] * 400;
    },
    /**
     * Given the sine and cosine of an angle, what is the original angle?
     * 
     * @param {number} sin
     * @param {number} cos
     * @returns {number}
     */
    'fromSinCos': function(sin, cos) {

      var s = this['SCALE'];
      var angle = (1 + Math.acos(cos) / TAU) * s;

      if (sin < 0) {
        angle = s - angle;
      }
      return (angle % s + s) % s;
    },
    /**
     * What is the angle of two points making a line
     * 
     * @param {Array} p1 
     * @param {Array} p2
     * @returns {number}
     */
    'fromSlope': function(p1, p2) {

      var s = this['SCALE'];
      var angle = (1 + Math.atan((p2[1] - p1[1]) / (p2[0] - p1[0])) / TAU) * s;

      return (angle % s + s) % s;
    },
    /**
     * Returns the quadrant 
     * 
     * @param {number} x The point x-coordinate
     * @param {number} y The point y-coordinate
     * @param {number=} k The optional number of regions in the coordinate-system
     * @param {number=} shift An optional angle to rotate the coordinate system
     * @returns {number}
     */
    'quadrant': function(x, y, k, shift) {

      var s = this['SCALE'];

      if (k === undefined)
        k = 4; // How many regions? 4 = quadrant, 8 = octant, ...

      if (shift === undefined)
        shift = 0; // Rotate the coordinate system by shift° (positiv = counter-clockwise)

      /* shift = PI / k, k = 4:
       *   I) 45-135
       *  II) 135-225
       * III) 225-315
       *  IV) 315-360
       */

      /* shift = 0, k = 4:
       *   I) 0-90
       *  II) 90-180
       * III) 180-270
       *  IV) 270-360
       */

      var phi = (Math.atan2(y, x) + TAU) / TAU;

      var tmp = phi * s % (s / k);

      if (Math.abs(tmp) < EPS) {
        return 0;
      }

      var tmp = Math.floor(k * shift / s + k * phi);

      return 1 + (tmp % k + k) % k;
    },
    /**
     * Calculates the compass direction of the given angle
     * 
     * @param {number} angle
     * @returns {string}
     */
    'compass': function(angle) {

      var s = this['SCALE'];
      var k = DIRECTIONS.length;

      var dir = Math.round((angle / s) * k);

      return DIRECTIONS[(dir % k + k) % k];
    }
  };

  if (typeof define === "function" && define["amd"]) {
    define([], function() {
      return Angles;
    });
  } else if (typeof exports === "object") {
    module["exports"] = Angles;
  } else {
    root['Angles'] = Angles;
  }

})(this);

