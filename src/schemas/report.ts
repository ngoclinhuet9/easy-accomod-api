import {Schema, Document} from 'mongoose'

export interface ReportDocument extends Document {
  renter: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  content: string
  status: string
}

const ReportSchema: Schema = new Schema({
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
  status: {
    type: String,
    required: true,
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
})

export default ReportSchema
