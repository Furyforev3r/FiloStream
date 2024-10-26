import { json } from "@sveltejs/kit"
import { getUserVideos } from "$lib/server/utils/firebaseAdminUtils"

export async function GET({ url }) {
  try {
    const userUID = url.searchParams.get('uid')

    if (!userUID) {
      return json({ error: 'Missing user UID' }, { status: 400 })
    }

    const videoInfo = await getUserVideos(userUID)

    if (videoInfo.success) {
      return json({ videos: videoInfo.videos }, { status: 200 })
    } else {
      return json({ error: 'No videos found for this user' }, { status: 404 })
    }
  } catch (error) {
    console.error("Get videos error:", error)
    return json({ error: 'An error occurred while fetching videos' }, { status: 500 })
  }
}
