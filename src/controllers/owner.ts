import Owner from '../models/owner'
import User from '../models/user'
import Room from '../models/room'
import renterRoom from '../models/renterRoom'
import renter from '../models/renter'
import {MiddlewareFn} from '../types/express.d'
import { ALL } from 'dns'

export const createOwner: MiddlewareFn = async (req, res, next) => {
  try {
    const {
      email,
      identity,
      name,
      address,
      phone,
    }: {email: string; identity: string; name: string; address: string; phone: string} = req.body
    const _id = req.user.uid
    const newOwner = new Owner({email, identity, name, address, phone})
    await newOwner.save()

    const newUser = new User({roles: ['owner'], _id, owner: newOwner._id})
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
  } catch (error) {
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

export const getPendingOwners: MiddlewareFn = async (req, res, next) => {
  try {
    const owners = await User.find({status: 'PENDING', roles: {$in: ['owner']}}).populate({
      path: 'owner',
      select: '-_id',
      match: {status: 'PENDING'},
    })
    if (owners) {
      return res.status(200).json({
        success: true,
        data: owners,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get owners failed',
    })
  }
}

export const getApprovedOwners: MiddlewareFn = async (req, res, next) => {
  try {
    const owners = await User.find({status: 'APPROVED', roles: {$in: ['owner']}})
      .populate({
        path: 'owner',
        // select: '-_id',
        model: 'Owner',
        match: {status: 'APPROVED'},
      })
      .exec()
    if (owners) {
      return res.status(200).json({
        success: true,
        data: owners,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get owners failed',
    })
  }
}

export const approveOwner: MiddlewareFn = async (req, res, next) => {
  try {
    const {owner_id} = req.params
    const user = await User.findOne({_id: owner_id}).populate('owner')
    const owner = await Owner.findOne({_id: user?.get('owner')._id})
    await user?.update({status: 'APPROVED'})
    await owner?.update({status: 'APPROVED'})
    if (owner) {
      return res.status(200).json({
        success: true,
        data: {...owner, status: 'APPROVED'},
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

export const rejectOwner: MiddlewareFn = async (req, res, next) => {
  try {
    const {owner_id} = req.params
    const user = await User.findOne({_id: owner_id}).populate('owner')
    const owner = await Owner.findOne({_id: user?.get('owner')._id})
    await user?.update({status: 'REJECTED'})
    await owner?.update({status: 'REJECTED'})
    if (owner) {
      return res.status(200).json({
        success: true,
        data: {...owner, status: 'REJECTED'},
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

export const updateOwnerInfo: MiddlewareFn = async (req, res, next) => {
  try {
    const {owner_id} = req.params
    const user = await User.findOne({_id: owner_id}).populate('owner')
    const owner = user?.get('owner')
    await owner.update({...req.body})
    if (owner) {
      return res.status(200).json({
        success: true,
        data: {...owner._doc, ...req.body},
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

export const getPendingRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const rooms = await Room.find({owner: _id, status: 'PENDING'})
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

export const getRejectedRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const rooms = await Room.find({owner: _id, status: 'REJECTED'})
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

export const getApprovedRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const rooms = await Room.find({owner: _id, status: 'APPROVED'})
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

export const getRentRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const rooms = await renterRoom.find({owner: _id}).populate('room').populate('renter')
    // const rooms = await Room.find({owner: _id, isRent: true}).populate('renter')
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

export const getRentRoomsById: MiddlewareFn = async (req, res, next) => {
  try {
    const {renterRoomId} = req.params;
    const renterRooms = await renterRoom.findOne({_id: renterRoomId}).populate('room').populate('renter')
    return res.status(200).json({
      success: true,
      data: renterRooms,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const getReadyRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const rooms = await Room.find({owner: _id, isRent: false, status: 'APPROVED'})
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

export const handleRentRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {room_id} = req.params
    const renterRooms = await renterRoom.findOne({_id: room_id, owner: _id})
    if (renterRooms) {
      await renterRooms.update({payFlag: true})
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
      error: 'update rooms failed',
    })
  }
}

export const handleReturnRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id, owner: _id})
    if (room) {
      await room.update({isRent: false})
      return res.status(200).json({
        success: true,
        data: room,
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
      error: 'update rooms failed',
    })
  }
}
