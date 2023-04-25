import Room from '../models/room'
import User from '../models/user'
import renterRoom from '../models/renterRoom'
import RentHistory from '../models/rentHistory'
import Bookmark from '../models/bookmark'
import Review from '../models/review'
import {MiddlewareFn} from '../types/express'
import moment from 'moment'
import {log} from "util";

export const createRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id= req.user._id
    console.log(req.body);
    const newRoom = new Room({user: user_id, ...req.body})
    await newRoom.save()
    await newRoom.populate('user')
    return res.status(200).json({
      success: true,
      data: newRoom,
    })
  } catch (error) {
    // console.log(error)
    return res.status(400).json({
      success: false,
      error: 'Create room failed',
    })
  }
}

export const getRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const {city, maxPrice, minPrice, roomType} = req?.query

    let rooms: any[] = []

    if (!city && roomType) {
      rooms = await Room.find({roomType, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
      .populate({
        path: 'review',
        aggregate: {
          $group:
         {
           _id: "$room",
           avgRate: { $avg: "$rating" }
         }
        }
      })
    } 
    else if (!roomType && city) {
      rooms = await Room.find({city, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
      .populate({
        path: 'review',
        aggregate: {
          $group:
         {
           _id: "$room",
           avgRate: { $avg: "$rating" }
         }
        }
      })
    }
    else if (!roomType && !city) {
      rooms = await Room.find({roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
      .populate({
        path: 'review',
        aggregate: {
          $group:
         {
           _id: "$room",
           avgRate: { $avg: "$rating" }
         }
        }
      })
    }
    else {
      rooms = await Room.find({city, roomType, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
      .populate({
        path: 'review',
        aggregate: {
          $group:
         {
           _id: "$room",
           avgRate: { $avg: "$rating" }
         }
        }
      })
    }
    

    return res.status(200).json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    
  }
}

export const getRoomDetail: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id}).populate('user')
    const reviews = await Review.find({room: room_id, type: 1}).populate('user')
    const comments = await Review.find({room: room_id, type: 0}).populate('user')
    const user_id = req.user._id
    if (user_id !== '') {
      const renterRooms = await renterRoom.findOne({room: room_id,user: user_id})
      const bookmark = await Bookmark.findOne({user: user_id, room: room_id})
      const histories = await RentHistory.findOne({room: room_id,user: user_id,reviewed:false})
      if (bookmark) {
        return res.status(200).json({
          success: true,
          data: {user_id,room, reviews, comments, is_bookmarked: bookmark.isActive,renterRooms, histories},
        })
      }
      return res.status(200).json({
        success: true,
        data: {room, reviews,comments, is_bookmarked: false,renterRooms},
      })
    }

    return res.status(200).json({
      success: true,
      data: {room, reviews, comments},
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get room failed',
    })
  }
}

export const getRoomsByCity: MiddlewareFn = async (req, res, next) => {
  const {city} = req.params
  try {
    const rooms = await Room.find({city, status: 'APPROVED'})
      .populate('user')
      .populate('reviews')
    return res.status(200).json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const getPendingRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const rooms = await Room.find({status: 'PENDING'}).populate('user')
    return res.status(200).json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const approveRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    if(room){
      await room.updateOne({status: 'APPROVED'})
    }
    return res.status(200).json({
      success: true,
      data: room,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const rejectRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    await room?.updateOne({status: 'REJECTED'})
    return res.status(200).json({
      success: true,
      data: room,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const updateRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    if (room?.isRent === true) {
      return res.status(400).json({
        success: false,
        error: 'Not allow to edit room info',
      })
    }
    if (room?.isRent === false) {
      await room.update({...req.body, status: 'PENDING'})
      if (room) {
        return res.status(200).json({
          success: true,
          data: {...room, ...req.body},
        })
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update failed',
    })
  }
}

export const renewRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    if (room?.isRent === false) {
      return res.status(400).json({
        success: false,
        error: 'Not allow to edit room info',
      })
    }
    if (room?.isRent === true) {
      await room.update({...req.body, status: 'PENDING', isRent: false})
      if (room) {
        return res.status(200).json({
          success: true,
          data: {...room, ...req.body},
        })
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update failed',
    })
  }
}

export const bookingRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const startDate= req.body._startDate
    const endDate= req.body._endDate
    const {room_id} = req.params
    const user_id = req.user._id
    const room = await Room.findOne({_id: room_id})
    const newRentRoom = new renterRoom({user: user_id, room: room_id, startDate: startDate, endPlanDate: endDate,
       payFlag: false, requestType: 0, status: 1})
    if (room?.isRent === true || room?.status != 'APPROVED') {
      return res.status(400).json({
        success: false,
        error: 'Not allow to edit room info',
      })
    }
    if (room?.isRent === false && room?.status === 'APPROVED') {
      await room.update({ isRent: true })
      
      newRentRoom.save()
      return res.status(200).json({
        success: true,
        data: [
          newRentRoom,
          room,
        ]
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update failed',
    })
  }
}


export const returnRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const room_id = req.params.room_id
    const renterRooms= await renterRoom.findOne({room: room_id})
    if (renterRooms) {
      await renterRooms.updateOne({requestType: '1', status: 1})
      return res.status(200).json({
        success: true,
        data: renterRooms,
      })
    }
    return res.status(403).json({
      success: false,
      error: 'Not allow to update',
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update failed',
    })
  }
} 

export const handlePayment: MiddlewareFn = async (req, res, next) => {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let config = require('../config/serviceAccountKey.json')
    let tmnCode = config.tmnCode
    let secretKey = config.secretKey 
    let vnpUrl = config.vnpUrl
  
    let returnUrl = req.body.returnURL

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss')
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    // let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    //let amount = req.body.amount;
    let amount = req.body.amount;
    
    let bankCode = 'NCB'
    let locale = 'vn'
    let currCode = 'VND';
    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    } 
    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");  

    vnp_Params['vnp_SecureHash'] = signed;
    
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
     res.status(200).json({
      data: {
        vnpUrl
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'call api failed',
    })
  }
}
function sortObject(obj: any) {
	let sorted: any = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

