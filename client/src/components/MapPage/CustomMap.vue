<template>
    <div id="map"></div>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/services/EventBus';

const defaultStyle = {
    weight: 1,
    opacity: 0.6
};

export default {
    name: 'CustomMap',
    data () {
        return {
            map: null,
            geoJsonLayer: null,
            sectors: null,
            selectedSector: null,
            lightTileLayer: null,
            darkTileLayer: null
        };
    },
    mounted () {
        this.initMap();

        EventBus.$on('mnk:update-sector', (sector) => {
            // find and update the sector in the sector list.
            this.sectors.features[this.sectors.features.findIndex(x => x.properties._id === sector.properties._id)] = sector;

            // find and update the sector that is drawn.
            for (var layerIndex in this.geoJsonLayer._layers) {
                if (this.geoJsonLayer._layers[layerIndex].feature.properties._id === sector.properties._id) {
                    this.geoJsonLayer._layers[layerIndex].feature = sector;
                    this.geoJsonLayer._layers[layerIndex].setStyle({
                        fillColor: sector.properties.state.color
                    });
                    break;
                }
            }
        });
        EventBus.$on('mnk:go-to-sector', (sectorId) => {
            this.setSectorSelected(this.getSectorLayerById(sectorId), true);
            this.flyToSectorByPolygonCoordinates(this.selectedSector.feature.geometry.coordinates[0]);
        });
        EventBus.$on('mnk:select-random-sector-by-state-id', (stateId) => {
            var sectorsByStateId = [];
            for (var layerIndex in this.geoJsonLayer._layers) {
                if (this.geoJsonLayer._layers[layerIndex].feature.properties.state._id === stateId) {
                    sectorsByStateId.push(this.geoJsonLayer._layers[layerIndex]);
                }
            }
            if (sectorsByStateId.length > 0) {
                this.setSectorSelected(sectorsByStateId[Math.floor(Math.random() * sectorsByStateId.length)], true);
                this.flyToSectorByPolygonCoordinates(this.selectedSector.feature.geometry.coordinates[0]);
            } else {
                EventBus.$emit('mnk:message-info', 'No sectors with that state.');
            }
        });
        EventBus.$on('mnk:toggle-dark-theme', (newThemeIsDark) => {
            if (newThemeIsDark) {
                this.map.removeLayer(this.lightTileLayer);
                this.map.addLayer(this.darkTileLayer);
            } else {
                this.map.removeLayer(this.darkTileLayer);
                this.map.addLayer(this.lightTileLayer);
            }
        });
    },
    methods: {
        initMap: function () {
            // eslint-disable-next-line
            this.map = L.map('map').on('click', this.clickMapEvent).setView([ 39.686, 127.500 ], 7);

            // eslint-disable-next-line
            this.lightTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
            // eslint-disable-next-line
            this.darkTileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            if (localStorage.darkTheme && localStorage.darkTheme === 'true') {
                this.darkTileLayer.addTo(this.map);
            } else {
                this.lightTileLayer.addTo(this.map);
            }

            EventBus.$emit('mnk:start-loading', 'loadingsectors');
            MapApiService.getAllSectors().then((res) => {
                this.sectors = this.sectorsToGeoJson(res.data);

                // eslint-disable-next-line
                this.geoJsonLayer = L.geoJSON(this.sectors, {
                    style: (feature) => {
                        return {
                            color: feature.properties.state.color,
                            fillColor: feature.properties.state.color,
                            weight: defaultStyle.weight,
                            opacity: defaultStyle.opacity
                        };
                    }
                }).on('click', this.clickSectorEvent).on('dblclick', function (event) {
                    // eslint-disable-next-line
                    L.DomEvent.stopPropagation(event);
                    return false;
                }).addTo(this.map);

                if (this.$route.params.sectorId) {
                    this.setSectorSelected(this.getSectorLayerById(this.$route.params.sectorId), true);
                    this.flyToSectorByPolygonCoordinates(this.selectedSector.feature.geometry.coordinates[0]);
                }
            }).catch(() => {
                EventBus.$emit('mnk:message-error', 'Something went wrong while trying to load the sectors.');
            }).finally(() => {
                EventBus.$emit('mnk:stop-loading', 'loadingsectors');
            });
        },
        setSectorSelected: function (layer, select) {
            if (select) {
                EventBus.$emit('mnk:select-sector', layer.toGeoJSON());
                this.$router.push({ name: 'MapPage', params: { sectorId: layer.feature.properties._id } });
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
                EventBus.$emit('mnk:deselect-sector');
                this.$router.push({ name: 'MapPage', params: { sectorId: null } });
                layer.setStyle({
                    color: this.selectedSector.feature.properties.state.color,
                    weight: defaultStyle.weight,
                    opacity: defaultStyle.opacity
                });
                this.selectedSector = null;
            }
        },
        clickSectorEvent: function (event) {
            if (this.selectedSector && this.selectedSector.feature.properties._id === event.layer.feature.properties._id) {
                this.setSectorSelected(event.layer, false);
            } else {
                this.setSectorSelected(event.layer, true);
            }
            // eslint-disable-next-line
            L.DomEvent.stopPropagation(event);
        },
        clickMapEvent: function () {
            if (this.selectedSector) {
                EventBus.$emit('mnk:deselect-sector');
                for (var layerIndex in this.geoJsonLayer._layers) {
                    if (this.geoJsonLayer._layers[layerIndex].feature.properties._id === this.selectedSector.feature.properties._id) {
                        this.setSectorSelected(this.geoJsonLayer._layers[layerIndex], false);
                        break;
                    }
                }
            }
        },
        getSectorLayerById: function (sectorId) {
            for (var layerIndex in this.geoJsonLayer._layers) {
                if (this.geoJsonLayer._layers[layerIndex].feature.properties._id === sectorId) {
                    return this.geoJsonLayer._layers[layerIndex];
                }
            }
        },
        sectorsToGeoJson: function (sectors) {
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
        flyToSectorByPolygonCoordinates: function (coordinates) {
            this.map.flyTo([(coordinates[2][1] + coordinates[0][1]) / 2, (coordinates[1][0] + coordinates[0][0]) / 2], 13);
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
