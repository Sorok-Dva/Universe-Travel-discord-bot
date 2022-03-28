import { env } from '@materya/carbon'
import pool from '../db/pool'

const updateMessagesCount = async (): Promise<void> => {
  const result = await pool.query('SELECT discord_messages FROM stats')
  // @ts-ignore
  await pool.query('UPDATE stats SET discord_messages = ?', [ Number(result[0][0].discord_messages) + 1 ]) 
  return
}

export { updateMessagesCount }



