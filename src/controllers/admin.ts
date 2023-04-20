import User from '../models/user'
import Room from '../models/room'
import RentHistory from '../models/rentHistory'
import {MiddlewareFn} from '../types/express.d'

export const createAdmin: MiddlewareFn = async (req, res, next) => {
  try {
    const {email, name}: {email: string; name: string} = req.body
    const _id = req.user.uid
    // const newAdmin = new Admin({email, name})
    // await newAdmin.save()

    const newUser = new User({roles: ['admin'], _id, email, name})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        name,
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

export const getDashboardRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const pendingRoom = await Room.find({status: 'PENDING'}).count()
    const liveRoom = await Room.find({status: 'APPROVED', isRent: false}).count()
    const rentedRoom = await Room.find({status: 'APPROVED', isRent: true}).count()
    return res.status(200).json({
      success: true,
      data: {pendingRoom, liveRoom, rentedRoom}
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get data failed',
    })
  }
}

export const getDashboardRentedRate: MiddlewareFn = async (req, res, next) => {
  try {
    var dateCompare = new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))
    //var lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1))
    const rentedHistory = await RentHistory.aggregate([
      {
        $match : {
          createDate: {
            $gte: dateCompare
          },
          requestType: 1,
        }
      },
      {$group : {_id:{$dateToString: {format: "%Y-%m-%d", date: "$createDate"}}, count:{$sum:1}}},
      { $sort: { _id: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: rentedHistory
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get data failed',
    })
  }
}
