import mongoose from 'mongoose'
import EditInfoRequestSchema, {EditInfoRequestDocument} from '../schemas/editInfoRequest'

export default mongoose.model<EditInfoRequestDocument>('EditInfoRequest', EditInfoRequestSchema)
