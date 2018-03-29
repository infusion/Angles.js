/**
 * @license Angles.js v0.2.1 08/04/2016
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function(root) {

  'use strict';

  const TAU = 2 * Math.PI;
  const EPS = 1e-15;

  // const DIRECTIONS = ["N", "E", "S", "W"];
  const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  // const DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

  /**
   * Mathematical modulo
   * 
   * @param {number} x
   * @param {number} m
   * @returns {number}
   */
  function mod(x, m) {
    return (x % m + m) % m;
  }

  const Angles = {
    'SCALE': 360,
    /**
     * Normalize an arbitrary angle to the interval [-180, 180)
     *
     * @param {number} n
     * @returns {number}
     */
    'normalizeHalf': function(n) {

      const c = this['SCALE'];
      const h = c / 2;

      return mod(n + h, c) - h;
    },
    /**
     * Normalize an arbitrary angle to the interval [0, 360)
     *
     * @param {number} n
     * @returns {number}
     */
    'normalize': function(n) {

      const c = this['SCALE'];

      return mod(n, c);
    },
    /**
     * Gets the shortest direction to rotate to another angle
     *
     * @param {number} from
     * @param {number} to
     * @returns {number}
     */
    'shortestDirection': function(from, to) {

      const z = from - to;
      // mod(-z, 360) < mod(z, 360) <=> mod(z + 180, 360) < 180       , for all z \ 180

      if (from === to) {
        return 0;
        // if (mod(-z, 360) < mod(z, 360)) {
      } else if (this['normalizeHalf'](z) < 0) {
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

      const c = this['SCALE'];
      n = mod(n, c);
      a = mod(a, c);
      b = mod(b, c);

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

      const m = this['SCALE'];
      const h = m / 2;

      // One-Liner:
      //return Math.min(mod(a - b, m), mod(b - a, m));

      let diff = this['normalizeHalf'](a - b);

      if (diff > h)
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

      const s = this['SCALE'];
      let angle = (1 + Math.acos(cos) / TAU) * s;

      if (sin < 0) {
        angle = s - angle;
      }
      return mod(angle, s);
    },
    /**
     * What is the angle of two points making a line
     *
     * @param {Array} p1
     * @param {Array} p2
     * @returns {number}
     */
    'fromSlope': function(p1, p2) {

      const s = this['SCALE'];
      const angle = (TAU + Math.atan2(p2[1] - p1[1], p2[0] - p1[0])) % TAU;

      return angle / TAU * s;
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

      const s = this['SCALE'];

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

      const phi = (Math.atan2(y, x) + TAU) / TAU;

      if (Math.abs(phi * s % (s / k)) < EPS) {
        return 0;
      }

      return 1 + mod(Math.floor(k * shift / s + k * phi), k);
    },
    /**
     * Calculates the compass direction of the given angle
     *
     * @param {number} course
     * @returns {string}
     */
    'compass': function(course) {

      // 0° = N
      // 90° = E
      // 180° = S
      // 270° = W

      const s = this['SCALE'];
      const k = DIRECTIONS.length;

      // floor((2ck + s) / (2s)) = round((c / s) * k)
      const dir = Math.round(course / s * k);

      return DIRECTIONS[mod(dir, k)];
    },
    /**
     * Calculates the linear interpolation of two angles
     *
     * @param {number} a Angle one
     * @param {number} b Angle two
     * @param {number} p Percentage
     * @param {number} dir Direction (either 1 [=CW] or -1 [=CCW])
     * @returns {number}
     */
    'lerp': function(a, b, p, dir) {

      const s = this['SCALE'];
      a = mod(a, s);
      b = mod(b, s);

      if (a === b)
        return a;

      // dir becomes an offset if we have to add a full revolution (=scale)
      if (!dir)
        dir =-s;
      else if ((dir === 1) === (a < b))
        dir*= s;
      else
        dir = 0;

      return mod(a + p * (b - a - dir), s);
    }
  };

  if (typeof define === "function" && define["amd"]) {
    define([], function() {
      return Angles;
    });
  } else if (typeof exports === "object") {
    Object.defineProperty(exports, "__esModule", {'value': true});
    module['exports'] = Angles;
    exports['Angles'] = Angles;
    exports['default'] = Angles;
  } else {
    root['Angles'] = Angles;
  }

})(this);
