import { getGroupNodes, createGroupPolygon } from "./group.helper";
import { uniqBy } from "../../utils";
import { getId } from "../link/link.helper";

const getCollapsedData = (nodes, links, groups) => {
    const nodesWithoutGroups = Object.values(nodes).filter(
        ({ groups: nodeGroups }) => !nodeGroups || !nodeGroups.length
    );
    const nodesWithGroups = Object.values(nodes).filter(({ groups: nodeGroups }) => nodeGroups && nodeGroups.length);

    const groupNodes = getGroupNodes(nodesWithGroups);

    const collapsedNodes = Object.values(groups).map(({ id, name, fillColor }) => {
        const currentGroupNodes = groupNodes[id];
        const { centroid } = createGroupPolygon(currentGroupNodes);

        return {
            id,
            name: name,
            color: fillColor,
            x: centroid[0],
            y: centroid[1],
        };
    });

    const collapsedLinks = links.map(link => {
        const { target, source } = link;

        const sourceId = getId(source);
        const sourceNode = nodesWithGroups.find(({ id }) => id === sourceId);
        const sourceGroups = sourceNode?.groups || [sourceId];

        const targetId = getId(target);
        const targetNode = nodesWithGroups.find(({ id }) => id === targetId);
        const targetGroups = targetNode?.groups || [targetId];

        const linksArray = [];

        sourceGroups.forEach(sourceGroup => {
            targetGroups.forEach(targetGroup => {
                linksArray.push({
                    ...link,
                    target: targetGroup,
                    source: sourceGroup,
                });
            });
        });

        return linksArray;
    });

    const collapsedLinksFlat = collapsedLinks.flat();
    const flattenCollapsedLinks = uniqBy(collapsedLinksFlat, ({ target, source }) => target + source);

    const resultNodes = [...nodesWithoutGroups, ...collapsedNodes].reduce((agg, curNode) => {
        return { ...agg, [curNode.id]: curNode };
    }, {});

    return {
        nodes: resultNodes,
        links: flattenCollapsedLinks,
    };
};

export { getCollapsedData };
