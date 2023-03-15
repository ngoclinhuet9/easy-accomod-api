import {Schema, Document} from 'mongoose'

export interface EditInfoRequestDocument extends Document {
  owner: Schema.Types.ObjectId
  identity?: string
  name?: string
  address?: string
  phone?: string
  status: string
  isActive: boolean
}

const EditInfoRequestSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'owner is required'],
    ref: 'Owner',
  },
  identity: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: [true, 'status is required'],
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
  isActive: {
    type: Boolean,
    required: [true, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default EditInfoRequestSchema
