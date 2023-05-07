import Review from '../models/review'
import Room from '../models/room'
import RentHistory from '../models/rentHistory'
import RenterRoom from '../models/renterRoom'
import {MiddlewareFn} from '../types/express.d'

export const createReview: MiddlewareFn = async (req, res, next) => {
  try {
    const user_id = req.user._id
    const room_id = req.body.roomId
    const renterRoom = await RenterRoom.findOne({room: room_id,user: user_id, reviewed: false})
    const rentHistory = await RentHistory.findOne({room: room_id,user: user_id, reviewed: false})
    const {content, rating, roomId, type}: {content: string; rating: number; roomId: any, type:number} = req.body
    const newReview = new Review({
      user: user_id,
      room: roomId,
      content,
      rating,
      type
    })
    await newReview.save()
    const reviews = await Review
    .aggregate([
      {
        $match:
        {
          type:1
        }
      },
      {
        $group:
        {
          _id: '$room',
          avgRate: { $avg: "$rating" }
        }
      }
    ])
    let avgRating= new String
    reviews.forEach((item: any) => {
      if(String(item._id) === room_id){
        avgRating = String(item.avgRate.toFixed(1))
      }
    })
   const rooms = await Room.findOne({_id: room_id})
   if(rooms){
    await rooms.update({rating: avgRating})
   }
    if(type === 1){
      
      if(renterRoom){await renterRoom.updateOne({reviewed: true})}
      if(rentHistory){await rentHistory.updateOne({reviewed: true})}
      console.log(renterRoom,rentHistory,'iiiiiiiiiiii');
    }
    return res.status(200).json({
      success: true,
      data: {rooms,
        renter: user_id,
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

export const getIsReview: MiddlewareFn = async (req, res, next) => {
  try {
    const room_id = req.params.room_id
    console.log(req.params,'api review');
    const user_id = req.user._id
    if (user_id !== '') {
      const renterRooms = await RenterRoom.findOne({room: room_id,user: user_id})
      const histories = await RentHistory.findOne({room: room_id,user: user_id,reviewed:false})
      return res.status(200).json({
        success: true,
        data: {renterRooms, histories},
      })
    }
    return res.status(200).json({
      success: true,
      data: {room_id, user_id},
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get room failed',
    })
  }
}