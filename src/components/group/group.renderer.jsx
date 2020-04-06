import React from "react";

import Group from "../group/Group";
import { buildGroupProps } from "./group.builder";

function renderGroups(nodes, groups, config) {
    const nodeGroups = Object.values(nodes).reduce((aggregator, node) => {
        if (!node.groups || !node.groups.length) {
            return aggregator;
        }

        const { groups } = node;

        groups.forEach(group => {
            if (!aggregator[group]) {
                aggregator[group] = [node];
            } else {
                aggregator[group] = [...aggregator[group], node];
            }
        });

        return aggregator;
    }, {});

    return groups.map(group => {
        const groupNodes = nodeGroups[group.id];
        const props = buildGroupProps(group, groupNodes, config);

        return <Group key={group.id} {...props} />;
    });
}

export { renderGroups };
