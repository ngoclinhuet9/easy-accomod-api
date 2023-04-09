import mongoose from 'mongoose'
import RentHistorySchema, {RentHistoryDocument} from '../schemas/rentHistory'

export default mongoose.model<RentHistoryDocument>('RentHistory', RentHistorySchema)
