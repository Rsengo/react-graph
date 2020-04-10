import {
    forceX as d3ForceX,
    forceY as d3ForceY,
    forceSimulation as d3ForceSimulation,
    forceManyBody as d3ForceManyBody,
    forceLink as d3ForceLink,
    forceCenter as d3ForceCenter,
} from "d3-force";

import CONST from "../components/graph/graph.const";

/**
 * This method runs {@link d3-force|https://github.com/d3/d3-force}
 * against the current graph.
 * @returns {undefined}
 */
const graphLinkForceConfig = (simulation, links, config) => {
    const forceLink = d3ForceLink(links)
        .id(l => l.id)
        .distance(config.d3.linkLength)
        .strength(config.d3.linkStrength);

    simulation.force(CONST.LINK_CLASS_NAME, forceLink);
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
const createForceSimulation = (width, height, gravity) => {
    const frx = d3ForceX(width / 2).strength(CONST.FORCE_X);
    const fry = d3ForceY(height / 2).strength(CONST.FORCE_Y);
    const forceStrength = gravity;

    //TODO
    return d3ForceSimulation()
        .force("charge", d3ForceManyBody().strength(forceStrength))
        .force("center", d3ForceCenter(width / 2, height / 2));
    // .force("x", frx)
    // .force("y", fry);
};

export { graphLinkForceConfig, createForceSimulation };
