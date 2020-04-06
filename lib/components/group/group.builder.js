"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.buildGroupProps = buildGroupProps;

function buildGroupProps(group, nodes, config) {
    var groupsConfig = config.group;
    var fillColor = group.fillColor;
    var fillOpacity = group.fillOpacity || groupsConfig.fillOpacity;
    var scale = group.scale || groupsConfig.scale;
    return {
        nodes: nodes,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        scale: scale,
    };
}
