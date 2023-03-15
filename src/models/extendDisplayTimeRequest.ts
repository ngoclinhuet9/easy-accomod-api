import mongoose from 'mongoose'
import ExtendDisplayTimeRequestSchema, {ExtendDisplayTimeRequestDocument} from '../schemas/extendDisplayTimeRequest'

export default mongoose.model<ExtendDisplayTimeRequestDocument>(
  'ExtendDisplayTimeRequest',
  ExtendDisplayTimeRequestSchema
)
