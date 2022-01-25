/** ***************************************************************************
 *  cmds/astronauts.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/01/23 10:40 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/23 10:57 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed } from 'discord.js'
import axios, { AxiosResponse } from 'axios'
import { errors } from '../core'

export type Astronaut = {
  craft: string
  name: string
}

export type AstronautsResponse = {
  people: Astronaut[]
}

const run = async (message: Message): Promise<void> => {
  try {
    await axios.get('http://api.open-notify.org/astros.json')
      .then((response: AxiosResponse<AstronautsResponse>) => {
        const { data } = response
        const embed = new MessageEmbed()
          .setColor('AQUA')
          .setTitle(`Astronautes actuellement dans l'espace (${data.people.length}):`)
          .setDescription('Voici la liste de tous les humains se trouvant actuellement dans l\'espace.')
          .setFooter(`Demandé par ${message.author.username}`)

        const ships: Record<string, string[]> = {}
        data.people.forEach(p => {
          if (!ships[p.craft]) ships[p.craft] = []
          ships[p.craft].push(p.name)
        })
        Object.keys(ships).forEach(ship => {
          embed.addField(`🛰 **${ship}**`, `**${ships[ship].join(', ')}**`)
        })
        message.channel.send({ embed })
          .catch(err => errors.raiseReply(err, message))
      }).catch(() => {
        errors.raiseReply('Le service est actuellement indisponible', message)
      })
  } catch (error) {
    errors.raiseReply(error, message)
  }
}

const command: CommandEntity<void> = {
  title: 'astronauts',
  desc: 'Vous permets de récupérer la liste des astronautes actuellement dans l\'espace.',
  args: [],
  mandatoryArgs: false,
  usage: 'astronauts',
  examples: ['astronauts'],
  run,
}

export default command
