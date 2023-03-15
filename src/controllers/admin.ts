import Admin from '../models/admin'
import {MiddlewareFn} from '../types/express.d'

export const createAdmin: MiddlewareFn = async (req, res, next) => {
  try {
    const {email, name}: {email: string; name: string} = req.body
    const _id = req.user.uid
    const newAdmin = new Admin({email, name})
    await newAdmin.save()

    const newUser = new Admin({roles: ['admin'], _id, owner: newAdmin._id})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        name,
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
