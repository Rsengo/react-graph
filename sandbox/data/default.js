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
        // {
        //     source: "lead_1",
        //     target: "common_emp_1",
        // },
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
        // {
        //     source: "lead_2",
        //     target: "common_emp_1",
        // },
    ],
    nodes: [
        {
            id: "cto",
        },
        {
            id: "lead_1",
            groups: ["group_1"],
        },
        {
            id: "lead_2",
            groups: ["group_2"],
        },
        {
            id: "lead_1_emp_1",
            groups: ["group_1"],
        },
        {
            id: "lead_1_emp_2",
            groups: ["group_1"],
        },
        {
            id: "lead_1_emp_3",
            groups: ["group_1"],
        },
        {
            id: "lead_1_emp_4",
            groups: ["group_1"],
        },
        {
            id: "lead_1_emp_5",
            groups: ["group_1"],
        },
        {
            id: "lead_2_emp_1",
            groups: ["group_2"],
        },
        {
            id: "lead_2_emp_2",
            groups: ["group_2"],
        },
        {
            id: "lead_2_emp_3",
            groups: ["group_2"],
        },
        {
            id: "lead_2_emp_4",
            groups: ["group_2"],
        },
        {
            id: "lead_2_emp_5",
            groups: ["group_2"],
        },
        {
            id: "common_emp_1",
            groups: ["group_1", "group_2"],
        },
    ],
    groups: [
        {
            id: "group_1",
        },
        {
            id: "group_2",
        },
    ],
};
