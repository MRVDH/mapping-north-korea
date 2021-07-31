import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import store from '@/store';
import router from '@/router';
import { START_LOADING, STOP_LOADING, SELECT_SECTOR, SELECT_SECTOR_SET, SET_POI_MODAL, SET_ADD_MODE_LATITUDE, SET_ADD_MODE_LONGITUDE, SELECT_POI } from "@/store/mutationTypes";

var instance;

const LAYER = {
    POI_LAYER: 'poi-layer',
    SELECTED_POI_LAYER: 'selected-poi-layer',
    SECTOR_SET_LAYER: 'sector-set-layer',
    SECTOR_LAYER: 'sector-layer',
    SELECTED_SECTOR_LAYER: 'selected-sector-layer',
    POI_SOURCE: 'poi-source',
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
    geoJsonPois: [],

    newMap (darkMode) {
        mapboxgl.accessToken = "pk.eyJ1IjoibXJ2ZGgiLCJhIjoiY2tpN2pjNmR6MWl6NzJ6cXMxZHYxZXF2cyJ9.6FUJ6L-3rIIUliPnyoo4sQ";

        this.map = new mapboxgl.Map({
            container: 'map',
            style: darkMode ? MAP_STYLE.DARK : MAP_STYLE.LIGHT,
            center: [ 127.500, 39.686],
            zoom: 5.5,
            antialias: true
        });

        this.map.on('click', (event) => {
            if (store.state.addMode) {
                this.setAddMode(false);
                store.dispatch(SET_POI_MODAL, true);
                store.dispatch(SET_ADD_MODE_LATITUDE, event.lngLat.lat);
                store.dispatch(SET_ADD_MODE_LONGITUDE, event.lngLat.lng);
            } else {
                let featuresUnderMouse = this.map.queryRenderedFeatures(event.point).filter(x => x.source === LAYER.SECTOR_SOURCE);

                if (featuresUnderMouse?.length || !router.currentRoute.params.sectorSetId || !router.currentRoute.params.sectorId) {
                    return;
                }

                this.routeToSectorSet(router.currentRoute.params.sectorSetId, true);
                this.map.setFilter(LAYER.SELECTED_SECTOR_LAYER, [ "==", [ "get", "_id" ], "" ]);
                this.map.setFilter(LAYER.SELECTED_POI_LAYER, [ "==", [ "get", "_id" ], "" ]);
                store.dispatch(SELECT_SECTOR, null);
                store.dispatch(SELECT_POI, null);
            }
        });

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

        instance = this;

        return this.map;
    },
    remove () {
        this.map.remove();
    },
    setAddMode (toVisible) {
        if (toVisible) {
            this.map.on('mousemove', this.mapMouseMoveEvent);
        } else {
            this.map.off('mousemove', this.mapMouseMoveEvent);
            this.map.getCanvas().style.cursor = 'pointer';
        }
    },
    mapMouseMoveEvent () {
        instance.map.getCanvas().style.cursor = 'crosshair';
    },
    setMapComponent (component) {
        this.component = component;
    },
    displayPointOfInterests () {
        this.geoJsonPois = this.pointOfInterestsToGeoJson(store.state.pointOfInterests);

        this.map.addSource(LAYER.POI_SOURCE, {
            'type': 'geojson',
            'data': this.geoJsonPois
        });

        this.map.addLayer({
            id: LAYER.POI_LAYER,
            type: 'circle',
            source: LAYER.POI_SOURCE,
            paint: {
                "circle-color": "#728BD4",
                "circle-radius": 6,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
            }
        });

        this.map.addLayer({
            id: LAYER.SELECTED_POI_LAYER,
            type: 'circle',
            source: LAYER.POI_SOURCE,
            paint: {
                "circle-color": "#949DF6",
                "circle-radius": 6,
                "circle-stroke-width": 1,
                "circle-stroke-color": "yellow"
            },
            filter: ["==", "_id", ""]
        });

        this.map.on('click', LAYER.POI_LAYER, (event) => {
            const poiId = this.map.queryRenderedFeatures(event.point).find(feature => feature.source === LAYER.POI_SOURCE)?.properties._id;

            if (store.state.selectedPoi?._id === poiId) {
                this.deselectPoi();
            } else {
                this.selectPoi(poiId);
            }
        });
    },
    selectAndFlyToPoi (poi) {
        this.selectPoi(poi._id);
        this.map.flyTo({
            center: [ poi.longitude, poi.latitude ],
            speed: 1.5,
            essential: true,
            zoom: 17
        });
    },
    selectPoi (poiId) {
        const selectedPoi = store.state.pointOfInterests.find(x => x._id === poiId);
    
        if (!selectedPoi) {
            throw `selectedPoi: ${selectedPoi} should exist in sectors array but can't be found.`;
        }

        if (!store.state.selectedPoi || selectedPoi._id !== store.state.selectedPoi._id) {
            store.dispatch(SELECT_POI, selectedPoi);
        }
        this.map.setFilter(LAYER.SELECTED_POI_LAYER, [ "==", [ "get", "_id" ], poiId || "" ]);
    },
    deselectPoi () {
        this.map.setFilter(LAYER.SELECTED_POI_LAYER, [ "==", [ "get", "_id" ], "" ]);
        store.dispatch(SELECT_POI, null);
    },
    setPoiVisibility (toVisible) {
        if (toVisible) {
            this.displayPointOfInterests();
        } else {
            if (this.map.getLayer(LAYER.POI_LAYER)) {
                this.map.removeLayer(LAYER.POI_LAYER);
            }

            if (this.map.getLayer(LAYER.SELECTED_POI_LAYER)) {
                this.map.removeLayer(LAYER.SELECTED_POI_LAYER);
            }
    
            if (this.map.getSource(LAYER.POI_SOURCE)) {
                this.map.removeSource(LAYER.POI_SOURCE);
            }
        }
    },
    displaySectorSets () {
        let geoJsonSectorSets = this.sectorSetsToGeoJson(store.state.sectorSets);

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
            if (!this.addMode) {
                this.map.getCanvas().style.cursor = 'pointer';
                this.map.doubleClickZoom.disable();
            }
        });
            
        this.map.on('mouseleave', LAYER.SECTOR_SET_LAYER, () => {
            if (!this.addMode) {
                this.map.getCanvas().style.cursor = '';
                this.map.doubleClickZoom.enable();
            }
        });

        this.map.on('click', LAYER.SECTOR_SET_LAYER, (event) => {
            if (this.map.queryRenderedFeatures(event.point).some(feature => feature.source === LAYER.POI_SOURCE)) {
                return;
            }
            if (!store.state.addMode) {
                this.selectSectorSet(event.features[0].properties._id);
            }
        });

        if (router.currentRoute.params.sectorSetId) {
            this.selectSectorSet(router.currentRoute.params.sectorSetId);
        }

        this.map.moveLayer(LAYER.POI_LAYER);
        this.map.moveLayer(LAYER.SELECTED_POI_LAYER);
    },
    selectSectorSet (sectorSetId) {
        if (!sectorSetId) {
            throw `sectorSetId can't be of value: ${sectorSetId}`;
        }

        this.deselectPoi();

        store.dispatch(SELECT_SECTOR_SET, store.state.sectorSets.find(x => x._id === sectorSetId));
        this.map.setLayoutProperty(LAYER.SECTOR_SET_LAYER, 'visibility', 'none');

        store.dispatch(START_LOADING, 'loadingSectors');
        MapApiService.getSectorsBySectorSetId(sectorSetId).then((res) => {
            this.sectors = res.data;
            this.geoJsonSectors = this.sectorsToGeoJson(this.sectors);

            this.map.addSource(LAYER.SECTOR_SOURCE, {
                'type': 'geojson',
                'data': this.geoJsonSectors
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
                if (!this.addMode) {
                    this.map.getCanvas().style.cursor = 'pointer';
                    this.map.doubleClickZoom.disable();
                }
            });
            
            this.map.on('mouseleave', LAYER.SECTOR_LAYER, () => {
                if (!this.addMode) {
                    this.map.getCanvas().style.cursor = '';
                    this.map.doubleClickZoom.enable();
                }
            });

            this.map.on('click', LAYER.SECTOR_LAYER, this.sectorClickEvent);

            this.map.moveLayer(LAYER.POI_LAYER);
            this.map.moveLayer(LAYER.SELECTED_POI_LAYER);

            var bounds = new mapboxgl.LngLatBounds();

            this.geoJsonSectors.features.forEach((feature) => {
                bounds.extend(feature.geometry.coordinates[0][0]);
            });

            this.map.fitBounds(bounds, { padding: 50 });

            if (router.currentRoute.params.sectorId) {
                this.selectSector(router.currentRoute.params.sectorId);
            } else {
                this.routeToSectorSet(sectorSetId);
            }
        }).catch((error) => {
            console.error(error);
            EventBus.$emit(MESSAGE_ERROR, this.component.$t('request.load_sectors'));
        }).finally(() => {
            store.dispatch(STOP_LOADING, 'loadingSectors');
        });
    },
    sectorClickEvent (event) {
        if (instance.map.queryRenderedFeatures(event.point).some(feature => feature.source === LAYER.POI_SOURCE)) {
            return;
        }
        if (!store.state.addMode) {
            instance.selectSector(event.features[0].properties._id);
        }
    },
    selectSector (sectorId) {
        if (!sectorId) {
            throw `sectorId can't be of value: ${sectorId}`;
        }
        
        this.deselectPoi();

        if (store.state.selectedSector && store.state.selectedSector._id === sectorId) {
            this.routeToSectorSet(router.currentRoute.params.sectorSetId);
            this.map.setFilter(LAYER.SELECTED_SECTOR_LAYER, [ "==", [ "get", "_id" ], "" ]);
            store.dispatch(SELECT_SECTOR, null);
        } else {
            let selectedSector = this.sectors.find(x => x._id === sectorId);

            if (!selectedSector) {
                throw `selectedSector: ${sectorId} should exist in sectors array but can't be found.`;
            }

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
    pointOfInterestsToGeoJson (pointOfInterests) {
        var geoJson = {
            features: [],
            type: 'FeatureCollection'
        };
        
        for (let poi of pointOfInterests) {
            geoJson.features.push({
                type: 'Feature',
                properties: {
                    _id: poi._id,
                    title: poi.title,
                    description: poi.description,
                    longitude: poi.longitude,
                    latitude: poi.latitude,
                    time: poi.time,
                    categories: poi.categories,
                    likes: poi.likes
                },
                geometry: {
                    type: 'Point',
                    coordinates: [ poi.longitude, poi.latitude ]
                }
            });
        }

        return geoJson;
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
    },
    sectorUpdate (updatedSector) {
        let source = this.map.getSource(LAYER.SECTOR_SOURCE);

        this.sectors = this.sectors.filter(x => x._id !== updatedSector._id);
        this.sectors.push(updatedSector);

        this.geoJsonSectors.features = this.geoJsonSectors.features.filter(x => x.properties._id !== updatedSector._id);
        this.geoJsonSectors.features.push({
            type: 'Feature',
            properties: {
                _id: updatedSector._id,
                state: updatedSector.state,
                sectorSet: updatedSector.sectorSet
            },
            geometry: {
                type: 'Polygon',
                coordinates: updatedSector.coordinates
            }
        });

        source.setData(this.geoJsonSectors);
    },
    updatePois (pois) {
        let source = this.map.getSource(LAYER.POI_SOURCE);

        if (!source) {
            return;
        }

        this.geoJsonPois = this.pointOfInterestsToGeoJson(pois);

        source.setData(this.geoJsonPois);
    }
};