/**
 * @license Angles.js v1.0.0 08/04/2016
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function(root) {

  'use strict';

  var TAU = 2 * Math.PI;

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
    'fromSlope': function(p1, p2) {

      var s = this['SCALE'];
      var angle = (1 + Math.atan((p2[1] - p1[1]) / (p2[0] - p1[0])) / TAU) * s;

      return (angle % s + s) % s;
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

