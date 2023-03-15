import mongoose from 'mongoose'
import BookmarkSchema, {BookmarkDocument} from '../schemas/bookmark'

export default mongoose.model<BookmarkDocument>('Bookmark', BookmarkSchema)
