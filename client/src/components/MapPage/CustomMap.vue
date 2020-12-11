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
    <div id="map" />
</template>

<script>
import MapService from '@/services/MapService';

export default {
    name: 'CustomMap',
    computed: {
        darkMode () {
            return this.$store.state.darkMode;
        },
        currentIteration () {
            return this.$store.state.currentIteration;
        },
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        },
        selectedSector () {
            return this.$store.state.selectedSector;
        }
    },
    watch: {
        darkMode () {
            MapService.setDarkMode(this.$store.state.darkMode);
        },
        currentIteration (newIteration) {
            if (!newIteration) {
                return;
            }

            MapService.loadSectorSets(this.currentIteration._id.toString());
        },
        selectedSectorSet (selectedSectorSet) {
            if (!selectedSectorSet) {
                MapService.goToSectorSets();
            }
        }
    },
    mounted () {
        MapService.setMapComponent(this);
        MapService.newMap(this.$store.state.darkMode);

        if (this.currentIteration) {
            MapService.loadSectorSets(this.currentIteration._id.toString());
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
