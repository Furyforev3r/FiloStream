import { db, fieldValue, driveApiKey } from "$lib/server/services/firebaseAdmin"
import axios from "axios"

export async function getUserByUID(uid) {
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

export async function registerUser(user) {
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

export async function newVideo(input) {
  const { userUID, driveURL, contentCover, contentTitle } = input
  
  const fileIdMatch = driveURL.match(/\/file\/d\/([^/]+)\//)
  if (!fileIdMatch) {
    return { success: false, error: 'Invalid Google Drive URL format' }
  }

  const fileId = fileIdMatch[1]
  const videoURL = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${driveApiKey}`

  try {
    const videoResponse = await axios.get(videoURL, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (videoResponse.status !== 200) {
      return { success: false, error: 'Failed to fetch video from Google Drive' }
    }

    const videoData = {
      videoURL,
      driveURL,
      contentCover,
      contentTitle
    }

    const userVideosDoc = await db.collection('DefaultVideos').doc(userUID).get()
    const userVideos = userVideosDoc.exists ? userVideosDoc.data().videos || [] : []

    userVideos.push(videoData)

    await db.collection('DefaultVideos').doc(userUID).set({ videos: userVideos })

    return { success: true, video: videoData }
  } catch (error) {
    console.error('Error registering new video:', error)
    return { success: false, error: 'Failed to register video' }
  }
}

export async function getUserVideos(uid) {
  try {
    const userVideosDoc = await db.collection('DefaultVideos').doc(uid).get()

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
