import { env } from '@materya/carbon'
import { httpClientHelper } from '../helpers'
import debug from '../cmds/debug'

export type ApodGetResponse = {
  'from': string
  'original_text': string
  'status': number
  'to': string
  'translated_characters': number
  'translated_text':{
    'fr': string
  }
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
