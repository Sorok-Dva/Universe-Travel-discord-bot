import { env } from '@materya/carbon'
import Discord from 'discord-user-bots'

const client = new Discord.Client(env.get('BUMPER_TOKEN'));

const autoDump = async (): Promise<void> => {
  client.send('947625279902330930', { content: `/bump` })
}

export default autoDump
