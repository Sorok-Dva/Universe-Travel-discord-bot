import { env } from '@materya/carbon'
import {
  Client,
  VoiceChannel,
} from 'discord.js'

const updateStats = async (client: Client): Promise<void> => {
  const guild = client.guilds.cache.find(g => g.id === env.get('SERVER_ID'))
  const roles = client.guilds.cache.find(g => g.id === env.get('SERVER_ID'))?.roles.cache
  
  if (!guild) return
  await guild.members.fetch()
  
  const membersCountChannel = guild.channels.cache
    .get(env.get('STATS_MEMBERS_CHANNEL_ID')) as VoiceChannel
  const activeMembersCountChannel = guild.channels.cache
    .get(env.get('STATS_ACTIVE_MEMBERS_CHANNEL_ID')) as VoiceChannel
  const staffCountChannel = guild.channels.cache
    .get(env.get('STATS_STAFF_CHANNEL_ID')) as VoiceChannel
  const goalUsersCountChannel = guild.channels.cache
    .get(env.get('STATS_USERS_GOAL_ID')) as VoiceChannel
  
  const membersCount = guild.memberCount
  const activeMembersCount = roles?.get(env.get('FIRST_LEVEL_ROLE'))?.members.size ?? 0
  const staff = roles?.get(env.get('STAFF_ROLE'))?.members.size ?? 0
  
  let goalCount = 0
  switch (true) {
    case (membersCount < 80): goalCount = 80
      break
    case (membersCount > 80 && membersCount < 100): goalCount = 100
      break
    case (membersCount > 100 && membersCount < 150): goalCount = 150
      break
    case (membersCount > 150 && membersCount < 200): goalCount = 200
      break
    case (membersCount > 200 && membersCount < 300): goalCount = 300
      break
    case (membersCount > 300 && membersCount < 500): goalCount = 500
      break
    default: goalCount = membersCount + 20
  }
  
  await membersCountChannel
    .setName(`${membersCountChannel.name.split(':')[0]}: ${membersCount}`)
  await activeMembersCountChannel
    .setName(`${activeMembersCountChannel.name.split(':')[0]}: ${activeMembersCount}`)
  await staffCountChannel
    .setName(`${staffCountChannel.name.split(':')[0]}: ${staff}`)
  await goalUsersCountChannel
    .setName(`${goalUsersCountChannel.name.split(':')[0]}: ${goalCount}`)
}

export default updateStats

