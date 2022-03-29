import pool from '../db/pool'
import { Client, Message, MessageEmbed, TextChannel, VoiceChannel } from 'discord.js'
import { env } from '@materya/carbon'

const retrieveStalkedUsers = async (): Promise<string[]> => {
  const date = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-')
  // @ts-ignore
  const result = await pool.query(`SELECT identifier FROM discord_stalks WHERE until >= "${date}"`)
  // @ts-ignore
  const users = result[0].map((u: Record<string, string>) => u.identifier)
  return users
}

const removeFinishedStalks = async (client: Client, message: Message): Promise<void> => {
  const guild = client.guilds.cache.find(g => g.id === env.get('SERVER_ID'))
  const date = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-') 
  if (!guild) return
  // @ts-ignore
  const result = await pool.query(`SELECT * FROM discord_stalks WHERE until < "${date}"`)
  // @ts-ignore
  const finishedStalk = result[0].map((r: Record<string, string>) => ({ 
    user: r.identifier,
    by: r.asked_by_id,
    until: r.until,
    date: r.created_at,
    reason: r.reason,
  }))
  const stalkData = await pool.query(`SELECT * FROM discord_stalks WHERE identifier = ${message.author.id}`)
  const stalkChannel = guild.channels.cache.get(env.get('STALK_CHANNEL')) as TextChannel
  
  finishedStalk.map(async (stalk: Record<string, string>) => {
    await pool.query(`DELETE FROM discord_stalks WHERE identifier = "${stalk.user}"`)
    const embed = new MessageEmbed()
      .setColor('#2fff03')
      .setTitle(`Fin de surveillance`)
      .addField(`Tag de l'utilisateur`, `<@${stalk.user}>`, true)
      // @ts-ignore
      .addField('Surveillance demandé par', `<@${stalk.by}>`, true)
      // @ts-ignore
      .addField('Début de la surveillance', new Date(stalk.date).toLocaleString(), false)
      // @ts-ignore
      .addField('Raison de la surveillance', stalk.reason)
      .setTimestamp()
      // @ts-ignore
      .setFooter(`Surveillance terminée le ${new Date(stalk.until).toLocaleDateString()}`)
    await stalkChannel.send({ embed })
  })
}

const handleStalk = async (client: Client, message: Message): Promise<void> => {
  const guild = client.guilds.cache.find(g => g.id === env.get('SERVER_ID'))
  
  if (!guild) return
  // @ts-ignore
  const stalkData = await pool.query(`SELECT * FROM discord_stalks WHERE identifier = ${message.author.id}`)
  // @ts-ignore
  const stalkChannel = guild.channels.cache.get(env.get('STALK_CHANNEL')) as TextChannel
  const embed = new MessageEmbed()
    .setColor('#f16a05')
    .setTitle(`Surveillance de ${message.author.username}`)
    .addField(`Tag de l'utilisateur:`, `<@${message.author.id}>`, true)
    .addField('Message', message.content)
    .addField('Salon', `<#${message.channel.id}>`, true)
    .addField('Lien vers le message', message.url, true)
    // @ts-ignore
    .addField('Demandé par', `<@${stalkData[0][0].asked_by_id}>`, true)
    // @ts-ignore
    .addField('Raison du stalk', stalkData[0][0].reason)
    .setTimestamp()
    // @ts-ignore
    .setFooter(`Surveillance engagée jusqu'au ${new Date(stalkData[0][0].until).toLocaleDateString()} à 23:59`)

    stalkChannel.send({ embed })
    /*await stalkChannel.threads.create({
    name: `Surveillance de ${message.author.username}`,
    autoArchiveDuration: 4320, // 3 days
    type: 'GUILD_PRIVATE_THREAD',
    reason: 'Surveillance engagé par ... jusqu\'au ...',
    // @ts-ignore
    }).then(threadChannel => threadChannel.send({ embeds: [suggestEmbed] })).catch(console.error)*/
}

export {
  retrieveStalkedUsers,
  removeFinishedStalks,
  handleStalk,
}

