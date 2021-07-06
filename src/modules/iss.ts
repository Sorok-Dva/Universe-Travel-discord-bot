import { env } from '@materya/carbon'
import { nasa } from '../connectors'

const position = async (): Promise<void> => {
  const data = nasa.apod.get()
  console.log(data)
}

export default {
  position,
}
