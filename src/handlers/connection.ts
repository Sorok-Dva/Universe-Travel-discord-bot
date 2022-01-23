/** ***************************************************************************
 *  handlers/connection.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 9:57 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/25 8:59 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CronJob } from 'cron'
import { sql } from 'slonik'
import { MessageEmbed, TextChannel } from 'discord.js'
import { Bot, errors } from '../core'
import { psql } from '../connectors'
import { NASA } from '../modules'

// all cron job goes here
const cronJobs = (): void => {
  const cronJobsList = [
    new CronJob('0 * * * *', () => Bot.setActivity()), // Set Bot Activity every minute
    new CronJob('0 10 * * *', async () => {
      const embed = <MessageEmbed> await NASA.apod({ notif: true })

      const apodChan = '852171012828299264'
      const channel = <TextChannel>Bot.client.channels.cache
        .find(c => c.id === apodChan)
      await channel.send({ embed })
    }), // NASA APOD
  ]
  cronJobsList.map(job => job.start())
}
// eslint-disable-next-line import/prefer-default-export
export async function main (): Promise<void> {
  try {
    await psql.query(sql`SELECT 1`) // ensure the connection is active with database
    console.log('Successfully connected with to the database container')
    await Bot.setActivity()
    await cronJobs()
  } catch (error) {
    errors.log(error)
  }
}
