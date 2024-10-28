import { json } from "@sveltejs/kit"
import { newVideo } from "$lib/server/utils/firebaseAdminUtils"
import type { RegisterVideo } from "$lib/types/types"

function validateVideoInput(input: RegisterVideo) {
  const { userUID, driveURL, contentCover, contentTitle } = input
  if (!userUID || !driveURL || !contentCover || !contentTitle) {
    throw new Error("Missing required fields for video")
  }
}

export async function POST({ request }) {
  try {
    const videoInput = await request.json()
    validateVideoInput(videoInput)

    const videoResponse = await newVideo(videoInput)

    if (videoResponse.success) {
      return json({ message: 'Video added successfully', video: videoResponse.video }, { status: 201 })
    } else {
      return json({ error: videoResponse.error }, { status: 409 })
    }
  } catch (error) {
    console.error("Error adding new video:", error)
    return json({ error: 'An error occurred while adding video' }, { status: 500 })
  }
}
