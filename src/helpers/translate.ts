/** ***************************************************************************
 *  helpers/translate.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/06 5:32 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/07 1:22 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { httpClientHelper } from './index'
import features from '../config.local/features.json'

export type YandexResponse = {
  translations: Array<{
    text: string
  }>
}

export const translate = async (
  text: string | string[],
  target: 'fr',
): Promise<YandexResponse> => {
  const apiUrl = env.get('TRANSLATE_API')

  try {
    const tr = await httpClientHelper
      .post<YandexResponse>(
        apiUrl,
        {
          folderId: env.get('YANDEX_FOLDER_ID'),
          texts: text,
          targetLanguageCode: target,
          sourceLanguageCode: 'en',
          glossaryConfig: {
            glossaryData: {
              glossaryPairs: [
                {
                  sourceText: 'Surveyor Hops',
                  translatedText: 'Surveyor Hops',
                },
              ],
            },
          },
        }, {
          Authorization: `Bearer ${features.yandex.iamKey}`,
        },
      )

    return tr
  } catch (error) {
    throw new Error(error)
  }
}
