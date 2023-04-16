import {Schema, Document} from 'mongoose'

export interface UserDocument extends Document {
  role: string
  status: string
  email: string
  identity: string
  name: string
  address: string
  phone: string
  rooms: [Schema.Types.ObjectId]
  isActive: boolean
}

const UserSchema: Schema = new Schema({
  uid: {
    type: String,
    required: [true, 'uid is required'],
  },
  role: {
    type: String,
    required: [true, 'role is required'],
    enum: ['admin', 'renter', 'owner'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
  email: {
    type: String,
    unique: [true, 'Email is existed'],
    required: [true, 'Email is required'],
  },
  identity: {
    type: String,
    required: [false, 'Identity is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  address: {
    type: String,
    required: [false, 'Address is required'],
  },
  phone: {
    type: String,
    validate: {
      validator(v: string) {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(v)
      },
      message: (props: any) => `${props.value} is not a valid phone number`,
    },
    required: [false, 'Phone is required'],
   },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
  ],
  isActive: {
    type: String,
    required: [false, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default UserSchema
