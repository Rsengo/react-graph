"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.generateRainbowColor = void 0;

var _d = require("d3");

var _randomGenearator = (0, _d.randomUniform)();

var generateRainbowColor = function generateRainbowColor() {
    return (0, _d.interpolateRainbow)(_randomGenearator());
};

exports.generateRainbowColor = generateRainbowColor;
