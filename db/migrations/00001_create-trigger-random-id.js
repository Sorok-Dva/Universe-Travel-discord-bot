const triggerName = 'random_id'

const up = sql => sql`
  CREATE OR REPLACE FUNCTION ${sql.identifier([triggerName])}()
  RETURNS TRIGGER AS
  $func$
  DECLARE
      length INT;
      new_id TEXT;
      duplicate_id TEXT;
  BEGIN
    length := TG_ARGV[0];
    LOOP
      new_id := array_to_string(
        ARRAY (
          SELECT substring(
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            FROM (ceil(random()*62))::INT FOR 1
          )
          FROM generate_series(1, length)
        ),
        ''
      );

      BEGIN
        EXECUTE 'SELECT id FROM ' || TG_TABLE_NAME || ' WHERE id = $1;'
          INTO duplicate_id
          USING new_id;
        IF duplicate_id IS NOT NULL THEN
          RAISE unique_violation;
        END IF;

        NEW.id := new_id;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        -- Do nothing and retry.
      END;
    END LOOP;

    RETURN NEW;
  END;
  $func$ LANGUAGE plpgsql;

`

const down = sql => sql`
  DROP FUNCTION IF EXISTS ${sql.identifier([triggerName])};
`

module.exports = {
  up,
  down,
  triggerName,
}
