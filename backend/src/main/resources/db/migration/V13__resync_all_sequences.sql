-- V13: Resynchronize all PostgreSQL BIGSERIAL sequences with existing max table IDs
DO $$
DECLARE
    seq RECORD;
BEGIN
    FOR seq IN 
        SELECT 
            table_name, 
            column_name, 
            pg_get_serial_sequence(table_name, column_name) as seq_name
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_default LIKE 'nextval%'
    LOOP
        IF seq.seq_name IS NOT NULL THEN
            EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(%I) FROM %I), 1) + 1)', 
                           seq.seq_name, seq.column_name, seq.table_name);
        END IF;
    END LOOP;
END $$;
