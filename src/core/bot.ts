/** ***************************************************************************
 *  core/bot.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 12:37 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:27 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import BotClient from './client'

/* Ignition of the discord bot with variables set in .env */
const bot = new BotClient({
  token: env.get('TOKEN'),
  prefix: env.get('PREFIX'),
  botOwner: env.get('BOT_OWNER'),
  serverOwner: env.get('SERVER_OWNER'),
  env: 'dev',
})

export default bot
