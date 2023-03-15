import Bookmark from '../models/bookmark'
import {MiddlewareFn} from '../types/express.d'

export const createBookmark: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {roomId} = req.body
    const exist = await Bookmark.exists({renter: _id, room: roomId})
    if (exist) {
      const bookmark = await Bookmark.findOne({renter: _id, room: roomId})
      await bookmark?.update({isActive: true})
      return res.status(200).json({
        success: true,
        data: {renter: _id, room: roomId},
      })
    }
    const newBookmark = new Bookmark({renter: _id, room: roomId})
    await newBookmark.save()
    return res.status(200).json({
      success: true,
      data: {renter: _id, room: roomId},
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'create bookmark failed',
    })
  }
}

export const removeBookmark: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {roomId} = req.body
    const bookmark = await Bookmark.findOne({renter: _id, room: roomId})
    await bookmark?.update({isActive: false})
    return res.status(200).json({
      success: true,
      data: 'Delete bookmark successfully',
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'create bookmark failed',
    })
  }
}

export const getAllBookmarks: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const bookmarks = await Bookmark.find({renter: _id, isActive: true}).populate({
      path: 'room',
      populate: {
        path: 'reviews',
      },
    })
    return res.status(200).json({
      success: true,
      data: bookmarks,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get bookmarks failed',
    })
  }
}
