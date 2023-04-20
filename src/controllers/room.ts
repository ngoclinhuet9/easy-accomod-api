import Room from '../models/room'
import User from '../models/user'
import renterRoom from '../models/renterRoom'
import Bookmark from '../models/bookmark'
import Review from '../models/review'
import {MiddlewareFn} from '../types/express'
import moment from 'moment'
import {log} from "util";

export const createRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id= req.user._id
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
    } 
    else if (!roomType && city) {
      rooms = await Room.find({city, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
    }
    else if (!roomType && !city) {
      rooms = await Room.find({roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
    }
    else {
      rooms = await Room.find({city, roomType, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED', isRent: false})
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
    const reviews = await Review.find({room: room_id}).populate('user')
    const user_id = req.user._id
    
    if (user_id !== '') {
      const bookmark = await Bookmark.findOne({user: user_id, room: room_id})
      if (bookmark) {
        return res.status(200).json({
          success: true,
          data: {room, reviews, is_bookmarked: bookmark.isActive},
        })
      }
      return res.status(200).json({
        success: true,
        data: {room, reviews, is_bookmarked: false},
      })
    }

    return res.status(200).json({
      success: true,
      data: {room, reviews},
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
    await room?.update({status: 'APPROVED'})
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
    await room?.update({status: 'REJECTED'})
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

export const handlePayment: MiddlewareFn = async (req, res, next) => {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let config = require('../config/serviceAccountKey.json')
    let tmnCode = config.tmnCode
    let secretKey = config.secretKey 
    let vnpUrl = config.vnpUrl
  
    let returnUrl = "http://localhost:7002/renter/payment_VN_pay"

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss')
      //https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1000000&vnp_Command=pay&vnp_CreateDate=20230416154359&vnp_CurrCode=VND&vnp_IpAddr=::1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD:16154359&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:7002/order/vnpay_return&vnp_TmnCode=GJKNDUTB&vnp_TxnRef=16154359&vnp_Version=2.1.0&vnp_SecureHash=da999731521a6582944d9633eb17f896e692e9e7d61f11aa6045ff1321b9aeb3afb5d9bab50ab0d5ae052d21e50b4c1bd57567192a901c823ee41a818b44d7df

    //https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000000&vnp_Command=pay&vnp_CreateDate=20230416154219&vnp_CurrCode=VND&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD%3A16154219&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Froom-management.local%3A3000&vnp_TmnCode=GJKNDUTB&vnp_TxnRef=16154219&vnp_Version=2.1.0&vnp_SecureHash=9123f996b3103d5276bfa10d1660d22b9aa1d34acfe1b2c269cf2032de94901486d4ac0c9678c74c02879d5b197dab010809122eb1f8b66a5b10b2ddd5e601ac
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    //let config = require('config');
    
    // let tmnCode = config.get('vnp_TmnCode');
    // let secretKey = config.get('vnp_HashSecret');
    // let vnpUrl = config.get('vnp_Url');
    // let returnUrl = config.get('vnp_ReturnUrl');

    // let tmnCode = config.get('vnp_TmnCode');
    // let secretKey = config.get('vnp_HashSecret');
    // let vnpUrl = config.get('vnp_Url');
    // let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    //let amount = req.body.amount;
    let amount = req.body.amount;
    
    let bankCode = 'NCB'
    //let bankCode = req.body.bankCode;
    
    let locale = 'vn'
    // let locale = req.body.language;
    // if(locale === null || locale === ''){
    //     locale = 'vn';
    // }
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
      //vnp_BankCode: 'NCB',
    } 
    // if(bankCode !== null && bankCode !== ''){
    //     vnp_Params['vnp_BankCode'] = bankCode;
    // }


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

export const getReturnURL: MiddlewareFn = async (req, res, next) => {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    
    let config = require('../config/serviceAccountKey.json')
    let secretKey = config.secretKey 

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.render('success', {code: '97'})
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'call api failed',
    })
  }
}

export const getIPN: MiddlewareFn = async (req, res, next) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('../config/serviceAccountKey.json')
    let secretKey = config.secretKey 
    
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    
    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if(secureHash === signed){ //kiểm tra checksum
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if(rspCode=="00"){
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                    else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
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

