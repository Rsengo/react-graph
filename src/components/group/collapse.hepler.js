import { getGroupNodes, createGroupPolygon } from "./group.helper";
import { uniqBy } from "../../utils";

const getCollapsedData = (nodes, links, groups) => {
    const nodesWithoutGroups = Object.values(nodes).filter(
        ({ groups: nodeGroups }) => !nodeGroups || !nodeGroups.length
    );
    const nodesWithGroups = Object.values(nodes).filter(({ groups: nodeGroups }) => nodeGroups && nodeGroups.length);

    const groupNodes = getGroupNodes(nodesWithGroups);

    const collapsedNodes = Object.values(groups).map(({ id, fillColor }) => {
        const currentGroupNodes = groupNodes[id];
        const { centroid } = createGroupPolygon(currentGroupNodes);

        return {
            id,
            color: fillColor,
            x: centroid[0],
            y: centroid[1],
        };
    });

    const collapsedLinks = Object.values(links).map(link => {
        const { target, source } = link;

        const { id: sourceId } = source;
        const sourceNode = nodesWithGroups.find(({ id }) => id === sourceId);
        const sourceGroups = sourceNode?.groups || [sourceId];

        const { id: targetId } = target;
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
