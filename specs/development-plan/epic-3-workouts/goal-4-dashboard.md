# Goal 4 - dashboard / home page

The / route should change to be the home page / dashboard. If the user accesses / when they're logged out, redirect them to /login (which should render the LoginPage.vue that's currently mapped to /).

The / route, when the user is logged in, should show a new Dashboard page. It should have links to the Routines page and the Workouts page.

The Workouts page should have a link at the top to go back to the Dashboard.

## Enhancements
The dashboard page should show under the Routine subheading, up to the first three stored routines, each with 2 links - 'Details'   
and 'Start workout'.                                                                                                                   
Under the Workouts subheading it should show 'Last workout' with the name, date & time, total weight & duration, plus a Summary      
link to go to the workout summary page. Below that, a 'See all' link, going to the /workouts page.  
