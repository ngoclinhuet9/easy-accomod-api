import User from '../models/user';
import Token from '../models/token';
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


export const updateUserInfo: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id = req.user._id
    const user = await User.findOne({_id: user_id})
    if (user) {
      await user.update({...req.body})
      return res.status(200).json({
        success: true,
        data: {user},
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

export const updateToken: MiddlewareFn = async (req, res, next) => {
  try {
    let user_id = req.user._id
    let token = req.headers.authorization
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    const tokens = await Token.findOne({token: token})
    if (tokens) {
      return res.status(200).json({
        success: true,
        data: tokens,
      })
    }
    else{
      var dateCompare = new Date((new Date().getTime() - (15 * 60 * 1000)))
      const unTokens = await Token.aggregate([
        {
          $match : {
            createDate: {
              $gte: dateCompare
            },
            token: 'Unauthorized',
            IP: ipAddr,
          }
        },
        { $sort: { createDate: -1 }},
        {$limit: 1}
      ])
      console.log(unTokens,'linh testb');
      
      const token_array: any[] = [];
    unTokens.forEach((token: any) => {
      token_array.push(token._id)
    })
    const _lasttoken = await Token.findOne({
      _id: {$exists: true, $in: token_array}})
      if(token){
        const user = await User.findOne({_id: user_id})
        if(_lasttoken){
          await _lasttoken.updateOne({token: token, createDate: new Date(),user: user_id, role: user?.role})
          console.log(_lasttoken,'vô đây');
          return res.status(200).json({
            success: true,
            data: _lasttoken,
          })
        }
        else{
          const newToken = new Token({token: token, createDate: new Date(), user: user_id, role: user?.role, IP: ipAddr})
          console.log('vô đây chứ');
          await newToken.save()
          return res.status(200).json({
            success: true,
            data: newToken,
          })
        }}
      if(token == null && unTokens.length){
        console.log('hay là vô đây');
        
        //await unTokens.updateOne({createDate: new Date()})
        return res.status(200).json({
          success: true,
          data: unTokens,
        })
      }
      if(token == null && !unTokens.length){
        const newToken = new Token({token: 'Unauthorized', createDate: new Date(), role: 'user', IP: ipAddr})
        await newToken.save()
        console.log(newToken,'vô đây mà k vô chỗ khác');
        
        return res.status(200).json({
          success: true,
          data: newToken,
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