import {Schema, Document} from 'mongoose'

export interface BookmarkDocument extends Document {
  renter: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  isActive: boolean
}

const BookmarkSchema: Schema = new Schema({
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
  isActive: {
    type: Boolean,
    required: [true, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default BookmarkSchema
