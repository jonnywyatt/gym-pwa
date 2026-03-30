# Goal 4: visualise data in graphs

Add a new page - 'Session trends', which should be linked from the bottom of the dashboard page.

On it, for each routine, show a line graph tracking the one or two key metrics of that routine.

Session duration will always be a key metric, for every routine.

To determine if there is a second key metric for a routine:
- if the routine contains at least one exercise that has recordSetsType of WEIGHT, BODYWEIGHT_PLUS_WEIGHT, or BODYWEIGHT_MINUS_WEIGHT, then the second key metric will be total weight moved per session
- otherwise, if the routine contains at least one exercise that has any recordSetsType other than TIME or WEIGHT_AND_TIME, then the second key metric will be total reps per session

Show the key metric(s) as multiple data series on the same line graph. 

The routine name should be an h2 subheading. Then above the line graph show a label with the key metrics shown eg 'Duration & Weight' or 'Duration & Reps'.

The graph should show data over the last 6 months. In the next iteration of this feature, the user will be able to select different time periods on the graph.
r
## Implementation

Use Chart.js v4 via its Vue integration - https://vue-chartjs.org/guide/ which is v5.
Only load the Chart.js javascript / styles on the session trends page, don't load on every page.

[Reference to produce a line chart.](https://www.chartjs.org/docs/latest/charts/line.html)

### Styling

Use a chart background colour of --em-base.
For the data series lines, use the colour for --em-accent-fuchsia for time, and --em-accent-purple colour for the second key metric, if present.
The left Y axis should be time. If there's a second key metric, use the right Y axis for that.
On the X axis, it has to be legible on small screens so only show axis values for the axis min and max, plus axis ticks for the intervals.
