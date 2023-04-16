import Renter from '../models/renter'
import User from '../models/user'
import Room from '../models/room'
import RentHistory from '../models/rentHistory'
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

export const updateRenterInfo: MiddlewareFn = async (req, res, next) => {
  try {
    const {renter_id} = req.params
    const renter = await User.findOne({_id: renter_id})
    //.populate('Renter')
    //const renter = await Renter.findOne({_id: renter_id})
    if (renter) {
      await renter.update({...req.body})
      return res.status(200).json({
        success: true,
        data: {renter, ...req.body},
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

export const getHistory: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id = req.user._id
    const historyRooms: any[] = [];
    (await RentHistory.find({user: user_id, rentFlag: '3'})).forEach((room: any) => {
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