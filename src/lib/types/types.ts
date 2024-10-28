import type { FieldValue } from "firebase-admin/firestore"

export interface RegisterUser {
    uid: string,
    photoURL: string,
    displayName: string,
    username: string,
    email: string,
    emailVerified: Boolean
}

export interface FiloUser {
    uid: string,
    photoURL: string,
    displayName: string,
    username: string,
    email: string,
    emailVerified: Boolean,
    createdAt: FieldValue
}

export interface FiloUserRedirect {
    user: FiloUser
}

export interface RegisterVideo {
    userUID: string,
    driveURL: string,
    contentCover: string,
    contentTitle: string
}

export interface Video {
    userUID: string,
    fileId: string,
    driveURL: string,
    contentCover: string,
    contentTitle: string
}
