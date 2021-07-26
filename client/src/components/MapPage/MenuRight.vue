<template>
    <v-navigation-drawer
        v-model="drawerRight"
        right
        clipped
        mobile-breakpoint="0"
        app
        width="300"
        >
        <div v-if="!selectedSectorSet && !selectedSector && !selectedPoi">
            <CustomMenuRightRegions />
            <v-divider />
            <CustomMenuRightRecentEvents />
            <v-divider />
            <CustomMenuRightPointOfInterests />
        </div>
        <CustomMenuRightButtonBack v-if="selectedSectorSet || selectedPoi" />
        <CustomMenuRightRegion v-if="selectedSectorSet && !selectedSector && !selectedPoi" />
        <CustomMenuRightSector v-if="selectedSector && !selectedPoi" />
        <MenuRightPointOfInterest v-if="selectedPoi" />
    </v-navigation-drawer>
</template>

<script>
import CustomMenuRightRegions from './MenuRightRegions';
import CustomMenuRightSector from './MenuRightSector';
import CustomMenuRightRecentEvents from './MenuRightRecentEvents';
import CustomMenuRightButtonBack from './MenuRightButtonBack';
import CustomMenuRightRegion from './MenuRightRegion';
import CustomMenuRightPointOfInterests from './MenuRightPointOfInterests';
import MenuRightPointOfInterest from './MenuRightPointOfInterest';

import { SET_DRAWER_RIGHT } from "@/store/mutationTypes";

export default {
    name: 'MenuRight',
    components: {
        CustomMenuRightRegions,
        CustomMenuRightSector,
        CustomMenuRightRecentEvents,
        CustomMenuRightButtonBack,
        CustomMenuRightRegion,
        CustomMenuRightPointOfInterests,
        MenuRightPointOfInterest
    },
    computed: {
        drawerRight: {
            set (newValue) {
                this.$store.commit(SET_DRAWER_RIGHT, newValue);
            },
            get () {
                return this.$store.state.drawerRight;
            }
        },
        selectedSector () {
            return this.$store.state.selectedSector;
        },
        selectedPoi () {
            return this.$store.state.selectedPoi;
        },
        recentEvents () {
            return this.$store.state.recentEvents;
        },
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        }
    },
    mounted () {
        this.$store.dispatch(SET_DRAWER_RIGHT, !this.$vuetify.breakpoint.xs);
    }
};
</script>

<style scoped>

</style>
