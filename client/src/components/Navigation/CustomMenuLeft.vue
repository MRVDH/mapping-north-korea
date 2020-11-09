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
        width="300">
        <v-toolbar
            flat
            class="transparent">
            <v-list class="pa-0">
                <v-list-item class="pa-0" v-if="loggedInUser" :href="'https://www.openstreetmap.org/user/' + loggedInUser.name" target="_blank">
                    <v-list-item-content>
                        <v-list-item-title id="logged-in-user-name">{{ loggedInUser.name }}</v-list-item-title>
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
import { SET_DRAWER_LEFT } from "@/store/mutationTypes";

export default {
    name: 'CustomMenuLeft',
    data () {
        return {
            sectorTotalCount: 0,
            sectorDoneCount: 0
        };
    },
    computed: {
        updatedSector () {
            return this.$store.state.selectedSector;
        },
        drawerLeft: {
            set (newValue) {
                this.$store.commit(SET_DRAWER_LEFT, newValue);
            },
            get () {
                return this.$store.state.drawerLeft;
            }
        },
        loginLink () {
            return this.$store.state.loginLink;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        },
        currentIteration () {
            return this.$store.state.currentIteration;
        },
        valueDeterminate () {
            var percentageDone = (this.sectorDoneCount * 100) / this.sectorTotalCount;
            return percentageDone < 1 ? 1 : percentageDone;
        }
    },
    watch: {
        updatedSector (sector) {
            if (sector && sector.properties.state.title === 'Completed') {
                this.sectorDoneCount++;
            }
        },
        currentIteration (newIteration) {
            if (!newIteration) {
                return;
            }

            MapApiService.getCompletedSectorCountByIterationId(newIteration._id).then((res) => {
                this.sectorTotalCount = res.data.totalCount;
                this.sectorDoneCount = res.data.doneCount;
            });
        }
    }
};
</script>