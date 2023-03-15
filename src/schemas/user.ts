import {Schema, Document} from 'mongoose'

export interface UserDocument extends Document {
  _id: string
  roles: [string]
  user?: Schema.Types.ObjectId
  admin?: Schema.Types.ObjectId
  renter?: Schema.Types.ObjectId
  owner?: Schema.Types.ObjectId
  status: string
}

const UserSchema: Schema = new Schema({
  _id: {
    type: String,
    required: [true, '_id is required'],
  },
  roles: {
    type: [String],
    required: [true, 'isActive is required'],
    enum: ['admin', 'renter', 'owner'],
  },
  renter: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Renter',
  },
  admin: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Admin',
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Owner',
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
})

export default UserSchema
