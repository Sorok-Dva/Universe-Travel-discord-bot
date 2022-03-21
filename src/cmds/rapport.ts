/** ***************************************************************************
 *  cmds/rapport.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/03/21 10:21 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/03/21 10:57 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed } from 'discord.js'
import axios, { AxiosResponse } from 'axios'
import { errors } from '../core'


const run = async (message: Message): Promise<void> => {
  try {
    const embed = new MessageEmbed()
    .setColor('AQUA')
    .setTitle(`Lien pour faire votre rapport de session Stationeers`)
    .setDescription('https://universe-travel.eu/stationeers/create-report/')
    .addField('⚠ Nécessite d\'être inscrit sur le site Universe * Travel', ' (https://universe-travel.eu/register)')
  
    message.channel.send({ embed })
      .catch(err => errors.raiseReply(err, message))
  } catch (error) {
    errors.raiseReply(error, message)
  }
}

const command: CommandEntity<void> = {
  title: 'rapport',
  desc: 'Vous permets de récupérer le lien pour effectuer votre rapport de session stationeers .',
  args: [],
  mandatoryArgs: false,
  usage: 'rapport',
  examples: ['rapport'],
  run,
}

export default command
