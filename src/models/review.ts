import mongoose from 'mongoose'
import ReviewSchema, {ReviewDocument} from '../schemas/review'

export default mongoose.model<ReviewDocument>('Review', ReviewSchema)
