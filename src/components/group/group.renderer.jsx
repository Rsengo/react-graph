import React from "react";

import Group from "../group/Group";
import { buildGroupProps } from "./group.builder";
import { getGroupNodes } from "./group.helper";

function renderGroups(nodes, groups, config) {
    const nodeGroups = getGroupNodes(nodes);

    return groups.map(group => {
        const groupNodes = nodeGroups[group.id];
        const props = buildGroupProps(group, groupNodes, config);

        return <Group key={group.id} {...props} />;
    });
}

export { renderGroups };
