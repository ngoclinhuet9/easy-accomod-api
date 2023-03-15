import mongoose from 'mongoose'
import ReportSchema, {ReportDocument} from '../schemas/report'

export default mongoose.model<ReportDocument>('Report', ReportSchema)
