/* eslint-disable @typescript-eslint/no-var-requires */
import admin from 'firebase-admin'

let serviceAccount = require('../config/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
})

export default admin
