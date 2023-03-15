import mongoose from 'mongoose'
import DisplayTimeUnitSchema, {DisplayTimeUnitDocument} from '../schemas/displayTimeUnit'

export default mongoose.model<DisplayTimeUnitDocument>('DisplayTimeUnit', DisplayTimeUnitSchema)
