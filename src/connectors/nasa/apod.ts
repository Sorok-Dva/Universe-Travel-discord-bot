import { env } from '@materya/carbon'
import { httpClientHelper } from '../../helpers'

export type ApodGetResponse = {
  title: string
  copyright: string
  date: Date
  explanation: string
  hdurl: string
  media_type: string
  service_version: string
  url: string
}

const get = async (): Promise<ApodGetResponse> => {
  const endpoint = `${env.get('NASA_APOD_API_URL')}${env.get('NASA_API_KEY')}`
  try {
    return await httpClientHelper.get<ApodGetResponse>(
      `${endpoint}`,
    )
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export default {
  get,
}
