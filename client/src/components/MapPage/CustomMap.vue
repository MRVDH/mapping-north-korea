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
    mounted () {
        MapService.newMap();
    }
};
</script>

<style>
#map {
    height: 100%;
    width: 100%;
    z-index: 1;
}
</style>
