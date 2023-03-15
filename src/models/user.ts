import mongoose from 'mongoose'
import UserSchema, {UserDocument} from '../schemas/user'

export default mongoose.model<UserDocument>('User', UserSchema)
