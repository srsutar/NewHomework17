console.log("working");

// var apiKey = "pk.eyJ1IjoidGVycnlwb3R0ZXIiLCJhIjoiY2thZzAzc2txMDI3ZDJxcG42MHRobzlpYSJ9.dYTSO_40kXIRMZkdzEHsjA";
// var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
// }); 

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var Map = L.map("map", {
    center: [
        39.10, -90.30
    ],
    zoom: 4,
    layers: [lightMap]
});

// graymap.addto(Map);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function (data) {

    function attributes(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.8,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            weight: 0.5
        };
    }
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#DF4F30";
            case magnitude > 4:
                return "#53B1A4";
            case magnitude > 3:
                return "#7753B1";
            case magnitude > 2:
                return "#B153B1";
            case magnitude > 1:
                return "#B1537C";
            default:
                return "#96B153";
        }
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;

        }
        return magnitude * 6;


    }

    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);

        },
        style: attributes,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(Map);

    // var legend = L.control({ position: "bottomright" });
    // // Then add all the details for the legend
    // legend.onAdd = function () {
    //     var div = L.DomUtil.create("div", "legend");
    //     var grades = [0, 1, 2, 3, 4, 5];
    //     var colors = [
    //         "#98ee00",
    //         "#d4ee00",
    //         "#eecc00",
    //         "#ee9c00",
    //         "#ea822c",
    //         "#ea2c2c"
    //     ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    // for (var i = 0; i < grades.length; i++) {
    //     div.innerHTML +=
    //         "<i style='background: " + colors[i] + "'></i> " +
    //         grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    // }
    // return div;
    //     };
    //     // Finally, we our legend to the map.
    //     // legend.addTo(map);
    // });

    // Create a legend for map
    var magLegend = L.control({
        position: "bottomright"
    });

    // Add earthquake magnitude legend to map
    magLegend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend"),
            labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' +
                labels[i] + '<br>';
        }
        return div;
    }; magLegend.addTo(Map);
})
// Create function to set the color dependent on magnitude
function getColor(mag) {

        if (mag >= 5) {
            return "red";
        }
        else if (mag >= 4) {
            return "peru";
        }
        else if (mag >= 3) {
            return "darkorange";
        }
        else if (mag >= 2) {
            return "yellow";
        }
        else if (mag >= 1) {
            return "yellowgreen";
        }
        else {
            return "green";
        }
    };