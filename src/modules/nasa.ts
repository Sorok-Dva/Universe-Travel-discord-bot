import { env } from '@materya/carbon'
import { nasa } from '../connectors'
import { ApodGetResponse } from '../connectors/nasa/apod'

const apod = async (): Promise<ApodGetResponse> => {
  const data = await nasa.apod.get()
  console.log(data)
  
  return data
}

export {
  apod,
}
