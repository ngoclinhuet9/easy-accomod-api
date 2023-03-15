"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var review_1 = require("../schemas/review");
exports["default"] = mongoose_1["default"].model('Review', review_1["default"]);
