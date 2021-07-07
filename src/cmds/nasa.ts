/** ***************************************************************************
 *  cmds/ping.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/06 4:13 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/06 2:48 PAM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed } from 'discord.js'
import { NASA } from '../modules'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[]
type AllowedModules = 'apod' | 'image'
type AllowedSubmodules = Record<AllowedModules, string[]>

const allowedModules: AllowedModules[] = ['apod', 'image']
const allowedSubmodule: AllowedSubmodules = {
  apod: ['date', 'count'],
  image: ['date'],
}
const run = async (message: Message, args: Args): Promise<void> => {
  try {
    const [module, subcmd, arg] = args

    if (!allowedModules.includes(<AllowedModules>module)) return
    if (subcmd
      && !allowedSubmodule[<AllowedModules>module].includes(subcmd)) return

    const { author } = message
    console.log([module, subcmd, arg])
    switch (module) {
      case 'apod':
        switch (subcmd) {
          case 'date': {
            const embed = <MessageEmbed> await NASA.apod({
              date: new Date(arg),
              author,
            })
            await message.channel.send({ embed })
              .catch(err => errors.raiseReply(err, message))
          } break
          case 'count': {
            const embeds = <Array<MessageEmbed>> await NASA.apod({
              count: Number.isNaN(arg) ? 1 : Number(arg),
              author: message.author,
            })
            embeds.forEach(embed => {
              message.channel.send({ embed })
                .catch(err => errors.raiseReply(err, message))
            })
          } break
          default: {
            const accessAllowed = CommandAccess.checkPermission(message.author, 'admin', message)
            if (!accessAllowed) return
            const embed = <MessageEmbed> await NASA.apod({ author })
            await message.channel.send({ embed })
              .catch(err => errors.raiseReply(err, message))
          }
        } break
      default:
    }
  } catch (e) {
    console.log(e)

    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'nasa',
  desc: 'Vous donne des informations relatives à la NASA',
  args: [],
  mandatoryArgs: true,
  usage: 'nasa',
  examples: [
    'nasa apod _(réservé aux admins)_',
    'nasa apod date 2017-07-10  _(réservé à tous dans les salon bot)_',
    'nasa apod count 3 _(réservé à tous dans les salon bot)_',
  ],
  run,
}

export default command
