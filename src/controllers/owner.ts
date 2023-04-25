import Owner from '../models/owner'
import User from '../models/user'
import Room from '../models/room'
import RenterRoom from '../models/renterRoom'
import renter from '../models/renter'
import Review from '../models/review'
import RentHistory from '../models/rentHistory'
import {MiddlewareFn} from '../types/express.d'
import { ALL } from 'dns'
import { isNull } from 'util'

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
    // const newOwner = new Owner({email, identity, name, address, phone})
    // await newOwner.save()

    const newUser = new User({roles: ['owner'], _id, email, identity, name, address, phone})
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
    const owners = await User.find({status: 'PENDING', role: 'owner'})
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
    const owners = await User.find({status: 'APPROVED', role: 'owner'})
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
    const owner = await User.findOne({_id: owner_id})
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
    const owner = await User.findOne({_id: owner_id})//.populate('owner')
    //const owner = await Owner.findOne({_id: user?.get('owner')._id})
    await owner?.update({status: 'REJECTED'})
    //await owner?.update({status: 'REJECTED'})
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
    const rooms = await Room.find({user: _id, status: 'PENDING'})
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
    const rooms = await Room.find({user: _id, status: 'REJECTED'})
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
    const rooms = await Room.find({user: _id, status: 'APPROVED'})
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
    const user_id = req.user._id
    const ownerRooms: any[] = [];
    (await Room.find({user: user_id})).forEach((room: any) => {
      ownerRooms.push(room._id)
    })
    const rooms = await RenterRoom.find({
      room: {$exists: true, $in: ownerRooms}
    }).populate('room').populate('user')
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
export const getRentRoomsRenter: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id = req.user._id
    const rooms = await RenterRoom.find({user: user_id}).populate('room').populate('user')
    // const rooms = await Room.find({user: _id, isRent: true}).populate('renter')
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
    const renterRooms = await RenterRoom.findOne({_id: renterRoomId}).populate('room').populate('user')
    const reviews = await Review.find({room: renterRooms?.room}).populate('user')
    
    return res.status(200).json({
      success: true,
      data: {renterRooms,reviews}
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
    const renterRooms: any[] = [];
    (await RenterRoom.find()).forEach((renterRoom: any) => {
      renterRooms.push(renterRoom.room)
    })
    const rooms = await Room.find({
      user: _id, 
      isRent: false,
      status: 'APPROVED',
      _id: {$exists: true, $nin: renterRooms}
    })
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

export const handleAcceptRoom: MiddlewareFn = async (req, res, next) => {
  try {
    let currentDate = new Date()
    const renterRoom_id = req.params.renterRoom_id
    const renterRooms = await RenterRoom.findOne({_id: renterRoom_id})
    const room = await Room.findOne({_id: renterRooms?.room})
    if (renterRooms?.requestType === '0' && renterRooms?.status === 1) {
      console.log('vô đây');
      await renterRooms.update({payFlag: true, status: 0})
      await room?.update({ countRent: room?.countRent + 1})
      return res.status(200).json({
        success: true,
        data: renterRooms
      })
    }
    if (renterRooms?.requestType === '1' && renterRooms?.status === 1) {
      console.log('hay vô dây');
      
      await room?.updateOne({ isRent: false})
      const newRentHistory = new RentHistory({user: renterRooms?.user, room: room?.id, startDate: renterRooms?.startDate, 
      endPlanDate: renterRooms?.endPlanDate, createDate: currentDate, requestType: 1, reviewed: renterRooms?.reviewed})
      await newRentHistory.save()
      await RenterRoom.deleteOne({_id: renterRoom_id})
      return res.status(200).json({
        success: true,
        data: renterRooms, newRentHistory
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
    const renterRoom_id = req.params.renterRoom_id
    const renterRooms = await RenterRoom.findOne({_id: renterRoom_id})
    const room = await Room.findOne({_id: renterRooms?.room})
    if (renterRooms?.requestType === '0' && renterRooms?.status === 1) {
      await RenterRoom.deleteOne({_id: renterRoom_id})
      await room?.updateOne({isRent: false})
      return res.status(200).json({
        success: true,
        data: room,
      })
    }
    if (renterRooms?.requestType === '1' && renterRooms?.status === 1) {
      await renterRooms.updateOne({requestType: '0', status: 0})
      await room?.updateOne({isRent: false})
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

export const handleDeleteRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {user_id} = req.user
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    if (room) {
      await Room.deleteOne({_id: room_id})
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
      error: 'Delete rooms failed',
    })
  }
}



