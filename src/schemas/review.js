"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var ReviewSchema = new mongoose_1.Schema({
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
    content: {
        type: String,
        required: [true, 'content is required']
    },
    rating: {
        type: Number,
        required: false,
        "default": 5
    },
    status: {
        type: String,
        required: true,
        "enum": ['APPROVED', 'REJECTED', 'PENDING'],
        "default": 'PENDING'
    }
});
exports["default"] = ReviewSchema;
