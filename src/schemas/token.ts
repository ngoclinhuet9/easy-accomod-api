import {Schema, Document} from 'mongoose'

export interface TokenDocument extends Document {
  token: string
  user: Schema.Types.ObjectId
  role: string
  createDate: Date
  IP: String
}

const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: [true, 'token is required'],
  },
  User: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  role: {
    type: String,
    required: [true, 'role is required'],
    enum: ['admin', 'renter', 'owner', 'user'],
  },
  createDate: {
    type: Date,
    required: [true, 'createDate is required'],
  },
  IP: {
    type: String,
    required: [true, 'IP is required'],
  },
})

export default TokenSchema
