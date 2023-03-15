import {Schema, Document} from 'mongoose'

export interface AdminDocument extends Document {
  email: string
  name: string
  isActive: boolean
}

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email is existed'],
    required: [true, 'Email is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  isActive: {
    type: String,
    required: [true, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default AdminSchema
