"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var bookmark_1 = require("../schemas/bookmark");
exports["default"] = mongoose_1["default"].model('Bookmark', bookmark_1["default"]);
