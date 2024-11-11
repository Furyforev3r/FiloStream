import { json } from "@sveltejs/kit"
import { getSeries } from "$lib/server/utils/firebaseAdminUtils"

export async function GET({ url }) {
  try {
    const seriesUID = url.searchParams.get('uid')

    if (!seriesUID) {
      return json({ error: 'Missing Series UID' }, { status: 400 })
    }

    const seriesInfo: any = await getSeries(seriesUID)

    if (seriesInfo.success) {
      return json({ series: seriesInfo }, { status: 200 })
    } else {
      return json({ error: 'No Series found' }, { status: 404 })
    }
  } catch (error) {
    console.error("Get Series error:", error)
    return json({ error: 'An error occurred while fetching Series' }, { status: 500 })
  }
}
