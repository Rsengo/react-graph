module.exports = {
    links: [
        {
            source: "cto",
            target: "lead_1",
        },
        {
            source: "cto",
            target: "lead_2",
        },
        {
            source: "lead_1",
            target: "lead_1_emp_1",
        },
        {
            source: "lead_1",
            target: "lead_1_emp_2",
        },
        {
            source: "lead_1",
            target: "lead_1_emp_3",
        },
        {
            source: "lead_1",
            target: "lead_1_emp_4",
        },
        {
            source: "lead_1",
            target: "lead_1_emp_5",
        },
        {
            source: "lead_2",
            target: "lead_2_emp_1",
        },
        {
            source: "lead_2",
            target: "lead_2_emp_2",
        },
        {
            source: "lead_2",
            target: "lead_2_emp_3",
        },
        {
            source: "lead_2",
            target: "lead_2_emp_4",
        },
        {
            source: "lead_2",
            target: "lead_2_emp_5",
        },
    ],
    nodes: [
        {
            id: "cto",
        },
        {
            id: "lead_1",
            group: "group_1",
        },
        {
            id: "lead_2",
            group: "group_2",
        },
        {
            id: "lead_1_emp_1",
            group: "group_1",
        },
        {
            id: "lead_1_emp_2",
            group: "group_1",
        },
        {
            id: "lead_1_emp_3",
            group: "group_1",
        },
        {
            id: "lead_1_emp_4",
            group: "group_1",
        },
        {
            id: "lead_1_emp_5",
            group: "group_1",
        },
        {
            id: "lead_2_emp_1",
            group: "group_2",
        },
        {
            id: "lead_2_emp_2",
            group: "group_2",
        },
        {
            id: "lead_2_emp_3",
            group: "group_2",
        },
        {
            id: "lead_2_emp_4",
            group: "group_2",
        },
        {
            id: "lead_2_emp_5",
            group: "group_2",
        },
    ],
    groups: [
        {
            id: "group_1",
            fillColor: "red",
        },
        {
            id: "group_2",
            fillColor: "blue",
        },
    ],
};
