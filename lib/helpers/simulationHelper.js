"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.createForceSimulation = exports.graphLinkForceConfig = void 0;

var _d3Force = require("d3-force");

var _graph = _interopRequireDefault(require("../components/graph/graph.const"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * This method runs {@link d3-force|https://github.com/d3/d3-force}
 * against the current graph.
 * @returns {undefined}
 */
var graphLinkForceConfig = function graphLinkForceConfig(simulation, links, config) {
    var forceLink = (0, _d3Force.forceLink)(links)
        .id(function(l) {
            return l.id;
        })
        .distance(config.d3.linkLength)
        .strength(config.d3.linkStrength);
    simulation.force(_graph["default"].LINK_CLASS_NAME, forceLink);
};
/**
 * Create d3 forceSimulation to be applied on the graph.<br/>
 * {@link https://github.com/d3/d3-force#forceSimulation|d3-force#forceSimulation}<br/>
 * {@link https://github.com/d3/d3-force#simulation_force|d3-force#simulation_force}<br/>
 * Wtf is a force? {@link https://github.com/d3/d3-force#forces| here}
 * @param  {number} width - the width of the container area of the graph.
 * @param  {number} height - the height of the container area of the graph.
 * @param  {number} gravity - the force strength applied to the graph.
 * @returns {Object} returns the simulation instance to be consumed.
 * @memberof Graph/helper
 */

exports.graphLinkForceConfig = graphLinkForceConfig;

var createForceSimulation = function createForceSimulation(width, height, gravity) {
    var frx = (0, _d3Force.forceX)(width / 2).strength(_graph["default"].FORCE_X);
    var fry = (0, _d3Force.forceY)(height / 2).strength(_graph["default"].FORCE_Y);
    var forceStrength = gravity; //TODO

    return (0, _d3Force.forceSimulation)()
        .force("charge", (0, _d3Force.forceManyBody)().strength(forceStrength))
        .force("center", (0, _d3Force.forceCenter)(width / 2, height / 2)); // .force("x", frx)
    // .force("y", fry);
};

exports.createForceSimulation = createForceSimulation;
