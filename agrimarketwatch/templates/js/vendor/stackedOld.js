var txt = null;
var data = {};
var current_plot = null;
var months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug',
    'Sept', 'Oct', 'Nov', 'Dec'];
var active = null;




var prepare_data = function (key) {
    console.log(key);
    console.log(txt);
    console.log(_.map(txt, function (entry) { return entry.commodity }));
    var xs = _.filter(txt, function (entry) { return entry.commodity === key; });
    console.log(xs);
    var grouped = _.groupBy(xs, function (entry) { return break_out_month(entry) }); // groups by month
    console.log(grouped);
    var max_vals = apply_across(grouped, function (obj) { return _.max(obj, function (e) { return e.mean }) });
    var min_vals = apply_across(grouped, function (obj) { return _.min(obj, function (e) { return e.mean }) });
    var avg_vals = apply_across(grouped, function (arr) { return mean(arr, function (e) { return e.mean }) });
    var obj = [{ key: 'Max', values: _.map(max_vals, 'mean') }, { key: 'Min', values: _.map(min_vals, 'mean') },
        { key: 'Average', values: avg_vals }];
    console.log(obj);
    data[key] = obj;

}

var plot_data = function () {
    var needed = data[active];
    console.log("Active");
    console.log(needed);

    nv.addGraph(function () {

        var chart = nv.models.multiBarChart()
          .transitionDuration(350)
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0)      //Angle to rotate x-axis labels.
          .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1)    //Distance between each group of bars.
        ;

        console.log('Step 1');

        chart.xAxis
            .tickFormat(d3.format(',f'));

        chart.yAxis
            .tickFormat(d3.format(',.1f'));

        console.log('Step2');
        console.log(needed);

        d3.select('#barChart svg')
            .datum(needed) //function () { console.log('Reached'); return needed;}
            .call(chart); // function () { console.log('Datum inserted'); return chart; }
        console.log('Step 3')
        //nv.utils.windowResize(chart.update);
        current_plot = chart;
        return chart;
    });
}

var plot_crop = function (value, key) {

    var cls = $(value).attr('class');
    if (cls != 'active') {
        console.log('made active');
        if (active != null && active != value) {
            $(active).attr('class', '');
        }

        active = value;

        $(value).attr('class', 'active');
        if (data[key] === undefined) // If the data for this crop hasn't been cached yet
        {
            console.log('Getting data for ' + key);
            if (txt == null) {
                console.log('sending request for data');


                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {

                        txt = eval(xhr.responseText);
                        console.log(txt);
                        console.log("Preparing data.....");
                        prepare_data(key);
                        plot_data(txt);
                    }


                }
                xhr.open('GET', 'http://127.0.0.1:5000/crops/monthly/all', true);
                xhr.send();
            }
            else {
                console.log("Preparing data.....");
                prepare_data(key);
                plot_data();
            }
        }
        else {
            plot_data();
        }
    }


};