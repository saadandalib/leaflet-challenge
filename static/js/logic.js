var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data) {

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.7,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    function chooseColor(depth) {
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }
    function markerSize(magnitude) {
        return magnitude * 4;
        };
        
    var earthquakes = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    
    });

    createMap(earthquakes);


    function createMap(earthquakes) {
        var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/light-v10",
            accessToken: API_KEY
          });

        var overlayMaps = {
            Earthquakes: earthquakes
        };

        var myMap = L.map("map", {
            center: [37.7749, -122.4194],
            zoom: 5,
            layers: [grayscaleMap, earthquakes]
        });

        L.control.layers(overlayMaps, {
            collapsed: false
        }).addTo(myMap);    
    }

    var legend = L.control({ position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i =0; i < depth.length; i++) {
            div.innerHTML += 
            '<i style="background:' + colors[i] + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
              }
            return div;
    };
    legend.addTo(myMap);

    
});