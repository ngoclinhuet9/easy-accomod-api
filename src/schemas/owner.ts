import {Schema, Document} from 'mongoose'

export interface OwnerDocument extends Document {
  email: string
  identity: string
  name: string
  address: string
  phone: string
  status: string
  rooms: [Schema.Types.ObjectId]
  isActive: boolean
}

const OwnerSchema: Schema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email is existed'],
    required: [true, 'Email is required'],
  },
  identity: {
    type: String,
    required: [true, 'Identity is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  phone: {
    type: String,
    validate: {
      validator(v: string) {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(v)
      },
      message: (props: any) => `${props.value} is not a valid phone number`,
    },
    required: [true, 'Phone is required'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
  ],
  isActive: {
    type: String,
    required: [true, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default OwnerSchema
