# Split default Strength routine

I want to split the default Strength routine into Upper body and Lower body.
The exercises in strength will already be easy to classify into one or the other.
Colour mappings should be - Upper body uses --em-accent-teal, Lower body uses --em-accent-flat-purple, and Core uses --em-accent-aqua.

First, write a script to run a data migration on the local DB:
* split Strength routine into the two new routines
* split historical workouts using Strength routine into two and recalculating time and weight for each.

All the data analysis eg trends etc, should recalculate on the fly.
