// Query data for both the earthquakes and the plates
earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
platesUrl = "static/data/PB2002_boundaries.json"

// Sets color dependent on the magnitude of the earthquake
function getColor(mag) { 
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

// Declare function to create map features based on two inputs
function createFeatures(earthquakeData, platesData) {
    // Create popup layers using earthquake title, type and magnitude
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>");
    }
     //pins
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make circle radius dependent on the magnitude and get color based on the same feature
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillOpacity: 0.7,
                color: getColor(feature.properties.mag)
            })
        },
        // Append popups on each feature
        onEachFeature: onEachFeature
    });
    // Shade plates boundaries
    var plates = L.geoJSON(platesData, {
        style: function() {
            return {
                color: "orange",
                weight: 1.5
            }
        }
    });
    // Call create map function using the earthquakes and plates data
    createMap(earthquakes, plates);
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
    // Declare data layers to be chosen from
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": plates
    }
    // Declare map object and set it to the map element in the DOM
    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4.5,
        // Set default layers
        layers: [satellite, earthquakes, plates]
    });


    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            '#1a9850',
            '#91cf60',
            '#d9ef8b',
            '#fee08b',
            '#fc8d59',
            '#d73027'];
        var labels = [];

        var legendInfo = "<h2>Earthquake intensity<h2>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">5+</div>" +
                "<div class=\"fourth\">4-5</div>" +
                "<div class=\"third\">3-4</div>" +
                "<div class=\"second\">2-3</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>"
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
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
};

// Get earthquakes data
d3.json(earthquakesUrl, function(earthquakeData) {
    // Get plates data
    d3.json(platesUrl, function(platesData) {
        // Create features with the earthquakes and the plates data
        createFeatures(earthquakeData.features, platesData.features)
    });
});