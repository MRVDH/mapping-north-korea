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
                        <v-btn color="info" :href="loginLink" :disabled="loginLink.length === 0">{{ $t('button.login') }}</v-btn>
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
import EventBus from '@/services/EventBus';

export default {
    name: 'CustomMenuLeft',
    data () {
        return {
            drawerLeft: false,
            loginLink: '',
            currentIteration: null,
            sectorTotalCount: 0,
            sectorDoneCount: 0
        };
    },
    mounted () {
        EventBus.$on('mnk:set-locale', (localeCode) => {
            this.$i18n.locale = localeCode;
        });
        EventBus.$on('mnk:toggle-drawer-left', () => {
            this.drawerLeft = !this.drawerLeft;
        });
        EventBus.$on('mnk:oauth-request-token-received', (link) => {
            this.loginLink = link;
        });
        EventBus.$on('mnk:update-sector', (sector) => {
            if (sector.properties.state.title === 'Completed') {
                this.sectorDoneCount++;
            }
        });

        EventBus.$emit('mnk:start-loading', 'getCompletedSectorCountByIterationId');
        MapApiService.getLatestIteration().then((res) => {
            this.currentIteration = res.data;
            MapApiService.getCompletedSectorCountByIterationId(this.currentIteration._id).then((res) => {
                this.sectorTotalCount = res.data.totalCount;
                this.sectorDoneCount = res.data.doneCount;
            }).catch(() => {
                EventBus.$emit('mnk:message-error', this.$t('request.completed_sector_count'));
            }).finally(() => {
                EventBus.$emit('mnk:stop-loading', 'getCompletedSectorCountByIterationId');
            });
        }).catch(() => {
            EventBus.$emit('mnk:message-error', this.$t('request.current_iteration'));
            EventBus.$emit('mnk:stop-loading', 'getCompletedSectorCountByIterationId');
        });
    },
    computed: {
        valueDeterminate: function () {
            var percentageDone = (this.sectorDoneCount * 100) / this.sectorTotalCount;
            return percentageDone < 1 ? 1 : percentageDone;
        }
    }
};
</script>

<style scoped>

</style>