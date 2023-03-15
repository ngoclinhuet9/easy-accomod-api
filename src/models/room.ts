import mongoose from 'mongoose'
import RoomSchema, {RoomDocument} from '../schemas/room'

export default mongoose.model<RoomDocument>('Room', RoomSchema)
