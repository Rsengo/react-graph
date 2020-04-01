import React from "react";
import { createGroupPolygon } from "./group.helper";

const Group = ({ nodes, scale, fillOpacity, fillColor }) => {
    const { polygon, centroid } = createGroupPolygon(nodes);

    return (
        <g style={{ transform: `translate(${centroid[0]}px, ${centroid[1]}px) scale(${scale})` }}>
            <path
                d={polygon}
                style={{
                    fillOpacity,
                    fill: fillColor,
                }}
            />
        </g>
    );
};

export default Group;
