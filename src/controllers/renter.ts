import Renter from '../models/renter'
import User from '../models/user'
import Room from '../models/room'
import RentHistory from '../models/rentHistory'
import RenterRoom from '../models/renterRoom'
import Order from '../models/order'
import {MiddlewareFn} from '../types/express.d'

export const createRenter: MiddlewareFn = async (req, res, next) => {
  try {
    const {
      email,
      identity,
      name,
      address,
      phone,
    }: {email: string; identity: string; name: string; address: string; phone: string} = req.body
    const _id = req.user.uid
    
    // const newRenter = new Renter({email, name, phone})
    // await newRenter.save()

    const newUser = new User({roles: ['renter'], _id, email, identity, name, address, phone})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        identity,
        name,
        address,
        phone,
      },
    })
  } catch (error: any) {
    console.log(error)
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email or _id is existed',
      })
    }

    return res.status(400).json({
      success: false,
      error: error.errors[Object.keys(error.errors)[0]].message,
    })
  }
}

export const getAllRenter: MiddlewareFn = async (req, res, next) => {
  try {
    const renters = await User.find({role: 'renter'})
    if (renters) {
      return res.status(200).json({
        success: true,
        data: renters,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get renters failed',
    })
  }
}

export const getHistory: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id = req.user._id
    const historyRooms: any[] = [];
    (await RentHistory.find({user: user_id, requestType: 1})).forEach((room: any) => {
      historyRooms.push(room._id)
    })
    const rooms = await Room.find({
      _id: {$exists: true, $in: historyRooms}
    }).populate('user')
    return res.status(200).json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get history failed',
    })
  }
}


export const getRenting: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id = req.user._id
    const renterRooms: any[] = [];
    const renting = await RenterRoom.find({user: user_id,
      $or:[{requestType: 1, status: 1},{requestType: 0}]}).populate({
        path: 'room',
        populate: {path: 'user'}
      })
    // renting.forEach((renting: any) => {
    //     renterRooms.push(renting.room)
    // })
    // const room = await Room.find({
    //   _id: {$exists: true, $in: renterRooms}
    // }).populate('user').populate('renterRoom')
    return res.status(200).json({
      success: true,
      data: renting
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get history failed',
    })
  }
}


export const handleRentByPay: MiddlewareFn = async (req, res, next) => {
  try {
    let {vnp_Params} = req.query
    console.log(vnp_Params, "linh check log")
    return res.status(403).json({
      success: false,
      error: 'Not allow to update',
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update rooms failed',
    })
  }
}