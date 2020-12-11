import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import store from '@/store';
import router from '@/router';
import { START_LOADING, STOP_LOADING, SET_SECTOR_SETS, SELECT_SECTOR, SELECT_SECTOR_SET } from "@/store/mutationTypes";

var instance;

const LAYER = {
    SECTOR_SET_LAYER: 'sector-set-layer',
    SECTOR_LAYER: 'sector-layer',
    SELECTED_SECTOR_LAYER: 'selected-sector-layer',
    SECTOR_SET_SOURCE: 'sector-set-source',
    SECTOR_SOURCE: 'sector-source'
};

const MAP_STYLE = {
    LIGHT: "mapbox://styles/mapbox/streets-v11",
    DARK: "mapbox://styles/mapbox/dark-v10"
}

export default {
    mapStyle: {
        LIGHT: "mapbox://styles/mapbox/streets-v11",
        DARK: "mapbox://styles/mapbox/dark-v10"
    },

    map: null,
    component: null,
    sectors: [],
    sectorSets: [],

    newMap (darkMode) {
        mapboxgl.accessToken = "pk.eyJ1IjoibXJ2ZGgiLCJhIjoiY2tpN2pjNmR6MWl6NzJ6cXMxZHYxZXF2cyJ9.6FUJ6L-3rIIUliPnyoo4sQ";

        this.map = new mapboxgl.Map({
            container: 'map',
            style: darkMode ? MAP_STYLE.DARK : MAP_STYLE.LIGHT,
            center: [ 127.500, 39.686],
            zoom: 5.5,
            antialias: true
        });

        this.map.on('click', this.mapClickEvent);

        instance = this;

        return this.map;
    },
    mapClickEvent (event) {
        let featuresUnderMouse = instance.map.queryRenderedFeatures(event.point).filter(x => x.source === LAYER.SECTOR_SOURCE);
            
        if ((featuresUnderMouse && featuresUnderMouse.length) || !router.currentRoute.params.sectorSetId || !router.currentRoute.params.sectorId) {
            return;
        }

        instance.routeToSectorSet(router.currentRoute.params.sectorSetId, true);
        instance.map.setFilter(LAYER.SELECTED_SECTOR_LAYER, [ "==", [ "get", "_id" ], "" ]);
        store.dispatch(SELECT_SECTOR, null);
    },
    setMapComponent (component) {
        this.component = component;
    },
    setDarkMode (darkMode) {
        this.map.setStyle(darkMode ? MAP_STYLE.DARK : MAP_STYLE.LIGHT);

        this.removeSectorLayer();
        this.removeSectorSetLayer();

        this.loadSectorSets(store.state.currentIteration._id.toString());
    },
    loadSectorSets (iterationId) {
        store.dispatch(START_LOADING, 'loadingsectors');
        MapApiService.getAllSectorSetsByIterationId(iterationId).then((res) => {
            this.sectorSets = res.data;

            store.dispatch(SET_SECTOR_SETS, this.sectorSets);
            let geoJsonSectorSets = this.sectorSetsToGeoJson(this.sectorSets);

            this.map.addSource(LAYER.SECTOR_SET_SOURCE, {
                'type': 'geojson',
                'data': geoJsonSectorSets
            });
    
            this.map.addLayer({
                id: LAYER.SECTOR_SET_LAYER,
                type: 'fill',
                source: LAYER.SECTOR_SET_SOURCE,
                paint: {
                    'fill-color': [ 'get', '_color' ],
                    'fill-opacity': 0.4
                }
            });

            this.map.on('mouseenter', LAYER.SECTOR_SET_LAYER, () => {
                this.map.getCanvas().style.cursor = 'pointer';
                this.map.doubleClickZoom.disable();
            });
                
            this.map.on('mouseleave', LAYER.SECTOR_SET_LAYER, () => {
                this.map.getCanvas().style.cursor = '';
                this.map.doubleClickZoom.enable();
            });

            this.map.on('click', LAYER.SECTOR_SET_LAYER, this.sectorSetClickEvent);

            if (router.currentRoute.params.sectorSetId) {
                this.selectSectorSet(router.currentRoute.params.sectorSetId);
            }

            //this.map.moveLayer('poi-layer');
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.component.$t('request.load_sector_sets'));
        }).finally(() => {
            store.dispatch(STOP_LOADING, 'loadingsectors');
        });
    },
    sectorSetClickEvent (event) {
        instance.selectSectorSet(event.features[0].properties._id);
    },
    selectSectorSet (sectorSetId) {
        store.dispatch(SELECT_SECTOR_SET, store.state.sectorSets.find(x => x._id === sectorSetId));
        this.map.setLayoutProperty(LAYER.SECTOR_SET_LAYER, 'visibility', 'none');

        store.dispatch(START_LOADING, 'loadingSectors');
        MapApiService.getSectorsBySectorSetId(sectorSetId).then((res) => {
            this.sectors = res.data;
            let geoJsonSectors = this.sectorsToGeoJson(this.sectors);

            this.map.addSource(LAYER.SECTOR_SOURCE, {
                'type': 'geojson',
                'data': geoJsonSectors
            });
    
            this.map.addLayer({
                id: LAYER.SECTOR_LAYER,
                type: 'fill',
                source: LAYER.SECTOR_SOURCE,
                paint: {
                    'fill-color': [ 'get', 'color', [ 'get', 'state' ] ],
                    'fill-opacity': 0.4
                }
            });

            this.map.addLayer({
                id: LAYER.SELECTED_SECTOR_LAYER,
                type: 'line',
                source: LAYER.SECTOR_SOURCE,
                paint: {
                    'line-color': 'yellow',
                    'line-width': 2
                },
                filter: ["==", "_id", ""]
            });

            this.map.on('mouseenter', LAYER.SECTOR_LAYER, () => {
                this.map.getCanvas().style.cursor = 'pointer';
                this.map.doubleClickZoom.disable();
            });
            
            this.map.on('mouseleave', LAYER.SECTOR_LAYER, () => {
                this.map.getCanvas().style.cursor = '';
                this.map.doubleClickZoom.enable();
            });

            this.map.on('click', LAYER.SECTOR_LAYER, this.sectorClickEvent);

            //this.map.moveLayer('poi-layer');

            var bounds = new mapboxgl.LngLatBounds();

            geoJsonSectors.features.forEach((feature) => {
                bounds.extend(feature.geometry.coordinates[0][0]);
            });

            this.map.fitBounds(bounds, { padding: 50 });

            if (router.currentRoute.params.sectorId) {
                this.selectSector(router.currentRoute.params.sectorId);
            } else {
                this.routeToSectorSet(sectorSetId);
            }
        }).catch((err) => {
            EventBus.$emit(MESSAGE_ERROR, this.component.$t('request.load_sectors'));
            throw err;
        }).finally(() => {
            store.dispatch(STOP_LOADING, 'loadingSectors');
        });
    },
    sectorClickEvent (event) {
        instance.selectSector(event.features[0].properties._id);
    },
    selectSector (sectorId) {
        if (store.state.selectedSector && store.state.selectedSector._id === sectorId) {
            this.routeToSectorSet(router.currentRoute.params.sectorSetId);
            this.map.setFilter(LAYER.SELECTED_SECTOR_LAYER, [ "==", [ "get", "_id" ], "" ]);
            store.dispatch(SELECT_SECTOR, null);
        } else {
            let selectedSector = this.sectors.find(x => x._id === sectorId);
            store.dispatch(SELECT_SECTOR, selectedSector);
            this.map.setFilter(LAYER.SELECTED_SECTOR_LAYER, [ "==", [ "get", "_id" ], sectorId || "" ]);
            this.routeToSector(selectedSector.sectorSet, selectedSector._id);
        }
    },
    goToSectorSets () {
        this.removeSectorLayer();
        this.map.setLayoutProperty(LAYER.SECTOR_SET_LAYER, 'visibility', 'visible');
        store.dispatch(SELECT_SECTOR, null);
        router.push({ name: 'MapPage' });
    },
    sectorSetsToGeoJson (sectorSets) {
        var geoJson = {
            features: [],
            type: 'FeatureCollection'
        };

        for (var sectorSet of sectorSets) {
            geoJson.features.push(sectorSet.feature);
        }

        return geoJson;
    },
    sectorsToGeoJson (sectors) {
        var geoJson = {
            features: [],
            type: 'FeatureCollection'
        };

        for (var sector of sectors) {
            geoJson.features.push({
                type: 'Feature',
                properties: {
                    _id: sector._id,
                    state: sector.state,
                    sectorSet: sector.sectorSet
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: sector.coordinates
                }
            });
        }

        return geoJson;
    },
    removeSectorLayer () {
        if (this.map.getLayer(LAYER.SECTOR_LAYER)) {
            this.map.off('click', LAYER.SECTOR_LAYER, this.sectorClickEvent);
            this.map.removeLayer(LAYER.SECTOR_LAYER);
        }

        if (this.map.getLayer(LAYER.SELECTED_SECTOR_LAYER)) {
            this.map.removeLayer(LAYER.SELECTED_SECTOR_LAYER);
        }
        
        if (this.map.getSource(LAYER.SECTOR_SOURCE)) {
            this.map.removeSource(LAYER.SECTOR_SOURCE);
        }
    },
    removeSectorSetLayer () {
        if (this.map.getLayer(LAYER.SECTOR_SET_LAYER)) {
            this.map.off('click', LAYER.SECTOR_SET_LAYER, this.sectorSetClickEvent);
            this.map.removeLayer(LAYER.SECTOR_SET_LAYER);
        }
        
        if (this.map.getSource(LAYER.SECTOR_SET_SOURCE)) {
            this.map.removeSource(LAYER.SECTOR_SET_SOURCE);
        }
    },
    routeToSectorSet (sectorSetId, force) {
        if (router.currentRoute.params.sectorSetId !== sectorSetId || force) {
            router.push({ name: 'MapPage', params: { sectorSetId: sectorSetId } });
        }
    },
    routeToSector (sectorSetId, sectorId) {
        if (router.currentRoute.params.sectorSetId !== sectorSetId || router.currentRoute.params.sectorId !== sectorId) {
            router.push({ name: 'MapPage', params: { sectorSetId: sectorSetId, sectorId: sectorId } });
        }
    }
};