import mongoose from 'mongoose'
import RenterRoomSchema, {RenterRoomDocument} from '../schemas/renterRoom'

export default mongoose.model<RenterRoomDocument>('RenterRoom', RenterRoomSchema)
