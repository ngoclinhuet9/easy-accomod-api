import mongoose from 'mongoose'
import AdminSchema, {AdminDocument} from '../schemas/admin'

export default mongoose.model<AdminDocument>('Admin', AdminSchema)
