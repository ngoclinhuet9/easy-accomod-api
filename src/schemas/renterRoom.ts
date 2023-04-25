import {Schema, Document, Date} from 'mongoose'

export interface RenterRoomDocument extends Document {
  room?: Schema.Types.ObjectId
  user?: Schema.Types.ObjectId
  startDate: Date
  endPlanDate: Date
  endActualtDate: Date
  requestType: String  //0: Thuê phòng, 1: trả phòng
  status: Number       //0: approved, 1: pending
  payFlag: boolean
  createDate: Date
  reviewed: boolean
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
  status: {
    type: Number,
    required: true,
    enum: [0,1]
  },
  payFlag: {
    type: Boolean,
    required: false,
    enum: [true, false],
    default: false,
  },
  createDate: {
    type: Date,
    required: false,
  },
  reviewed: {
    type: Boolean,
    required: false,
    default: false
  }
})

export default RenterRoomSchema
