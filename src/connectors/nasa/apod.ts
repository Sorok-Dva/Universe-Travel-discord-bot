import { env } from '@materya/carbon'
import { httpClientHelper } from '../../helpers'

export type OneRecordAnswer = {
  title: string
  copyright: string
  date: Date
  explanation: string
  hdurl: string
  media_type: string
  service_version: string
  url: string
}

export type NasaApodGetResponse = OneRecordAnswer | Array<OneRecordAnswer>

const get = async (opts?: {
  date?: Date
  count?: number
}): Promise<NasaApodGetResponse> => {
  let dateObj = new Date()

  if (opts?.date) dateObj = new Date(opts.date)
  const format = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`
  const endpoint = `${env.get('NASA_APOD_API_URL')}${env.get('NASA_API_KEY')}`
  const dateQuery = `${opts?.date ? `&date=${format}}` : ''}`
  const countQuery = `${opts?.count && !opts.date ? `&count=${opts.count}` : ''} `
  const finalEndpoint = `${endpoint}${dateQuery ?? ''}${countQuery ?? ''}`
  try {
    return await httpClientHelper.get<NasaApodGetResponse>(
      finalEndpoint,
    )
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  get,
}
