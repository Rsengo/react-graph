"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _group = require("./group.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var Group = function Group(_ref) {
    var nodes = _ref.nodes,
        scale = _ref.scale,
        fillOpacity = _ref.fillOpacity,
        fillColor = _ref.fillColor;

    var _createGroupPolygon = (0, _group.createGroupPolygon)(nodes),
        polygon = _createGroupPolygon.polygon,
        centroid = _createGroupPolygon.centroid;

    return /*#__PURE__*/ _react["default"].createElement(
        "g",
        {
            style: {
                transform: "translate("
                    .concat(centroid[0], "px, ")
                    .concat(centroid[1], "px) scale(")
                    .concat(scale, ")"),
            },
        },
        /*#__PURE__*/ _react["default"].createElement("path", {
            d: polygon,
            style: {
                fillOpacity: fillOpacity,
                fill: fillColor,
            },
        })
    );
};

var _default = Group;
exports["default"] = _default;
