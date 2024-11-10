import { json } from "@sveltejs/kit"
import { getUserSeries } from "$lib/server/utils/firebaseAdminUtils"

export async function GET({ url }) {
  try {
    const userUID = url.searchParams.get('uid')

    if (!userUID) {
      return json({ error: 'Missing User UID' }, { status: 400 })
    }

    const userSeriesInfo = await getUserSeries(userUID)
    const series = userSeriesInfo.series

    if (userSeriesInfo.success) {
      return json({ series: series }, { status: 200 })
    } else {
      return json({ error: 'No series found for this user' }, { status: 404 })
    }
  } catch (error) {
    console.error("Get User Series error:", error)
    return json({ error: 'An error occurred while fetching user series' }, { status: 500 })
  }
}
