<template>
    <v-navigation-drawer
        v-model="drawerRight"
        right
        clipped
        mobile-breakpoint="0"
        app
        width="300">
        <v-list
            v-if="!selectedSectorSet"
            class="pt-0 pb-0">
            <CustomMenuRightRegions/>
            <v-divider v-if="recentEvents.length > 0"></v-divider>
            <CustomMenuRightRecentEvents/>
        </v-list>
        <CustomMenuRightButtonBack v-if="selectedSectorSet"/>
        <CustomMenuRightRegion v-if="selectedSectorSet && !selectedSector"/>
        <CustomMenuRightSector v-if="selectedSector"/>
    </v-navigation-drawer>
</template>

<script>
import CustomMenuRightRegions from './MenuRightRegions';
import CustomMenuRightSector from './MenuRightSector';
import CustomMenuRightRecentEvents from './MenuRightRecentEvents';
import CustomMenuRightButtonBack from './MenuRightButtonBack';
import CustomMenuRightRegion from './MenuRightRegion';

import { SET_DRAWER_RIGHT } from "@/store/mutationTypes";

export default {
    name: 'MenuRight',
    data () {
        return { };
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
        recentEvents () {
            return this.$store.state.recentEvents;
        },
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        }
    },
    mounted () {
        this.$store.dispatch(SET_DRAWER_RIGHT, !this.$vuetify.breakpoint.xs);
    },
    components: {
        CustomMenuRightRegions,
        CustomMenuRightSector,
        CustomMenuRightRecentEvents,
        CustomMenuRightButtonBack,
        CustomMenuRightRegion
    }
};
</script>

<style scoped>

</style>
