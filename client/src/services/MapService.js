import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default {
    newMap () {
        mapboxgl.accessToken = "pk.eyJ1IjoibXJ2ZGgiLCJhIjoiY2tpN2pjNmR6MWl6NzJ6cXMxZHYxZXF2cyJ9.6FUJ6L-3rIIUliPnyoo4sQ";

        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ 127.500, 39.686],
            zoom: 5.5,
            antialias: true
        });

        return map;
    }
};