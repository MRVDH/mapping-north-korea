<i18n>
{
    "en": {
        "request": {
            "load_sectors": "Something went wrong while trying to load the sectors.",
            "load_point_of_interests": "Something went wrong while trying to load the points of interest.",
            "load_sector_sets": "Something went wrong while trying to load the regions."
        }
    },
    "ko": {
        "request": {
            "load_sectors": null,
            "load_point_of_interests": null,
            "load_sector_sets": null
        }
    }
}
</i18n>

<template>
    <div id="map">
        <CustomMapPointOfInterestControl />
    </div>
</template>

<script>
import CustomMapPointOfInterestControl from '@/components/MapPage/MapPointOfInterestControl';
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import * as L from 'leaflet';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SELECT_SECTOR, SET_SECTOR_SETS, SELECT_SECTOR_SET, SET_POINT_OF_INTERESTS } from "@/store/mutationTypes";

const defaultStyle = {
    weight: 1,
    opacity: 0.6
};

export default {
    name: 'CustomMap',
    components: {
        CustomMapPointOfInterestControl
    },
    data () {
        return {
            map: null,
            sectorLayer: null,
            sectors: null,
            selectedSector: null,
            sectorSetLayer: null,
            poiLayer: null
        };
    },
    computed: {
        updatedSector () {
            return this.$store.state.selectedSector;
        },
        sectorSets () {
            return this.$store.state.sectorSets;
        },
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        }
    },
    watch: {
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
        selectedSectorSet (newValue) {
            if (newValue) {
                return;
            }

            this.$router.push({ name: 'MapPage' });
            this.map.removeLayer(this.sectorLayer);
            this.map.addLayer(this.sectorSetLayer);
            this.poiLayer.bringToFront();
        }
    },
    mounted () {
        this.initMap();

        EventBus.$on('mnk:go-to-sector', (sectorInfo) => {
            this.$router.push({ name: 'MapPageSector', params: { sectorSetId: sectorInfo.sectorSetId, sectorId: sectorInfo.sectorId } });
            this.selectSectorSet(this.getSectorSetLayerById(sectorInfo.sectorSetId));
        });

        EventBus.$on('mnk:go-to-sector-set', (sectorSetId) => {
            this.selectSectorSet(this.getSectorSetLayerById(sectorSetId));
        });

        this.loadPointOfInterests();
    },
    methods: {
        initMap () {
            this.map = L.map('map').on('click', this.clickMapEvent).setView([ 39.686, 127.500 ], 7);
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
                        coordinates: [ poi.latitude, poi.longitude ]
                    }
                });
            }

            return geoJson;
        },
        flyToSectorByPolygonCoordinates (coordinates) {
            this.map.flyTo([(coordinates[2][1] + coordinates[0][1]) / 2, (coordinates[1][0] + coordinates[0][0]) / 2], 13);
        },
        loadPointOfInterests () {
            this.$store.dispatch(START_LOADING, 'loadPointOfInterests');
            MapApiService.getAllPointOfInterests().then((res) => {
                let geoJsonPois = this.pointOfInterestsToGeoJson(res.data);
                this.$store.dispatch(SET_POINT_OF_INTERESTS, res.data);

                this.poiLayer = L.geoJSON(geoJsonPois, {
                    pointToLayer (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 6,
                            fillColor: "#728BD4",
                            color: "white",
                            weight: 1,
                            fillOpacity: 1
                        });
                    }
                }).on('click', this.clickPoiEvent).on('dblclick', function (event) {
                    L.DomEvent.stopPropagation(event);
                    return false;
                }).addTo(this.map);
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.load_point_of_interests'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'loadPointOfInterests');
            });
        },
        clickPoiEvent () {

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

.leaflet-bar a, .leaflet-bar a:hover {
    color: black !important;
}
</style>
