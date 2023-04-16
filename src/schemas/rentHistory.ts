import {Schema, Document, Date} from 'mongoose'

export interface RentHistoryDocument extends Document {
  room?: Schema.Types.ObjectId
  user?: Schema.Types.ObjectId
  startDate: Date
  endDate: Date
  rentFlag: String
  createDate: Date
}

const RentHistorySchema: Schema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Room',
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  startDate: {
    type: String,
    required: true,
    ref: 'Start Date',
  },
  endDate: {
    type: String,
    required: true,
    ref: 'End Date'
  },
  rentFlag: {
    type: String,
    required: false
  },
  createDate: {
    type: Date,
    required: true,
    ref: 'Create Date'
  }
})

export default RentHistorySchema
