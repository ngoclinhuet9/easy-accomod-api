import {Schema, Document} from 'mongoose'

export interface ReviewDocument extends Document {
  renter: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  content: string
  rating?: number
  status: string
}

const ReviewSchema: Schema = new Schema({
  renter: {
    type: Schema.Types.ObjectId,
    required: [true, 'renter is required'],
    ref: 'Renter',
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
    default: 'PENDING',
  },
})

export default ReviewSchema
