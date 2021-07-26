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
import router from '@/router';
import MapService from '@/services/MapService';
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SET_POINT_OF_INTERESTS, SET_SECTOR_SETS } from "@/store/mutationTypes";

import CustomMapPointOfInterestControl from '@/components/MapPage/MapPointOfInterestControl';

export default {
    name: 'CustomMap',
    components: {
        CustomMapPointOfInterestControl
    },
    computed: {
        currentIteration () {
            return this.$store.state.currentIteration;
        },
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        },
        selectedSector () {
            return this.$store.state.selectedSector;
        },
        selectedPoi () {
            return this.$store.state.selectedPoi;
        },
        pointOfInterests () {
            return this.$store.state.pointOfInterests;
        }
    },
    watch: {
        async currentIteration (newIteration) {
            if (!newIteration) {
                return;
            }

            await this.loadSectorSets(this.currentIteration._id.toString());
        },
        selectedSectorSet (selectedSectorSet) {
            if (!selectedSectorSet) {
                MapService.goToSectorSets();
            }
        },
        selectedPoi (selectedPoi) {
            if (!selectedPoi) {
                MapService.deselectPoi();
            }
        },
        selectedSector (selectedSector) {
            if (!selectedSector) {
                return;
            }

            MapService.sectorUpdate(selectedSector);
        },
        pointOfInterests (changedPointOfInterests) {
            if (!changedPointOfInterests || !changedPointOfInterests.length) {
                return;
            }

            MapService.updatePois(changedPointOfInterests);
        }
    },
    async created () {
        MapService.setMapComponent(this);
        await this.loadPointOfInterests();
    },
    mounted () {
        this.createMap();

        EventBus.$on('mnk:go-to-sector', (data) => {
            router.push({ name: 'MapPage', params: { sectorSetId: data.sectorSetId, sectorId: data.sectorId } });
            MapService.selectSectorSet(data.sectorSetId);
        });
        EventBus.$on('mnk:go-to-sector-set', (data) => {
            router.push({ name: 'MapPage', params: { sectorSetId: data } });
            MapService.selectSectorSet(data);
        });
        EventBus.$on('mnk:go-to-poi', (data) => {
            MapService.selectAndFlyToPoi(data);
        });
    },
    beforeDestroy () {
        MapService.remove();
    },
    methods: {
        createMap () {
            MapService.newMap(this.$store.state.darkMode).on('load', () => {
                MapService.displayPointOfInterests();
                MapService.displaySectorSets();
            });
        },
        async loadPointOfInterests () {
            return new Promise((resolve) => {
                this.$store.dispatch(START_LOADING, 'loadPointOfInterests');
                MapApiService.getAllPointOfInterests().then((res) => {
                    this.$store.dispatch(SET_POINT_OF_INTERESTS, res.data);
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.load_point_of_interests'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'loadPointOfInterests');
                    resolve();
                });
            });
        },
        async loadSectorSets (iterationId) {
            return new Promise((resolve) => {
                this.$store.dispatch(START_LOADING, 'loadingsectors');
                MapApiService.getAllSectorSetsByIterationId(iterationId).then((res) => {
                    this.$store.dispatch(SET_SECTOR_SETS, res.data);
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.load_sector_sets'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'loadingsectors');
                    resolve();
                });
            });
        }
    }
};
</script>

<style scoped>
#map {
    height: 100%;
    width: 100%;
    z-index: 1;
}
</style>
