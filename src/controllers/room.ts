import Room from '../models/room'
import User from '../models/user'
import renterRoom from '../models/renterRoom'
import Bookmark from '../models/bookmark'
import Review from '../models/review'
import {MiddlewareFn} from '../types/express'
import {log} from "util";

export const createRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const newRoom = new Room({owner: _id, ...req.body})
    await newRoom.save()
    await newRoom.populate('owner')
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
      rooms = await Room.find({roomType, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED'})
    } 
    else if (!roomType && city) {
      rooms = await Room.find({city, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED'})
    }
    else if (!roomType && !city) {
      rooms = await Room.find({roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED'})
    }
    else {
      rooms = await Room.find({city, roomType, roomPrice: {$gte: minPrice || 0, $lte: maxPrice || 100000000} ,status: 'APPROVED'})
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
    console.log(room_id);
    const room = await Room.findOne({_id: room_id}).populate('owner')
    const reviews = await Review.find({room: room_id}).populate('renter')
    const {_id} = req.user
    if (_id !== '') {
      const bookmark = await Bookmark.findOne({renter: _id, room: room_id})
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
      .populate('owner')
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
    const rooms = await Room.find({status: 'PENDING'}).populate('owner')
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
    const {_id} = req.user
    const room = await Room.findOne({_id: room_id})
    const newRentRoom = new renterRoom({renter: _id, room: room_id, owner: room?.owner, startDate: startDate, endDate: endDate, payFlag: false})
    console.log(room);
    if (room?.isRent === true || room?.status != 'APPROVED') {
      return res.status(400).json({
        success: false,
        error: 'Not allow to edit room info',
      })
    }

    if (room?.isRent === false && room?.status === 'APPROVED') {
      //await room.update({ isRent: true })
      //await Room.findOneAndUpdate({_id: room_id}, {...room} )
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
