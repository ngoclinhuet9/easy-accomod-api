import {Schema, Document} from 'mongoose'

export interface ExtendDisplayTimeRequestDocument extends Document {
  room: Schema.Types.ObjectId
  displayTime: number
  displayTimeUnit: Schema.Types.ObjectId
  status: string
}

const ExtendDisplayTimeRequestSchema: Schema = new Schema({
  room: {
    type: String,
    required: [true, 'room is required'],
    ref: 'Room',
  },
  displayTime: {
    type: Number,
    required: [true, 'displayTime is required'],
  },
  displayTimeUnit: {
    type: String,
    required: [true, 'displayTimeUnit is required'],
    ref: 'DisplayTimeUnit',
  },
  status: {
    type: String,
    required: [true, 'status is required'],
    enum: ['APPROVE', 'REJECT', 'PENDING'],
    default: 'PENDING',
  },
})

export default ExtendDisplayTimeRequestSchema
