function displayMap(data) {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhbmJhbGRvbmFkbyIsImEiOiJjbGdlb21rem4wMmtuM2VxcGtocXIzYnY3In0.F1nd5mHblgPhYbTV1mD9-A';

    const map = new mapboxgl.Map({
        container: 'union-map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        projection: 'equirectangular',
        center: [-95.7129, 37.0902], // starting position [lng, lat]
        zoom: 3 // starting zoom
    });

    // Create empty GeoJSON objects for our points.
    let points = {
        "type": "FeatureCollection",
        "features": []
    };

    for (const union of data) {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point"
            },
            "properties": {
                "school": union["School"],
                "url": union["Link"]
            }
        };
        point.geometry["coordinates"] = [parseFloat(union["Longitude"]), parseFloat(union["Latitude"])]; // lng, lat
        points.features.push(point);
    }

    map.on("load", () => {

        // Add data source to the map.
        map.addSource("unions-source", {
            "type": "geojson",
            "data": points
        });

        // Add the layer to the map.
        map.addLayer({
            "id": "unions-layer",
            "type": "circle",
            "source": "unions-source",
            "paint": {
                'circle-color': '#67AFD2',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Documentation: https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/
        map.on('click', 'unions-layer', (e) => {

            // Extract data.
            const point = e.features[0];
            const geometry = point.geometry;
            const coordinates = geometry.coordinates.slice();
            const properties = point.properties;
            const school = properties.school;
            const url = properties.url;


            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Generate popup description
            let description = "<h3>" + school + "</h3>";
            if (url !== null && url.toLowerCase() !== "no website" && url.toLowerCase() !== "none" && url !== "") {
                let fullUrl = url;
                if (!fullUrl.startsWith("http")) {
                    fullUrl = "https://" + fullUrl;
                }
                description += "More info: <a href='" + fullUrl + "' target='_blank'>" + url + "</a>";
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
    });
}
