// sparklines.js

// function to generate time-series
// sparklines using an API endpoint from
// HDX. this function depends on:
// -- c3.js
// -- d3.js
// -- datacollection.js (you can use jsonpath.js instead)
function generateSparkline(data_source, div_id, verbose) {

  d3.json(data_source, function(error, json) {
    if (error) return console.warn(error);

    // filtering the data
    // var data, values, dates, ind_data;

    // converting strings to date objects
    // var format = d3.time.format("%Y-%m-%d");
    // var date_time = [];
    // function getDate(element) {
    //    date_time.push(format.parse(String(element)));
    // };

    // dates.forEach(getDate)

    if (verbose) console.log(json);

    c3.generate({
      bindto: div_id,
      data: {
        x: 'date',
        x_format : '%Y-%m-%d',
        json: json,
        type: 'area-spline',
        labels: false,
        selection: {
          enabled: true,
          grouped: false,
          multiple: false,
        },
      },
      point: {
        show: false
      },
      legend: {
        show: false
      },
      color: { pattern: [ "#000000" ] },
      size: {
          height: 100
      },
      axis : {
        x : {
          show: false,
          type : 'timeseries',
          tick : {
            format : "%B %Y",
            culling: {
              max: 10  
            }
          },
        },
        y: {
          show: false
        }
      },
      tooltip: {
        show: true
      }
    });

  });


};

// generating sparklines
// each function calls the api endpoint
// from a resource independently.
// this causes a performance issue,
// but demonstrates how each call can be made independendtly.
generateSparkline('data/syrian_refugees.json', '#syrian_refugees', false);