import {Schema, Document, Date} from 'mongoose'

export interface RenterRoomDocument extends Document {
  room?: Schema.Types.ObjectId
  renter?: Schema.Types.ObjectId
  owner?: Schema.Types.ObjectId
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
  renter: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Renter',
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Room',
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
