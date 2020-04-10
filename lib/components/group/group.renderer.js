"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderGroups = renderGroups;

var _react = _interopRequireDefault(require("react"));

var _Group = _interopRequireDefault(require("../group/Group"));

var _group = require("./group.builder");

var _group2 = require("./group.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends.apply(this, arguments);
}

function renderGroups(nodes, groups, config) {
    var nodeGroups = (0, _group2.getGroupNodes)(nodes);
    return groups.map(function(group) {
        var groupNodes = nodeGroups[group.id];
        var props = (0, _group.buildGroupProps)(group, groupNodes, config);
        return /*#__PURE__*/ _react["default"].createElement(
            _Group["default"],
            _extends(
                {
                    key: group.id,
                },
                props
            )
        );
    });
}
