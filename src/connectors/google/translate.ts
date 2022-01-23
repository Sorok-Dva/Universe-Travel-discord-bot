/** ***************************************************************************
 *  crons/yandex.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/07 8:22 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/24 1:01 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { v2 } from '@google-cloud/translate'
import { env } from '@materya/carbon'

export type TranslateResponse = {
  data: {
    translations: Array<{
      text: string
    }>
  }
}

const { Translate } = v2

const translationObject = new Translate({
  credentials: JSON.parse(env.get('GOOGLE_CREDENTIALS')),
  projectId: JSON.parse(env.get('GOOGLE_CREDENTIALS')).project_id,
})

const translate = async (opts: {
  text: string | string[]
  target: 'fr' | 'en' | 'ru' | 'de'
}): Promise<[string, unknown]> => {
  const { text, target } = opts
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // Bug with the google translate lib that split translate method in many parts.
  // TS is not able to retrieve the correct typing depending if it's an array or a string of array
  const tr = await translationObject.translate(text, target)
  return tr
}

export default translate
