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
            poiLayer: null
        };
    },
    mounted () {
        this.loadPointOfInterests();
    },
    methods: {
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

</style>
