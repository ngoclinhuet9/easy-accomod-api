import {Schema, Document, Date} from 'mongoose'

export interface RenterRoomDocument extends Document {
  room?: Schema.Types.ObjectId
  user?: Schema.Types.ObjectId
  startDate: Date
  endDate: Date
  payFlag: boolean
}

const RenterRoomSchema: Schema = new Schema({
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
  payFlag: {
    type: Boolean,
    required: false,
    enum: [true, false],
    default: false,
  }
})

export default RenterRoomSchema
