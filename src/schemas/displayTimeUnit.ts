import {Schema, Document} from 'mongoose'

export interface DisplayTimeUnitDocument extends Document {
  unit: string
  price: number
}

const DisplayTimeUnitSchema: Schema = new Schema({
  unit: {
    type: String,
    required: [true, 'unit is required'],
    enum: ['WEEK', 'MONTH', 'QUARTER', 'YEAR'],
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
})

export default DisplayTimeUnitSchema
