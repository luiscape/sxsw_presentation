drawGaulBoundary = function(data_path, data_points, div_id) {

    var path_data, points_data;
        path_data = data_path;
        points_data = data_points;

    // This is left outside because d3.json is asyncrhonous.
    // If we leave theese parameters outside, the page will load
    // them and then load the SVG. Otherwise, the geometry will only
    // be loaded after d3.json is ready, possibly causing 'page reflow'.
    var width = 1000,
        height = 800;

    // Create a projection object. Among its attributes:
    // a type of projection (`mercator`), a scale, the center point,
    // size (i.e. translation).
    var projection = d3.geo.mercator()
        .scale(60000)
        .center([0,0])  // change centering
        .translate([width / 2, height / 2]);

    // Create the SVG and determine its area.
    // Before creating a new map, delete the previous.
    var svg = d3.select(div_id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a path generator.
    var path = d3.geo.path()
        .projection(projection);

    queue()
        .defer(d3.json, path_data)
        .defer(d3.json, points_data)
        .await(makeMap);

    function makeMap(error, json1, json2) {
        if (error)
            console.log(error);

        var svg = d3.select("svg");
        var loc = json1.locations[0];
        var points = [];
        json2["features"].forEach(function(x) { points.push(x["geometry"]["coordinates"]) } );

        // Debugging
        // console.log(loc);
        // console.log(points);

        // Compute the bounds of a feature of interest, then derive scale & translate.
        var b = d3.geo.bounds(loc),
            s = .9 / Math.max(Math.abs(b[1][0] - b[0][0]) / width, (Math.abs(b[1][1] - b[0][1]) / height)),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];


        var c = d3.geo.centroid(loc); // calculating the centroid. the output is long,lat.
        projection
        // .scale(s)
            .center(c);
        // .translate(t);

        // Adding
        svg.append("path")
            .datum(loc)
            .attr("d", path)
            .attr("class", "boundary");

        var svg = d3.select("svg"),
            svgWidth = svg.attr("width"),
            svgHeight = svg.attr("height");

        var paths = svg.selectAll("path")
            .call(transition);

        var dots = svg.selectAll("circles")
            .data(points).enter()
            .append("circle")
            .attr("cx", function(d) { return projection(d)[0] })
            .attr("cy", function(d) { return projection(d)[1]; console.log(projection(d)[1]); })
            .attr("r", "2px")
            .attr("fill", "red")

        function transition(path) {
            path.transition()
                .duration(5000)
                .attrTween("stroke-dasharray", tweenDash)
                // .each("end", function() { d3.select(this).call(transition); }); // infinite loop
        }

        function transitionPoints(dots) {
            path.transition()
                .duration(5000)
                .attrTween("stroke-dasharray", tweenDash)
                // .each("end", function() { d3.select(this).call(transition); }); // infinite loop
        }

        function tweenDash() {
            var l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray attr
            return function(t) {
                return i(t);
            };
        }

      // Make country name appear.
      // var entity_name = json.locations[0].properties.ADM0_NAME;
      // $('#entity-name').html(entity_name);
      // $('#entity-name').addClass('animated fadeInDown');
    };

};

function animateBoundaries() {
    var svg = d3.select("svg"),
        svgWidth = svg.attr("width"),
        svgHeight = svg.attr("height");

    var paths = svg.selectAll("path")
        .call(transition);

    function transition(path) {
        path.transition()
            .duration(5000)
            .attrTween("stroke-dasharray", tweenDash)
            // .each("end", function() { d3.select(this).call(transition); }); // infinite loop
    }

    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray attr
        return function(t) {
            return i(t);
        };
    }
};