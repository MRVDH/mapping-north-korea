<i18n>
{
    "en": {
        "request": {
            "load_sectors": "Something went wrong while trying to load the sectors.",
            "load_sector_sets": "Something went wrong while trying to load the regions."
        }
    },
    "ko": {
        "request": {
            "load_sectors": null,
            "load_sector_sets": null
        }
    }
}
</i18n>

<template>
    <div id="map"></div>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import * as L from 'leaflet/src/Leaflet';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SELECT_SECTOR, SET_SECTOR_SETS, SELECT_SECTOR_SET } from "@/store/mutationTypes";

const defaultStyle = {
    weight: 1,
    opacity: 0.6
};

export default {
    name: 'CustomMap',
    data () {
        return {
            map: null,
            sectorLayer: null,
            sectors: null,
            selectedSector: null,
            lightTileLayer: null,
            darkTileLayer: null,
            sectorSetLayer: null
        };
    },
    computed: {
        darkMode () {
            return this.$store.state.darkMode;
        },
        updatedSector () {
            return this.$store.state.selectedSector;
        },
        currentIteration () {
            return this.$store.state.currentIteration;
        },
        sectorSets () {
            return this.$store.state.sectorSets;
        },
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        }
    },
    watch: {
        darkMode (newThemeIsDark) {
            this.setDarkMode(newThemeIsDark);
        },
        updatedSector (sector) {
            if (!sector) {
                return;
            }

            // find and update the sector in the sector list.
            this.sectors.features[this.sectors.features.findIndex(x => x.properties._id === sector.properties._id)] = sector;

            // find and update the sector that is drawn.
            for (var layerIndex in this.sectorLayer._layers) {
                if (this.sectorLayer._layers[layerIndex].feature.properties._id === sector.properties._id) {
                    this.sectorLayer._layers[layerIndex].feature = sector;
                    this.sectorLayer._layers[layerIndex].setStyle({
                        fillColor: sector.properties.state.color
                    });
                    break;
                }
            }
        },
        currentIteration (newIteration) {
            if (!newIteration) {
                return;
            }

            this.loadSectorSets();
        },
        selectedSectorSet (newValue) {
            if (newValue) {
                return;
            }

            this.$router.push({ name: 'MapPage' });
            this.map.removeLayer(this.sectorLayer);
            this.map.addLayer(this.sectorSetLayer);
        }
    },
    mounted () {
        this.initMap();
        
        this.setDarkMode(this.darkMode);

        EventBus.$on('mnk:go-to-sector', (sectorInfo) => {
            this.$router.push({ name: 'MapPageSector', params: { sectorSetId: sectorInfo.sectorSetId, sectorId: sectorInfo.sectorId } });
            this.selectSectorSet(this.getSectorSetLayerById(sectorInfo.sectorSetId));
        });

        EventBus.$on('mnk:go-to-sector-set', (sectorSetId) => {
            this.selectSectorSet(this.getSectorSetLayerById(sectorSetId));
        });

        if (this.currentIteration) {
            this.loadSectorSets();
        }
    },
    methods: {
        initMap: function () {
            this.map = L.map('map').on('click', this.clickMapEvent).setView([ 39.686, 127.500 ], 7);

            this.lightTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
            this.darkTileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            if (localStorage.darkTheme && localStorage.darkTheme === 'true') {
                this.darkTileLayer.addTo(this.map);
            } else {
                this.lightTileLayer.addTo(this.map);
            }
        },
        loadSectorSets () {
            this.$store.dispatch(START_LOADING, 'loadingsectors');
            MapApiService.getAllSectorSetsByIterationId(this.currentIteration._id).then((res) => {
                let sectorSets = res.data;

                this.$store.dispatch(SET_SECTOR_SETS, sectorSets);
                let geoJsonSectorSets = this.sectorSetsToGeoJson(sectorSets);

                this.sectorSetLayer = L.geoJSON(geoJsonSectorSets, {
                    style: (feature) => {
                        return {
                            color: feature.properties._color,
                            fillColor: feature.properties._color,
                            weight: defaultStyle.weight,
                            opacity: defaultStyle.opacity
                        };
                    }
                }).on('click', this.clickSectorSetEvent).on('dblclick', function (event) {
                    L.DomEvent.stopPropagation(event);
                    return false;
                }).addTo(this.map);

                if (this.$route.params.sectorSetId) {
                    this.selectSectorSet(this.getSectorSetLayerById(this.$route.params.sectorSetId));
                }
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.load_sector_sets'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'loadingsectors');
            });
        },
        setSectorSelected (layer, select) {
            if (select) {
                this.$store.dispatch(SELECT_SECTOR, layer.toGeoJSON());
                this.$router.push({ name: 'MapPageSector', params: { sectorSetId: layer.feature.properties.sectorSet, sectorId: layer.feature.properties._id } });
                layer.bringToFront();
                layer.setStyle({
                    color: '#FFFF00',
                    opacity: 1,
                    weight: 2,
                    fillColor: layer.options.fillColor
                });

                if (this.selectedSector) {
                    this.selectedSector.setStyle({
                        color: this.selectedSector.feature.properties.state.color,
                        weight: defaultStyle.weight,
                        opacity: defaultStyle.opacity
                    });
                }
                this.selectedSector = layer;
            } else {
                this.$store.dispatch(SELECT_SECTOR, null);
                this.$router.push({ name: 'MapPageSectorSet', params: { sectorId: this.$route.params.sectorSetId } });
                layer.setStyle({
                    color: this.selectedSector.feature.properties.state.color,
                    weight: defaultStyle.weight,
                    opacity: defaultStyle.opacity
                });
                this.selectedSector = null;
            }
        },
        selectSectorSet (layer) {
            let selectedSectorSet = this.sectorSets.find(x => x._id === layer.feature.properties._id);
            this.$store.dispatch(SELECT_SECTOR_SET, selectedSectorSet);

            if (!this.$route.params.sectorId) {
                this.$router.push({ name: 'MapPageSectorSet', params: { sectorSetId: selectedSectorSet._id } });
            }

            this.map.flyToBounds(layer.getBounds());
            this.map.removeLayer(this.sectorSetLayer);
            this.loadSectorsBySectorSetId(selectedSectorSet._id);
        },
        loadSectorsBySectorSetId (sectorSetId) {
            this.$store.dispatch(START_LOADING, 'loadingSectors');
            MapApiService.getSectorsBySectorSetId(sectorSetId).then((res) => {
                this.sectors = this.sectorsToGeoJson(res.data);

                this.sectorLayer = L.geoJSON(this.sectors, {
                    style: (feature) => {
                        return {
                            color: feature.properties.state.color,
                            fillColor: feature.properties.state.color,
                            weight: defaultStyle.weight,
                            opacity: defaultStyle.opacity
                        };
                    }
                }).on('click', this.clickSectorEvent).on('dblclick', function (event) {
                    L.DomEvent.stopPropagation(event);
                    return false;
                }).addTo(this.map);

                if (this.$route.params.sectorId) {
                    this.setSectorSelected(this.getSectorLayerById(this.$route.params.sectorId), true);
                    this.flyToSectorByPolygonCoordinates(this.selectedSector.feature.geometry.coordinates[0]);
                }
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.load_sectors'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'loadingSectors');
            });
        },
        clickSectorEvent: function (event) {
            if (this.selectedSector && this.selectedSector.feature.properties._id === event.layer.feature.properties._id) {
                this.setSectorSelected(event.layer, false);
            } else {
                this.setSectorSelected(event.layer, true);
            }
            L.DomEvent.stopPropagation(event);
        },
        clickSectorSetEvent (event) {
            this.selectSectorSet(event.layer);
            L.DomEvent.stopPropagation(event);
        },
        clickMapEvent () {
            if (!this.selectedSector) {
                return;
            }

            // this.sectorLayer._layers is an object and not an array...
            for (var layerIndex in this.sectorLayer._layers) {
                if (this.sectorLayer._layers[layerIndex].feature.properties._id === this.selectedSector.feature.properties._id) {
                    this.setSectorSelected(this.sectorLayer._layers[layerIndex], false);
                    break;
                }
            }
        },
        getSectorLayerById (sectorId) {
            for (var layerIndex in this.sectorLayer._layers) {
                if (this.sectorLayer._layers[layerIndex].feature.properties._id === sectorId) {
                    return this.sectorLayer._layers[layerIndex];
                }
            }
        },
        getSectorSetLayerById (sectorSetId) {
            for (var layerIndex in this.sectorSetLayer._layers) {
                if (this.sectorSetLayer._layers[layerIndex].feature && this.sectorSetLayer._layers[layerIndex].feature.properties._id === sectorSetId) {
                    return this.sectorSetLayer._layers[layerIndex];
                }
            }
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
        flyToSectorByPolygonCoordinates: function (coordinates) {
            this.map.flyTo([(coordinates[2][1] + coordinates[0][1]) / 2, (coordinates[1][0] + coordinates[0][0]) / 2], 13);
        },
        setDarkMode(newThemeIsDark) {
            if (newThemeIsDark) {
                this.map.removeLayer(this.lightTileLayer);
                this.map.addLayer(this.darkTileLayer);
            } else {
                this.map.removeLayer(this.darkTileLayer);
                this.map.addLayer(this.lightTileLayer);
            }
        }
    }
};
</script>

<style>
    #map {
        height: 100%;
        width: 100%;
        z-index: 1;
    }
    .leaflet-control-attribution {
        margin-bottom: 3px !important;
    }
</style>
