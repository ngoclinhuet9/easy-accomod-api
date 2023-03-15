import mongoose from 'mongoose'
import OwnerSchema, {OwnerDocument} from '../schemas/owner'

export default mongoose.model<OwnerDocument>('Owner', OwnerSchema)
