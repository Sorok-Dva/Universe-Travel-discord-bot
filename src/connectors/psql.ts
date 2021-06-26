/** ***************************************************************************
 *  psql.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/24 11:15 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/25 12:00 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { createPool } from 'slonik'

const uri = env.get('POSTGRES_DB')
const pool = createPool(uri)

export default pool
