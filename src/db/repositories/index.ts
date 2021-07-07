import type {
  TableName,
  User,
} from '@ustar_travel/discord-bot'

import { psql } from '../../connectors'
import makeRepository from './repository'

// eslint-disable-next-line import/prefer-default-export
export const userRepo = makeRepository<User>(psql, <TableName>'users')
