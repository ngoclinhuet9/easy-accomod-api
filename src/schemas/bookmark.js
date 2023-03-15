"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var BookmarkSchema = new mongoose_1.Schema({
    renter: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'renter is required'],
        ref: 'Renter'
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'room is required'],
        ref: 'Room'
    },
    isActive: {
        type: Boolean,
        required: [true, 'isActive is required'],
        "enum": [true, false],
        "default": true
    }
});
exports["default"] = BookmarkSchema;
