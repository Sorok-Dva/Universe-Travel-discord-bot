/*******************************************************************************
 *  index.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/20 12:02 PM
 *  |__   _|/ __/                          Updated: 2021/06/20 10:14 PM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { Bot } from './core'

(async () => {
  try {
    await Bot.start()
  } catch (e) {
    console.log('Error while starting U*Travel Helper', e)
  }
})()
