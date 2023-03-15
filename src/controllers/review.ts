import Review from '../models/review'
import {MiddlewareFn} from '../types/express.d'

export const createReview: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {content, rating, roomId}: {content: string; rating: number; roomId: string} = req.body
    const newReview = new Review({
      renter: _id,
      room: roomId,
      content,
      rating,
    })
    await newReview.save()
    return res.status(200).json({
      success: true,
      data: {
        renter: _id,
        room: roomId,
        content,
        rating,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'add review failed',
    })
  }
}

export const approveReview: MiddlewareFn = async (req, res, next) => {
  try {
    const {review_id} = req.params
    const review = await Review.findOne({_id: review_id})
    if (review) {
      await review.update({status: 'APPROVED'})
      return res.status(200).json({
        success: true,
        data: {...review, status: 'APPROVED'},
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update review failed',
    })
  }
}

export const rejectReview: MiddlewareFn = async (req, res, next) => {
  try {
    const {review_id} = req.params
    const review = await Review.findOne({_id: review_id})
    if (review) {
      await review.update({status: 'REJECTED'})
      return res.status(200).json({
        success: true,
        data: {...review, status: 'REJECTED'},
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update review failed',
    })
  }
}
