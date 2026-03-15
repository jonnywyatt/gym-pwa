# API & DB performance analysis

Analyse the current PostgreSQL DB schema, particularly the use of JSON in the `exercises_completed` field of the `user_workouts` table. There are upcoming app features eg alerting the user if they beat a record for the highest total weight moved for a given exercise ID, by the current user. This could require comparing values from the `exercises_completed` field across hundreds or even thousands of records (after filtering by the user_id for the current user).

An example value for `exercises_completed` for a single record in `user_workouts` table is in ./exercises-completed-example.json.

The existing `total_weight_kg` field is already a denormalised aggregate stored at the workout level. It's worth noting this pattern exists in the schema, as it's directly relevant — similar per-exercise aggregates might be a simple extension of what's already been done.

Would a query against that field across the entire table be performant? If there is a better structure to store user workouts in, please suggest it.
