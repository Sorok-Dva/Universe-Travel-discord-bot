/*******************************************************************************
 *  core/bot.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/20 12:37 AM
 *  |__   _|/ __/                          Updated: 2021/06/20 12:39 AM
 *     |_| |_____|U*Travel
 ******************************************************************************/
import BotClient from './client';
import { env } from '@materya/carbon';

/* Ignition of the discord bot with variables set in .env */
const bot = new BotClient({
  token: env.get('TOKEN'),
  prefix: env.get('PREFIX'),
  botOwner: env.get('BOT_OWNER'),
  serverOwner: env.get('SERVER_OWNER'),
  env: 'dev',
})

export default bot
