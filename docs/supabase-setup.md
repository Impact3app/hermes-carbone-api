# Hermes Supabase Setup

## Current project

- Project ref: `leflkytxgjpiuaavvcgk`
- Schema used by Hermes: `hermes`

## Backend variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Why service role only

Hermes writes audit data, run logs, normalizations and estimation results into the private `hermes` schema.
This schema is not exposed to browser clients.

## Next backend check

1. Add the variables to Railway.
2. Start the API.
3. Send one `POST /estimate` request.
4. Verify inserted rows in:
   - `hermes.estimate_requests`
   - `hermes.estimate_inputs`
   - `hermes.estimate_runs`
   - `hermes.estimate_results`
