import User from '../models/user';
import {MiddlewareFn} from '../types/express.d'

export const createUser: MiddlewareFn = async (req, res, next) => {
  try {
    const {
      email,
      identity,
      name,
      role,
      address,
      phone,
    }: {email: string; identity: string; name: string; role: string, address: string; phone: string} = req.body
    const uid = req.user.uid
    // const newOwner = new Owner({email, identity, name, address, phone})
    // await newOwner.save()
    let status = ''
    if(role === 'owner'){
      status = 'PENDING'
    }
    else{
      status = 'APPROVED'
    }
    const newUser = new User({role, uid, email, identity, name, address, phone,status})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        role,
        identity,
        name,
        address,
        phone,
        status
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

export const getRole: MiddlewareFn = async (req, res, next) => {
  try {
    const {user} = req
    
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const getProfileUser: MiddlewareFn = async (req, res, next) => {
  try {
    const {user} = req
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
export const getProfile: MiddlewareFn = async (req, res, next) => {
  try {
    const {user} = req
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
