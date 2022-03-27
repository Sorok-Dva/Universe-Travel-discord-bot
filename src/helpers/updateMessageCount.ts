import { env } from '@materya/carbon'
import pool from '../db/pool'

const updateMessagesCount = async (): Promise<void> => {
  // @TODO: Ignore some channels	
  pool.query('SELECT discord_messages FROM stats', (err, rows, fields) => {
  if (!err) {
    // @ts-ignore
    const msg = rows[0].discord_messages as number
    pool.query('UPDATE stats SET discord_messages = ?', [msg + 1])
    // @ts-ignore
    } else throw new Error(err)
  })
   
  return 
}

export { updateMessagesCount }



