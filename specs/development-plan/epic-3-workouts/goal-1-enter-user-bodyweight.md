# Goal 1 - user can enter and update their body weight

On every page apart from the login page, show the user's name at top right of the page. The name should be cached in localStorage with the auth tokens. If clicked, take the user to `/users/{userId}`.

On the user page, the page title should be the user's name. There should be an input below it for the user to enter their body weight in KG (allowing 2 decimal places). If the user's has previously saved their body weight, that value should pre-populate the input. 

Store the body weight in a new table in the remote DB - `user_body_weights` which will store the body weights for all users, with the date / time entered, the weight, and the unit as an enum (which will always be KG, for the time being).

Every time the user updates their body weight, it should add a new record to the `user_body_weights` table, so that later (after this goal), they can track their weight over time.
