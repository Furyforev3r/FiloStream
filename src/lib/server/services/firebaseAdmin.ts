import admin from 'firebase-admin'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { FIREBASE_ADMIN_KEY } from '$env/static/private'
import { GOOGLE_DRIVE_API_KEY } from '$env/static/private'

let adminApp: any

if (!adminApp) {
  if (admin.apps.length == 0) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(FIREBASE_ADMIN_KEY))
    }, 'admin-app')
  }
  else {
      adminApp = admin.apps[0]
  }
}

export const fieldValue = FieldValue
export const db = getFirestore(adminApp)
export const auth = adminApp?.auth()
export const driveApiKey = GOOGLE_DRIVE_API_KEY
