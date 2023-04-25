import {Schema, Document, Date} from 'mongoose'

export interface RentHistoryDocument extends Document {
  room?: Schema.Types.ObjectId
  user?: Schema.Types.ObjectId
  startDate: Date
  endPlanDate: Date
  endActualtDate: Date
  requestType: String
  createDate: Date
  reviewed: boolean
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
  },
  endPlanDate: {
    type: String,
    required: true,
  },
  endActualtDate: {
    type: String,
    required: false,
  },
  requestType: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
  reviewed: {
    type: Boolean,
    required: true,
  }
})

export default RentHistorySchema
