-- ============================================================
-- Sigma DI — Create Real Supabase Auth User Script
-- ============================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- to create a real administrator user for the application.
-- ============================================================

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  user_email TEXT := 'admin@sigma-di.ma'; -- Your official email
  user_password TEXT := 'Satec2016'; -- Your official password
  user_exists BOOLEAN;
  provider_id_exists BOOLEAN;
BEGIN
  -- 1. Check if the user already exists in auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) INTO user_exists;

  IF NOT user_exists THEN
    -- Ensure pgcrypto extension is active (used for crypt and gen_salt)
    PERFORM * FROM pg_extension WHERE extname = 'pgcrypto';
    IF NOT FOUND THEN
      EXECUTE 'CREATE EXTENSION IF NOT EXISTS pgcrypto';
    END IF;

    -- 2. Insert the user into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      user_email,
      crypt(user_password, gen_salt('bf', 10)),
      now(),
      null,
      null,
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- 3. Check if the 'provider_id' column exists in auth.identities
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'auth' 
        AND table_name = 'identities' 
        AND column_name = 'provider_id'
    ) INTO provider_id_exists;

    -- 4. Insert into auth.identities
    IF provider_id_exists THEN
      EXECUTE '
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          $1,
          $2,
          jsonb_build_object(''sub'', $2, ''email'', $3),
          ''email'',
          $2::text,
          now(),
          now(),
          now()
        )' USING gen_random_uuid(), new_user_id, user_email;
    ELSE
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        new_user_id,
        jsonb_build_object('sub', new_user_id, 'email', user_email),
        'email',
        now(),
        now(),
        now()
      );
    END IF;

    RAISE NOTICE 'User % created successfully.', user_email;
  ELSE
    RAISE NOTICE 'User % already exists. Skipping creation.', user_email;
  END IF;
END $$;
