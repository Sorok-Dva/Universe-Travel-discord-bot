const tableName = 'users'

const up = sql => sql`
  CREATE TABLE ${sql.identifier([tableName])} (
    id VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    roles JSON NOT NULL DEFAULT '[]',
    message_count NUMERIC NOT NULL DEFAULT 0,
    bp INTEGER NOT NULL DEFAULT 4200,
    can_participate_giveaway BOOLEAN NOT NULL DEFAULT FALSE,
    staff BOOLEAN NOT NULL DEFAULT FALSE,
    muted BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSON NOT NULL DEFAULT '{}',

    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp,
    deleted_at TIMESTAMP NULL
  );
`

const down = sql => sql`
  DROP TABLE ${sql.identifier([tableName])};
`

module.exports = {
  up,
  down,
  tableName,
}
