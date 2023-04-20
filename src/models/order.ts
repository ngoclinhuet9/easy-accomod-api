import mongoose from 'mongoose'
import OrderSchema, {OrderDocument} from '../schemas/order'

export default mongoose.model<OrderDocument>('User', OrderSchema)
