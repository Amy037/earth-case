//kæsher data fra url
earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

// The following geoJSON gives layers of plate boundaries, geometry "LineString"
//platesUrl = "static/data/PB2002_boundaries.json" 

// https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json


function getColor(mag) { //kode2
    let color = '';
    if (mag < 1) {
      color = '#1a9850';
    } else if (mag < 2) {
      color = '#91cf60';
    } else if (mag < 3) {
      color = '#d9ef8b';
    } else if (mag < 4) {
      color = '#fee08b';
    } else if (mag < 5) {
      color = '#fc8d59';
    } else { // magnitude 5+
      color = '#d73027';
    }
    return color
    }
// Declare function to create features
function createFeatures(earthquakeData) {
    // pupup
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>");
    }
    //pins
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // strl magnitude
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillOpacity: 1,
                color: getColor(feature.properties.mag)
            })
        },
        // Appender popups
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
};

// Declare function to create map
function createMap(earthquakes, plates) {
    // Declare map layers
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    
    // Declare base maps array to be chosen from
    var baseMaps = {
        Light: light,
        Outdoors: outdoors,
        Satellite: satellite
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    }

    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4.5,
        layers: [mapLayer, earthquakes]
    });

    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "rgb(183, 243, 77)",
            "rgb(226, 243, 77)",
            "rgb(243, 219, 77)",
            "rgb(243, 186, 77)",
            "rgb(240, 167, 107)",
            "rgb(240, 107, 107)"];
        var labels = [];

        var legendInfo = "<h1>Earthquake intensity<h1>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">5+</div>" +
                "<div class=\"fourth\">4-5</div>" +
                "<div class=\"third\">3-4</div>" +
                "<div class=\"second\">2-3</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(myMap);

};

d3.json(earthquakesUrl, function(data) {
    // Create features with the earthquakes data
    createFeatures(data.features)
});

/* d3.json(platesUrl, function(platesData) {
    createFeatures(data.features)
}); */

/* d3.json(platesUrl, function (platesData) {
    console.log(platesData);
    createFeatures(earthquakeData.features, platesData.features); */