<template>
    <div id="map">
        <CustomMapPointOfInterestControl />
    </div>
</template>

<script>
import CustomMapPointOfInterestControl from '@/components/MapPage/MapPointOfInterestControl';

export default {
    name: 'CustomMap',
    components: {
        CustomMapPointOfInterestControl
    }
};
</script>

<style>

</style>
