import {Schema, Document} from 'mongoose'

export interface OrderDocument extends Document {
  renterRoom: Schema.Types.ObjectId
  amount: number
  orderInfor: string
  transactionNo: string
  responseCode: string
  transactionStatus: string
  payDate: Date
}

const OrderSchema: Schema = new Schema({
  amount: {
    type: Number,
    required: [true, 'amount is required'],
  },
  orderInfor: {
    type: String,
    required: [true, 'orderInfor is required'],
  },
  transactionNo: {
    type: String,
    required: [true, 'transactionNo is required'],
  },
  responseCode: {
    type: String,
    required: [true, 'responseCode is required'],
  },
  transactionStatus: {
    type: String,
    required: [false, 'transactionStatus is required'],
  },
  renterRoom: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
  },
  payDate: {
  type: Date,
  required: [true, 'payDate is required'],
  },
})

export default OrderSchema
