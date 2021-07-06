/** ***************************************************************************
 *  cmds/ping.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/06 4:13 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/06 4:25 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message } from 'discord.js'
import { NASA } from '../modules'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[]
type AllowedModules = 'apod' | 'image'
type AllowedSubmodules = Record<AllowedModules, string[]>

const allowedModules: AllowedModules[] = ['apod', 'image']
const allowedSubmodule: AllowedSubmodules = {
  apod: ['date'],
  image: ['date'],
}
const run = async (message: Message, args: Args): Promise<void> => {
  const [module, submodule] = args

  if (!allowedModules.includes(<AllowedModules>module)) return
  if (submodule
    && !allowedSubmodule[<AllowedModules>module].includes(submodule)) return

  switch (module) {
    case 'apod': {
      const accessAllowed = CommandAccess.checkPermission(message.author, 'admin', message)
      if (!accessAllowed) return

      const embed = await NASA.apod()
      console.log(embed)
      await message.channel.send({ embed })
        .catch(err => errors.raiseReply(err, message))
    } break
    default:
  }
}

const command: CommandEntity<string> = {
  title: 'nasa',
  desc: 'Vous donne des informations relatives à la NASA',
  args: [],
  mandatoryArgs: true,
  usage: 'nasa',
  examples: ['nasa apod (réservé aux admins)'],
  run,
}

export default command
