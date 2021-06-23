/** ***************************************************************************
 *  handlers/connection.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 9:57 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:29 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CronJob } from 'cron'
import { Client } from 'discord.js'
import { Bot } from '../core'

// all cron job goes here
const cronJobs = (client: Client): void => {
  const activitiesJob = [
    new CronJob('0 * * * *', () => Bot.setActivity()), // Set Bot Activity every minute
  ]

  activitiesJob.map(job => job.start())
}

export async function main (client: Client): Promise<void> {
  cronJobs(client)
}
