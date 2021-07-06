/** ***************************************************************************
 *  cmds/say.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/05 10:47 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/06 1:24 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { ColorResolvable, Message, MessageEmbed } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[] // [ColorResolvable & string]

const discordColor: ColorResolvable[] = [
  'DEFAULT',
  'WHITE',
  'AQUA',
  'GREEN',
  'BLUE',
  'YELLOW',
  'PURPLE',
  'LUMINOUS_VIVID_PINK',
  'GOLD',
  'ORANGE',
  'RED',
  'GREY',
  'DARKER_GREY',
  'NAVY',
  'DARK_AQUA',
  'DARK_GREEN',
  'DARK_BLUE',
  'DARK_PURPLE',
  'DARK_VIVID_PINK',
  'DARK_GOLD',
  'DARK_ORANGE',
  'DARK_RED',
  'DARK_GREY',
  'LIGHT_GREY',
  'DARK_NAVY',
  'BLURPLE',
  'GREYPLE',
  'DARK_BUT_NOT_BLACK',
  'NOT_QUITE_BLACK',
  'RANDOM',
]

const help = (message: Message): void => {
  const embed = new MessageEmbed()
    .setColor('GREEN')
    .setDescription(`Voici la liste des couleurs disponibles : ${
      discordColor.map(c => `\`${c}\`\n`)
    }\n Vous pouvez aussi utilisez un code hexadecimal (e.g: #12db58).`)
    .setFooter('Aide au couleurs, message supprimé dans 1 min')

  message.channel.send({ embed })
    .then(msg => msg.delete({ timeout: 60000 }))
    .catch(err => errors.raiseReply(err, message))
}

const run = (message: Message, args: Args): void => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  const [color, ...msg] = args

  if (color === 'help') {
    help(message)
    return
  }

  if (!discordColor.includes(color.toUpperCase())
    && !color.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
    help(message)
    return
  }

  const embed = new MessageEmbed()
    .setColor(color.toUpperCase())
    .setDescription(msg.join(' '))
    .setFooter(message.author.username)

  message.channel.send({ embed })
    .catch(err => errors.raiseReply(err, message))
}

const command: CommandEntity<string> = {
  title: 'color',
  desc: 'Envoyez un message dans un encadré coloré',
  args: [],
  mandatoryArgs: true,
  usage: 'color [couleur] [message]',
  examples: [
    'color help _(Pour voir la liste des couleurs disponibles)_',
    'color red Veuillez restez courtois et respectueux',
    'color green On commence un event dans 15 min !',
    'color random À ne pas utiliser 🙈',
  ],
  run,
}

export default command
