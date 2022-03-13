/** ***************************************************************************
 *  index.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 12:02 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:32 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import 'dotenv/config'
import { Bot } from './core'

(async (): Promise<void> => {
  try {
    await Bot.start()
  } catch (e) {
    console.log('Error while starting U*Travel Helper', e)
  }
})()
