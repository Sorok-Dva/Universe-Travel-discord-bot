/** ***************************************************************************
 *  cmds/mars.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/01/23 11:08 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/23 10:30 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed } from 'discord.js'
import { NASA } from '../modules'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[]
type AllowedModules = 'mars'
type AllowedSubmodules = Record<AllowedModules, string[]>

const allowedModules: AllowedModules[] = ['mars']
const allowedSubmodule: AllowedSubmodules = {
  mars: ['camera', 'date', 'sol', 'page', 'help'],
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
      case 'mars': // retrieve a picture of mars rovers
        switch (subcmd) {
          case 'date': { // based on the desired date
            const embed = <MessageEmbed> await NASA.apod({
              date: new Date(arg),
              author,
            })
            await message.channel.send({ embed })
              .catch(err => errors.raiseReply(err, message))
          } break
          case 'count': { // post n(count) pictures
            const embeds = <Array<MessageEmbed>> await NASA.apod({
              count: Number.isNaN(arg) ? 1 : Number(arg),
              author: message.author,
            })
            embeds.forEach(embed => {
              message.channel.send({ embed })
                .catch(err => errors.raiseReply(err, message))
            })
          } break
          default: { // only return the image of the day
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
  desc: 'Vous donne diverses informations et photos depuis l\'api de la NASA',
  args: [],
  mandatoryArgs: true,
  usage: 'nasa [module] [commandes]',
  examples: [
    'nasa mars NAVCAM 2021-01-01 _(réservé à tous dans les salon bot)_',
  ],
  run,
}

export default command
