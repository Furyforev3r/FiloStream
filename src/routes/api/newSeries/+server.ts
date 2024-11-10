import { json } from "@sveltejs/kit"
import { getFolder, newSeries } from "$lib/server/utils/firebaseAdminUtils"
import type { RegisterSeries, SeriesFile } from "$lib/types/types"

function validateSeriesInput(input: RegisterSeries) {
  const { userUID, driveURL, contentCover, contentTitle, contentUID } = input
  
  if (!userUID || !driveURL || !contentCover || !contentTitle || !contentUID) {
    throw new Error("Missing required fields for series")
  }

  return { userUID, driveURL, contentCover, contentTitle, contentUID }
}

export async function POST({ request }) {
    try {
      const seriesInputJSON = await request.json()
      const seriesInput = validateSeriesInput(seriesInputJSON)
  
      const contentRequest = await getFolder(seriesInput.driveURL)
      const content: any = contentRequest.files
  
      const newSeriesValue: RegisterSeries = {
          userUID: seriesInput.userUID,
          contentUID: seriesInput.contentUID,
          contentTitle: seriesInput.contentTitle,
          contentCover: seriesInput.contentCover,
          driveURL: seriesInput.driveURL,
          content: content,
          editorUID: seriesInput.userUID
      }
  
      const seriesResponse = await newSeries(newSeriesValue)
  
      if (seriesResponse.success) {
        return json({ message: 'Series added successfully', series:  seriesResponse.seriesData}, { status: 201 })
      } else {
        return json({ error: seriesResponse.error }, { status: 409 })
      }
    } catch (error) {
      console.error("Error adding new series:", error)
      return json({ error: 'An error occurred while adding series' }, { status: 500 })
    }
  }
  
