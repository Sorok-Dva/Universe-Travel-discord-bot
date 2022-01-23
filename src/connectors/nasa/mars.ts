/** ***************************************************************************
 *  connectors/nasa/mars.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/01/23 10:58 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/23 11:11 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { httpClientHelper } from '../../helpers'

export type CameraTypes = 'FHAZ' // Front Hazard Avoidance Camera (Curiosity: ✔	Opportunity: ✔	Spirit: v)
  | 'RHAZ' // Rear Hazard Avoidance Camera (Curiosity: ✔	Opportunity: ✔	Spirit: v)
  | 'MAST' // Mast Camera (Curiosity: ✔	Opportunity: X	Spirit: X)
  | 'CHEMCAM' // Chemistry and Camera Complex (Curiosity: ✔	Opportunity: X	Spirit: X)
  | 'MAHLI' // Mars Hand Lens Imager (Curiosity: ✔	Opportunity: X	Spirit: X)
  | 'MARDI' // Mars Descent Imager (Curiosity: ✔	Opportunity: X	Spirit: X)
  | 'NAVCAM' // Navigation Camera (Curiosity: ✔	Opportunity: ✔	Spirit: v)
  | 'PANCAM' // Panoramic Camera (Curiosity: X	Opportunity: ✔	Spirit: v)
  | 'MINITES' // Miniature Thermal Emission Spectrometer (Mini-TES) (Curiosity: X	Opportunity: ✔	Spirit: v)
// (see more at : https://api.nasa.gov/)

export type NasaMarsRoverPhotosGetResponse = {
  id: number
  sol: number
  camera: {
    id: number
    name: CameraTypes
    rover_id: number
    full_name: string
  }
  img_src: string
  earth_date: string
  rover: {
    id: number
    name: string
    landing_date: string
    launch_date: string
    status: string
  }
}

const get = async (opts: {
  camera: CameraTypes
  earth_date?: Date
  sol?: number
  page?: number
}): Promise<NasaMarsRoverPhotosGetResponse> => {
  let dateObj = new Date()
  if (opts?.earth_date) dateObj = new Date(opts.earth_date ?? 'now')
  const endpoint = `${env.get('NASA_MARS_API_URL')}${env.get('NASA_API_KEY')}`
  const solQuery = `${opts?.sol ? `&sol=${opts?.sol ?? 3350}}` : ''}`
  const dateQuery = `${opts?.earth_date ? `&earth_date=${dateObj}}` : ''}`
  const camQuery = `&camera=${opts.camera}}`
  const page = `${opts?.page ? `&count=${opts.page}` : '&page=1'} `
  const finalEndpoint = `${endpoint}${dateQuery}${solQuery}${camQuery}${page}`
  try {
    return await httpClientHelper.get<NasaMarsRoverPhotosGetResponse>(
      finalEndpoint,
    )
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  get,
}
