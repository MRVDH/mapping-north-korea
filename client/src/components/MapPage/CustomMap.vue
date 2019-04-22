<template>
    <div id="map"></div>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/services/EventBus';

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
                    break;
                }
            }
        });
        EventBus.$on('mnk:go-to-sector', (sectorId) => {
            for (var layerIndex in this.geoJsonLayer._layers) {
                if (this.geoJsonLayer._layers[layerIndex].feature.properties._id === sectorId) {
                    this.selectSector(this.geoJsonLayer._layers[layerIndex]);
                    break;
                }
            }
        });
        EventBus.$on('mnk:select-random-sector-by-state-id', (stateId) => {
            var sectorsByStateId = [];
            for (var layerIndex in this.geoJsonLayer._layers) {
                if (this.geoJsonLayer._layers[layerIndex].feature.properties.state._id === stateId) {
                    sectorsByStateId.push(this.geoJsonLayer._layers[layerIndex]);
                }
            }
            if (sectorsByStateId.length > 0) {
                this.selectSector(sectorsByStateId[Math.floor(Math.random() * sectorsByStateId.length)]);
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
            this.map = L.map('map').on('click', this.clickMap).setView([ 39.686, 127.500 ], 7);

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
                            weight: 1,
                            opacity: 0.8
                        };
                    }
                }).on('click', this.clickSector).on('dblclick', function (event) {
                    // eslint-disable-next-line
                    L.DomEvent.stopPropagation(event);
                    return false;
                }).addTo(this.map);
                EventBus.$emit('mnk:stop-loading', 'loadingsectors');
            }).catch(() => {
                EventBus.$emit('mnk:message-error', 'Something went wrong');
                EventBus.$emit('mnk:stop-loading', 'loadingsectors');
            });
        },
        clickSector: function (event) {
            if (this.selectedSector && this.selectedSector.feature.properties._id === event.layer.feature.properties._id) {
                EventBus.$emit('mnk:deselect-sector');
                event.layer.setStyle({ color: this.selectedSector.feature.properties.state.color });
                this.selectedSector = null;
            } else {
                EventBus.$emit('mnk:select-sector', event.layer.toGeoJSON());
                event.layer.setStyle({ color: '#FFFF00' });

                if (this.selectedSector) {
                    this.selectedSector.setStyle({ color: this.selectedSector.feature.properties.state.color });
                }
                this.selectedSector = event.layer;
            }
            // eslint-disable-next-line
            L.DomEvent.stopPropagation(event);
        },
        clickMap: function () {
            if (this.selectedSector) {
                EventBus.$emit('mnk:deselect-sector');
                for (var layerIndex in this.geoJsonLayer._layers) {
                    if (this.geoJsonLayer._layers[layerIndex].feature.properties._id === this.selectedSector.feature.properties._id) {
                        this.geoJsonLayer._layers[layerIndex].setStyle({ color: this.selectedSector.feature.properties.state.color });
                        break;
                    }
                }
                this.selectedSector = null;
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
        },
        selectSector: function (sector) {
            EventBus.$emit('mnk:select-sector', sector.toGeoJSON());
            sector.setStyle({ color: '#FFFF00' });

            if (this.selectedSector) {
                this.selectedSector.setStyle({ color: this.selectedSector.feature.properties.state.color });
            }
            this.selectedSector = sector;

            this.flyToSectorByPolygonCoordinates(this.selectedSector.feature.geometry.coordinates[0]);
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
