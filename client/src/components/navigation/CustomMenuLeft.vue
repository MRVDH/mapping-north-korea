<i18n>
{
    "en": {
        "button": {
            "login": "Login"
        },
        "menu": {
            "map": "Map",
            "about": "About"
        },
        "request": {
            "completed_sector_count": "Something went wrong while trying to get the completed sector count.",
            "current_iteration": "Something went wrong while trying to get the current iteration."
        },
        "iteration": "Iteration: {iterationTitle}"
    },
    "ko": {
        "button": {
            "login": "로그인"
        },
        "menu": {
            "map": "지도",
            "about": "정보"
        },
        "request": {
            "completed_sector_count": null,
            "current_iteration": null
        },
        "iteration": "반복: {iterationTitle}"
    }
}
</i18n>

<template>
    <v-navigation-drawer
        app
        temporary
        clipped
        v-model="drawerLeft"
        class="drawer">
        <v-toolbar
            flat
            class="transparent">
            <v-list class="pa-0">
                <v-list-item class="pa-0" v-if="$root.loggedInUser" :href="'https://www.openstreetmap.org/user/' + $root.loggedInUser.name" target="_blank">
                    <v-list-item-content>
                        <v-list-item-title id="logged-in-user-name">{{ $root.loggedInUser.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item class="pa-0" v-else>
                    <v-list-item-action>
                        <v-btn color="info" :href="loginLink" :disabled="!loginLink">{{ $t('button.login') }}</v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-toolbar>
        <v-list>
            <v-divider></v-divider>
            <v-list-item :to="{ path: '/map' }">
                <v-list-item-action>
                    <v-icon>dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('menu.map') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <!--<v-list-item :to="{ path: '/stats' }">
                <v-list-item-action>
                    <v-icon>insert_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Statistics</v-list-item-title>
                </v-list-item-content>
            </v-list-item>-->
            <v-list-item :to="{ path: '/about' }">
                <v-list-item-action>
                    <v-icon>info_outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('menu.about') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list v-if="currentIteration">
            <v-divider></v-divider>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('iteration', { iterationTitle: currentIteration.title }) }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-progress-linear v-if="sectorTotalCount > 0" v-model="valueDeterminate"></v-progress-linear>
                </v-list-item-content>
                <v-list-item-action style="padding-left: 10px;">
                    <span>{{ sectorDoneCount }} / {{ sectorTotalCount }}</span>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING } from "@/store/mutationTypes";

export default {
    name: 'CustomMenuLeft',
    data () {
        return {
            currentIteration: null,
            sectorTotalCount: 0,
            sectorDoneCount: 0
        };
    },
    mounted () {
        EventBus.$on('mnk:update-sector', (sector) => {
            if (sector.properties.state.title === 'Completed') {
                this.sectorDoneCount++;
            }
        });

        this.$store.dispatch(START_LOADING, 'getCompletedSectorCountByIterationId');
        MapApiService.getLatestIteration().then((res) => {
            this.currentIteration = res.data;
            MapApiService.getCompletedSectorCountByIterationId(this.currentIteration._id).then((res) => {
                this.sectorTotalCount = res.data.totalCount;
                this.sectorDoneCount = res.data.doneCount;
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.completed_sector_count'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'getCompletedSectorCountByIterationId');
            });
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.current_iteration'));
            this.$store.dispatch(STOP_LOADING, 'getCompletedSectorCountByIterationId');
        });
    },
    computed: {
        valueDeterminate () {
            var percentageDone = (this.sectorDoneCount * 100) / this.sectorTotalCount;
            return percentageDone < 1 ? 1 : percentageDone;
        },
        drawerLeft () {
            return this.$store.state.drawerLeft;
        },
        loginLink () {
            return this.$store.state.loginLink;
        }
    }
};
</script>