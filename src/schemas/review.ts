import {Schema, Document} from 'mongoose'

export interface ReviewDocument extends Document {
  user: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  content: string
  rating?: number
  status: string
  type: number //1: review, 0: comment
}

const ReviewSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'renter is required'],
    ref: 'User',
  },
  room: {
    type: Schema.Types.ObjectId,
    required: [true, 'room is required'],
    ref: 'Room',
  },
  content: {
    type: String,
    required: [true, 'content is required'],
  },
  rating: {
    type: Number,
    required: false,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'APPROVED',
  },
  type: {
    type: Number,
    required: true,
    enum: [0,1],
    default: 0,
  },
})

export default ReviewSchema
