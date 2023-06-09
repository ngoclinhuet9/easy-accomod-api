import {Schema, Document} from 'mongoose'

export interface RenterDocument extends Document {
  email: string
  name: string
  phone: string
  isActive: boolean
}

const RenterSchema: Schema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email is existed'],
    required: [true, 'Email is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  phone: {
    type: String,
    required: false,
  },
  isActive: {
    type: String,
    required: [true, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default RenterSchema
