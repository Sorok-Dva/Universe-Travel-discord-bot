/** ***************************************************************************
 *  crons/yandex.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/07 8:22 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/08 1:30 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { exec } from 'child_process'
import fs from 'fs'
import * as path from 'path'
import { errors } from '../core'
import features from '../config.local/features.json'

// eslint-disable-next-line import/prefer-default-export
export const reloadToken = (): void => {
  if (features.yandex.iamKey.length === 0) {
    console.log('Getting yandex IAM token for first time (12h lifetime max)')
  } else {
    console.log('reloading yandex IAM token (12h lifetime max)')
  }
  const command = `yc config set token ${env.get('TRANSLATE_OAUTH')} &&
    yc iam create-token`

  exec(command, { shell: 'bash' }, (err, stdout, stderr): void => {
    if (err || stderr) {
      errors.log(`stderr: ${stderr} | err: ${err}`)
      throw new Error('Unable to retrieve Yandex IAM Key. Please check you filled your env file and you followed related docs')
    }

    features.yandex.iamKey = stdout.replace('\n', '')
    fs.writeFileSync(path.resolve(__dirname, '../config.local/features.json'), JSON.stringify(features))
    console.log('Yandex IAM key retrieved and save with success. Will renew it in 8 hours')
  })
}
