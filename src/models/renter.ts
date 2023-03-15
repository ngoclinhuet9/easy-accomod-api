import mongoose from 'mongoose'
import RenterSchema, {RenterDocument} from '../schemas/renter'

export default mongoose.model<RenterDocument>('Renter', RenterSchema)
