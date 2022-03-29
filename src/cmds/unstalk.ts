/** ***************************************************************************
 *  cmds/unstalk.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/03/29 3:14 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/03/29 3:22 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { CommandAccess } from '../helpers'
import pool from '../db/pool'
import { env } from '@materya/carbon'

type Args = readonly string[]

const run = async (message: Message, args: Args): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  
  const [userTag, ...reasonArray] = args
  const reason = reasonArray.join(' ')
  console.log(userTag, reason)
  
  const user = userTag.replace('<@!', '').replace('>', '')
  
  // @ts-ignore
  const stalkChannel = message.guild.channels.cache.get(env.get('STALK_CHANNEL')) as TextChannel
  const stalkData = await pool.query(`SELECT * FROM discord_stalks WHERE identifier = ${user}`)
  
  await pool.query(`DELETE FROM discord_stalks WHERE identifier = "${user}"`)
  const embed = new MessageEmbed()
    .setColor('#2fff03')
    .setTitle(`Fin de surveillance de ${message.author.username}`)
    .addField(`Tag de l'utilisateur:`, `<@${message.author.id}>`, true)
    // @ts-ignore
    .addField('Surveillance demandée par', `<@${stalkData[0][0].asked_by_id}>`, true)
    .addField('Fin de surveillance demandée par', `<@${message.author.id}>`, true)
    // @ts-ignore
    .addField('Début de la surveillance', new Date(stalkData[0][0].created_at).toLocaleString(), true)
    .addField('Fin de la surveillance', new Date().toLocaleString(), true)
    // @ts-ignore
    .addField('Raison de la surveillance', stalkData[0][0].reason)
    .addField('Raison de fin', reason)
    .setTimestamp()
    // @ts-ignore
    .setFooter(`Surveillance terminé le ${new Date(stalkData[0][0].until).toLocaleDateString()}`)
  
  await stalkChannel.send({ embed })
}

const command: CommandEntity<string> = {
  title: 'unstalk',
  desc: 'Enlever un membre de la liste de surveillance.',
  args: [],
  mandatoryArgs: true,
  usage: 'unstalk [utilisateur] [raison]',
  examples: ['unstalk Сорок два#0042 Comportement amélioré'],
  run,
}

export default command


