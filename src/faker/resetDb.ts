import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import admin from '../firebase/admin'

dotenv.config()

const resetFirebase = async () => {
  const uidList = [] as Array<string>

  await admin
    .auth()
    .listUsers(1000)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        uidList.push(userRecord.uid)
        console.log(userRecord.uid)
      })
    })
    .catch((error) => {
      console.log('Error listing users:', error)
    })

  admin
    .auth()
    .deleteUsers(uidList)
    .then((deleteUsersResult) => {
      console.log(`Successfully deleted ${deleteUsersResult.successCount} users`)
      console.log(`Failed to delete ${deleteUsersResult.failureCount} users`)
      deleteUsersResult.errors.forEach((err) => {
        console.log(err.error.toJSON())
      })
    })
    .catch((error) => {
      console.log('Error deleting users:', error)
    })
}

const resetMongodb = async () => {
  const {DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env

  const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.3ukly.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log('Database connected ...'))
    .catch((error) => console.log('Could not connect to database ...', error.message))

  mongoose.connection.on('open', () => {
    mongoose.connection.db
      .dropDatabase()
      .then(() => console.log('Database was dropped ...'))
      .catch((error) => console.log('Could not drop database ...', error.message))
  })
}

resetFirebase()
resetMongodb()
