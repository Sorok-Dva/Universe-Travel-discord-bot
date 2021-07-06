/** ***************************************************************************
 *  cmds/ping.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/06 4:13 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/06 4:25 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed } from 'discord.js'
import { NASA } from '../modules'
import { errors } from '../core'

const run = async (message: Message): Promise<void> => {
  const data = await NASA.apod()
  const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle(data.title)
    .setDescription(`<@&853036396205834261>, ${data.explanation}`)
    .setImage(data.hdurl)
    .addField('Copyright', data.copyright, true)
    .addField('Date:', data.date, true)
    .setFooter('Récupérée via l\'api de la NASA')
    .setTimestamp()

  message.channel.send({ embed })
    .catch(err => errors.raiseReply(err, message))
}

const command: CommandEntity<string> = {
  title: 'nasa',
  desc: 'Vous donne des informations relatives à la NASA',
  args: [],
  mandatoryArgs: false,
  usage: 'nasa',
  examples: [],
  run,
}

export default command
