import mongoose from 'mongoose'
import TokenSchema, {TokenDocument} from '../schemas/token'

export default mongoose.model<TokenDocument>('Token', TokenSchema)
