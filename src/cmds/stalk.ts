/** ***************************************************************************
 *  cmds/say.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/03/28 9:41 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/03/29 2:12 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { env } from '@materya/carbon'
import { Message, MessageEmbed } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'
import pool from '../db/pool'

type Args = readonly string[]

const run = async (message: Message, args: Args): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  
  const [userTag, until, ...reasonArray] = args
  const reason = reasonArray.join(' ')
  
  const user = userTag.replace('<@!', '').replace('>', '')
  const untilDate = until.split('/').reverse().join('-') 
  const result = await pool.query(`
    INSERT INTO discord_stalks (
    identifier, asked_by_id, reason, until, created_at
    ) VALUES ('${user}', '${message.author.id}', '${reason}', '${untilDate}', '${new Date().toISOString().split('Z')[0].replace('T', ' ')}')`)

   // @ts-ignore
  const stalkChannel = message.guild.channels.cache.get(env.get('STALK_CHANNEL')) as TextChannel
  const embed = new MessageEmbed()
    .setColor('#ff0021')
    .setTitle(`Début de surveillance de ${message.author.username}`)
    .addField(`Tag de l'utilisateur:`, `<@${user}>`, true)
    // @ts-ignore
    .addField('Demandé par', `<@${message.author.id}>`, true)
    // @ts-ignore
    .addField('Raison du stalk', reason)
    .setTimestamp()
    // @ts-ignore
    .setFooter(`Surveillance engagée jusqu'au ${until} à 23:59`)

    stalkChannel.send({ embed }) 
}

const command: CommandEntity<string> = {
  title: 'stalk',
  desc: 'Mettre un membre sous surveillance.',
  args: [],
  mandatoryArgs: true,
  usage: 'stalk [utilisateur] [date de fin] [raison]',
  examples: ['stalk Сорок два#0042 25/02/2023 Tiens des propos borderlines...'],
  run,
}

export default command


