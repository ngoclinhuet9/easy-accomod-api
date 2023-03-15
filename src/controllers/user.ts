import {MiddlewareFn} from '../types/express.d'

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
