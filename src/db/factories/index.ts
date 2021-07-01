import type {
  TableName,
  User,
} from '@ustar_travel/discord-bot'

import { psql } from '../../connectors'
import makeFactory from './factory'

// eslint-disable-next-line import/prefer-default-export
export const userFactory = makeFactory<User>(psql, <TableName>'users')
