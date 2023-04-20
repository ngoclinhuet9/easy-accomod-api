import admin from '../firebase/admin'
import {MiddlewareFn} from '../types/express.d'
import User from '../models/user'

export const checkRole: MiddlewareFn = async (req, res, next) => {
  let token = req.headers.authorization
  let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        try {
          const user = await User.findOne({uid: decodedToken.uid})
          console.log(user)
          req.user = user
          next()
        } catch (error) {
          console.log(error)
        }
      })
      .catch(() => {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        })
      })
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    })
  }
}

export const checkAuth: MiddlewareFn = async (req, res, next) => {
  let token = req.headers.authorization
  let req_role = req.headers.role
  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        try {
          const user = await User.findOne({uid: decodedToken.uid})
          if(user) {
            req.user = user
            next()
          } else {
            res.status(404).json({
              success: false,
              error: 'User not found',
            })
          }
          
        } catch (error) {
          console.log(error)
        }
      })
      .catch(() => {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        })
      })
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    })
  }
}

export const checkAuthOrNot: MiddlewareFn = async (req, res, next) => {
  let token = req.headers.authorization
  let req_role = req.headers.role

  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        try {
          const user = await User.findOne({uid: decodedToken.uid, role: req_role})
          req.user = user
          next()
          // if (schema?.role.includes(req_role)) {
          //   const user = await User.findOne({_id: decodedToken.uid}).populate(req_role)
          //   req.user = {role: req_role, uid: decodedToken.uid, ...user?.get(req_role)._doc}
          //   next()
          // } else if (schema) {
          //   console.log(schema)
          //   res.status(403).json({
          //     success: false,
          //     error: 'Not allow',
          //   })
          // }
        } catch (error) {
          console.log(error)
        }
      })
      .catch(() => {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        })
      })
  } else {
    req.user = {_id: ''}
    next()
  }
}

export const getUID: MiddlewareFn = async (req, res, next) => {
  let token = req.headers.authorization
  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        req.user = {uid: decodedToken.uid}
        next()
      })
      .catch(() => {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
        })
      })
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    })
  }
}

export const checkAdmin: MiddlewareFn = async (req, res, next) => {
  const {user} = req
  if (user.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      error: 'Not allow',
    })
  }
}

export const checkOwner: MiddlewareFn = async (req, res, next) => {
  const {user} = req
  if (user.role === 'owner') {
    next()
  } else {
    res.status(403).json({
      success: false,
      error: 'Not allow',
    })
  }
}
