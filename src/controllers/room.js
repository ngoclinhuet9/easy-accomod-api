"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.renewRoom = exports.updateRoom = exports.rejectRoom = exports.approveRoom = exports.getPendingRooms = exports.getRoomsByCity = exports.getRoomDetail = exports.createRoom = void 0;
var room_1 = require("../models/room");
var bookmark_1 = require("../models/bookmark");
var review_1 = require("../models/review");
var createRoom = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, newRoom, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                _id = req.user._id;
                newRoom = new room_1["default"](__assign({ owner: _id }, req.body));
                return [4 /*yield*/, newRoom.save()];
            case 1:
                _a.sent();
                return [4 /*yield*/, newRoom.populate('owner')];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        data: newRoom
                    })];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'Create room failed'
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createRoom = createRoom;
var getRoomDetail = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var room_id, room, reviews, _id, bookmark, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                room_id = req.params.room_id;
                return [4 /*yield*/, room_1["default"].findOne({ _id: room_id }).populate('owner')];
            case 1:
                room = _a.sent();
                return [4 /*yield*/, review_1["default"].find({ room: room_id }).populate('renter')];
            case 2:
                reviews = _a.sent();
                _id = req.user._id;
                if (!(_id !== '')) return [3 /*break*/, 4];
                return [4 /*yield*/, bookmark_1["default"].findOne({ renter: _id, room: room_id })];
            case 3:
                bookmark = _a.sent();
                if (bookmark) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            data: { room: room, reviews: reviews, is_bookmarked: bookmark.isActive }
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        data: { room: room, reviews: reviews, is_bookmarked: false }
                    })];
            case 4: return [2 /*return*/, res.status(200).json({
                    success: true,
                    data: { room: room, reviews: reviews }
                })];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'get room failed'
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getRoomDetail = getRoomDetail;
var getRoomsByCity = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var city, rooms, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                city = req.params.city;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, room_1["default"].find({ city: city, status: 'APPROVED' })
                        .populate('owner')
                        .populate('reviews')];
            case 2:
                rooms = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        data: rooms
                    })];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'get rooms failed'
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getRoomsByCity = getRoomsByCity;
var getPendingRooms = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var rooms, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, room_1["default"].find({ status: 'PENDING' }).populate('owner')];
            case 1:
                rooms = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        data: rooms
                    })];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'get rooms failed'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPendingRooms = getPendingRooms;
var approveRoom = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var room_id, room, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                room_id = req.params.room_id;
                return [4 /*yield*/, room_1["default"].findOne({ _id: room_id })];
            case 1:
                room = _a.sent();
                return [4 /*yield*/, (room === null || room === void 0 ? void 0 : room.update({ status: 'APPROVED' }))];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        data: room
                    })];
            case 3:
                error_5 = _a.sent();
                console.log(error_5);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'get rooms failed'
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.approveRoom = approveRoom;
var rejectRoom = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var room_id, room, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                room_id = req.params.room_id;
                return [4 /*yield*/, room_1["default"].findOne({ _id: room_id })];
            case 1:
                room = _a.sent();
                return [4 /*yield*/, (room === null || room === void 0 ? void 0 : room.update({ status: 'REJECTED' }))];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        data: room
                    })];
            case 3:
                error_6 = _a.sent();
                console.log(error_6);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'get rooms failed'
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.rejectRoom = rejectRoom;
var updateRoom = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var room_id, room, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                room_id = req.params.room_id;
                return [4 /*yield*/, room_1["default"].findOne({ _id: room_id })];
            case 1:
                room = _a.sent();
                if ((room === null || room === void 0 ? void 0 : room.status) === 'APPROVED') {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Not allow to edit room info'
                        })];
                }
                if (!((room === null || room === void 0 ? void 0 : room.status) === 'PENDING')) return [3 /*break*/, 3];
                return [4 /*yield*/, room.update(__assign({}, req.body))];
            case 2:
                _a.sent();
                if (room) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            data: __assign(__assign({}, room), req.body)
                        })];
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                console.log(error_7);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'update failed'
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateRoom = updateRoom;
var renewRoom = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var room_id, room, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                room_id = req.params.room_id;
                return [4 /*yield*/, room_1["default"].findOne({ _id: room_id })];
            case 1:
                room = _a.sent();
                if ((room === null || room === void 0 ? void 0 : room.isRent) === false) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Not allow to edit room info'
                        })];
                }
                if (!((room === null || room === void 0 ? void 0 : room.isRent) === true)) return [3 /*break*/, 3];
                return [4 /*yield*/, room.update(__assign(__assign({}, req.body), { status: 'PENDING', isRent: false }))];
            case 2:
                _a.sent();
                if (room) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            data: __assign(__assign({}, room), req.body)
                        })];
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                console.log(error_8);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'update failed'
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.renewRoom = renewRoom;
