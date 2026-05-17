# Data loading performance

The app has a bit of a performance issue with data fetches taking seconds to load in production.

The home page caches its main data fetch, but other pages don't. This is so that updates appear immediately. Eg after a session is edited and the session detail page reloads, it needs to reflect the latest changes.

Maybe we could adopt a technique where if a page is visited right after a data change, the cache is invalidated, otherwise the data is served from cache. 

Suggest some technical approaches. eg 
if the user saves a change to a routine, could -
- a) if they're redirected to the view routine page, a querystring could be added that would force cache invalidation
- b) would it be possible for the save operation to also invalidate the cache

Also suggest which layers of caching would be most effective -
- API caching headers
- service worker caching

## Page by page analysis of cache invalidation

/session-trends page - the data fetches can be heavily cached as use trend lines that average data over several months.

/sessions page - any new session just completed needs to be reflected on the current month's calendar

/routines page - after a routine has been created, invalidate the cache

/routines/:id page - after routine edited, invalidate cache

## Database query performance
Analyse the data queries for the above pages. Do any over-fetch? Can any be optimised / made faster?
