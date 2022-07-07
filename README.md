# Quake

A visualization of hourly earthquake-data collected from [United States Geological Survey (USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson).


## What problems does the application solve? 

According to [USGS](https://www.usgs.gov/faqs/what-seismic-hazard-what-seismic-hazard-map-how-are-they-made-how-are-they-used-why-are-there?qt-news_science_products=0), hazard maps can be an important land-use for planning, mitigation and emergency response. This map vizulise the contemporary earthquakes within the last 60 minutes, with accurate location and magnitude. This can help seismologists, and potential rescue crews, calculate the possible damages and aftereffects of the earthquake.  


## How do you build the application? 

D3 is used to query GeoJSON data from the URL to USGS’ API. D3 is also used to query another GeoJSON, to illustrate the relationship between tectonic plates and seismic activity. The data on tectonic plates can be found at https://github.com/fraxen/tectonicplates.

Javascript and Leaflet are used to map the earthquakes and tectonic plate boundaries, and mapbox is used as a tile provider. HTML is used for the framework of the page and CSS for styling. 


## How should the application be used? 

Data markers reflect the magnitude of the earthquake in their size and color. A legend div on the lower right side provide an easy understanding the magnitude of the earthquake based on the corresponding colors and numbers. When clicking on a earthquake-marker, a popup will provide additional information about the earthquake, such as location and magnitude. 
The box in the top right corner of the map allows the user to select the desired background format, choosing from satellite, grayscale and outdoors. The box also allows the user to select or deselect the visibility of earthquakes and fault lines. 



### How do you run the application? 

To run the application the “static” folder needs to be in the working directory. This contains the .css and .js files necessary to display the maps in the index.html templates for each of the map visualizations. The visualizations are in the static/js/logic.js file and are called into the DOM in the index.html. The application is also available on https://amy037.github.io./
