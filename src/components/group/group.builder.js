function buildGroupProps(group, nodes, config) {
    const { group: groupsConfig } = config;

    const { fillColor } = group;
    const fillOpacity = group.fillOpacity || groupsConfig.fillOpacity;
    const scale = group.scale || groupsConfig.scale;

    return {
        nodes,
        fillColor,
        fillOpacity,
        scale,
    };
}

export { buildGroupProps };
