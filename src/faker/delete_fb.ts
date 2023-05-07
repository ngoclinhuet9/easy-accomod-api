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
        console.log(userRecord.email)
        if(userRecord.email === 'user6@gmail.com'){
          uidList.push(userRecord.uid)
        console.log(userRecord.uid)
        }
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
resetFirebase()