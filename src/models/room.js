"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var room_1 = require("../schemas/room");
exports["default"] = mongoose_1["default"].model('Room', room_1["default"]);
