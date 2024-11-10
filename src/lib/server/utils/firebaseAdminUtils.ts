import { db, fieldValue } from "$lib/server/services/firebaseAdmin"
import type { RegisterUser, RegisterVideo, RegisterSeries, SeriesFile } from "$lib/types/types"
import type { DocumentData } from "firebase-admin/firestore"
import { GOOGLE_DRIVE_API_KEY } from '$env/static/private'
import axios from "axios"

export async function getUserByUID(uid: string) {
  try {
    const userDoc = await db.collection('Users').doc(uid).get()

    if (userDoc.exists) {
      return { success: true, user: userDoc.data() }
    } else {
      return { success: false, message: 'User not found' }
    }
  } catch (error) {
    console.error('Error fetching user by UID:', error)
    return { success: false, error: 'Failed to fetch user' }
  }
}

export async function registerUser(user: RegisterUser) {
  try {
    const getUser = await getUserByUID(user.uid)

    if (getUser.success === false && getUser.message === 'User not found') {
      await db.collection('Users').doc(user.uid).set({ ...user, 'createdAt': fieldValue.serverTimestamp() })

      return { success: true, user }
    }

    return { success: false, error: 'The user already exists.' }
  } catch (error) {
    console.error('Error registering user:', error)
    return { success: false, error: 'Failed to register user' }
  }
}

export async function newVideo(input: RegisterVideo) {
  const { userUID, driveURL, contentCover, contentTitle } = input
  
  const fileIdMatch = driveURL.match(/\/d\/([^/]+)/)
  if (!fileIdMatch) {
    return { success: false, error: 'Invalid Google Drive URL format' }
  }

  const fileId = fileIdMatch[1]

  try {
    const videoData = {
      fileId,
      driveURL,
      contentCover,
      contentTitle
    }

    const userVideosDoc: DocumentData = await db.collection('DefaultVideos').doc(userUID).get()
    const userVideos = userVideosDoc.exists ? userVideosDoc.data().videos || [] : []

    userVideos.push(videoData)

    await db.collection('DefaultVideos').doc(userUID).set({ videos: userVideos })

    return { success: true, video: videoData }
  } catch (error) {
    console.error('Error registering new video:', error)
    return { success: false, error: 'Failed to register video' }
  }
}

export async function getUserVideos(uid: string) {
  try {
    const userVideosDoc: DocumentData = await db.collection('DefaultVideos').doc(uid).get()

    if (userVideosDoc.exists) {
      const videos = userVideosDoc.data().videos || []
      return { success: true, videos }
    } else {
      return { success: false, message: 'No videos found for this user.' }
    }
  } catch (error) {
    console.error('Error fetching videos for user:', error)
    return { success: false, error: 'Failed to fetch videos' }
  }
}

export async function getFolder(folderURL: string) {
  const fileIdMatch = folderURL.match(/\/folders\/([^/]+)/)
  if (!fileIdMatch) {
    return { success: false, error: 'Invalid Google Drive URL format' }
  }

  const folderID = fileIdMatch[1]

  try {
    const url = `https://www.googleapis.com/drive/v3/files`
    const params = {
      q: `'${folderID}' in parents and trashed = false`,
      key: GOOGLE_DRIVE_API_KEY,
      fields: "files(id, name)"
    }
    
    const response = await axios.get(url, { params })

    if (response.status === 200) {
      const files: SeriesFile[] = response.data.files
      
      return { sucess: true, files: files }
    } else {
      return { success: false, error: 'Failed to get folder' }
    }
  } catch (error) {
    console.error('Failed to get folder', error)
    return { success: false, error: 'Failed to get folder' }
  }
}

export async function newSeries(input: RegisterSeries) {
  try {
    const { userUID, driveURL, contentCover, contentTitle, content, contentUID } = input

    const seriesData = {
      driveURL,
      contentCover,
      contentTitle,
      content,
      contentUID,
      editorUID: userUID
    }

    const seriesDocRef = db.collection("Series").doc(contentUID)
    const seriesDoc = await seriesDocRef.get() 

    if (seriesDoc.exists) {
      return { success: false, error: 'The Series UID already exists' }
    }

    await seriesDocRef.set(seriesData)

    const userSeriesDocRef = await db.collection('UserSeries').doc(userUID).get()
    const userSeries = userSeriesDocRef.exists ? userSeriesDocRef.data()?.series || [] : []

    userSeries.push(contentUID)

    await db.collection('UserSeries').doc(userUID).set({ series: userSeries })

    return { success: true, seriesData }
  } catch (error) {
    console.error('Failed to register series', error)
    return { success: false, error: 'Failed to register series' }
  }
}

export async function getSeries(uid: string) {
  try {
    const seriesDoc: DocumentData = await db.collection('Series').doc(uid).get()
    if (seriesDoc.exists) {
      const series = seriesDoc.data() || []
      return { success: true, series }
    } else {
      return { success: false, message: 'No Series found' }
    }
  } catch (error) {
    console.error('Error fetching Series for user:', error)
    return { success: false, error: 'Failed to fetch Series' }
  }
}

export async function getUserSeries(uid: string) {
  try {
    const userSeriesDoc: DocumentData = await db.collection('UserSeries').doc(uid).get()

    if (!userSeriesDoc.exists) {
      return { success: false, message: 'No series found for this user.' }
    }

    const seriesUIDs = userSeriesDoc.data()?.series || []

    if (seriesUIDs.length === 0) {
      return { success: false, message: 'No series associated with this user.' }
    }

    const seriesPromises = seriesUIDs.map(async (seriesUID: string) => {
      const seriesDoc: DocumentData = await db.collection('Series').doc(seriesUID).get()

      if (seriesDoc.exists) {
        return seriesDoc.data()
      } else {
        return null
      }
    })

    const seriesData = await Promise.all(seriesPromises)
    const validSeriesData = seriesData.filter(series => series !== null)

    return { success: true, series: validSeriesData }
  } catch (error) {
    console.error('Error fetching series for user:', error)
    return { success: false, error: 'Failed to fetch series' }
  }
}

