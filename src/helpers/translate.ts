/** ***************************************************************************
 *  helpers/translate.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/06 5:32 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/06 9:22 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { httpClientHelper } from './index'

type YandexTranslateResponse = {
  translations: {
    text: string
    detectedLanguageCode: string
  }[]
}

export const translate = async (
  text: string | string[],
  target: 'fr',
): Promise<YandexTranslateResponse> => {
  const apiUrl = env.get('TRANSLATE_API')

  try {
    const tr = await httpClientHelper.post<YandexTranslateResponse>(
      apiUrl,
      {
        folderId: env.get('YANDEX_FOLDER_ID'),
        texts: text,
        targetLanguageCode: target,
      }, {
        Authorization: `Bearer ${env.get('YANDEX_IAM_KEY')}`,
      },
    )

    return tr
  } catch (error) {
    throw new Error(error)
  }
}
