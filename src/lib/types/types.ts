import type { FieldValue } from "firebase-admin/firestore"

export interface UserBase {
    uid: string,
    photoURL: string,
    displayName: string,
    username: string,
    email: string,
    emailVerified: boolean
}

export interface RegisterUser extends UserBase {}

export interface FiloUser extends UserBase {
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

export interface Video extends RegisterVideo {
    fileId: string
}

export interface SeriesFile {
    fileId: string,
    name: string
}

export interface Series {
    contentUID: string,
    contentTitle: string,
    contentCover: string,
    driveURL: string,
    content: SeriesFile[],
    editorUID: string
}

export interface RegisterSeries extends Series {
    userUID: string
}
