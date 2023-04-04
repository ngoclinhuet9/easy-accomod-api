import Renter from '../models/renter'
import User from '../models/user'
import {MiddlewareFn} from '../types/express.d'

export const createRenter: MiddlewareFn = async (req, res, next) => {
  try {
    const {email, name, phone}: {email: string; name: string; phone: string} = req.body
    const _id = req.user.uid
    const newRenter = new Renter({email, name, phone})
    await newRenter.save()

    const newUser = new User({roles: ['renter'], _id, renter: newRenter._id})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        name,
        phone,
      },
    })
  } catch (error) {
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
    const renters = await User.find({roles: {$in: ['renter']}}).populate({
      path: 'renter',
    })
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
      error: 'get owners failed',
    })
  }
}
