<template>
    <v-navigation-drawer
        app
        temporary
        clipped
        v-model="drawerLeft">
        <v-toolbar flat class="transparent">
            <v-list class="pa-0">
                <v-list-tile avatar v-if="$root.loggedInUser" :href="'https://www.openstreetmap.org/user/' + $root.loggedInUser.name" target="_blank">
                    <v-list-tile-content>
                        <v-list-tile-title id="logged-in-user-name">{{ $root.loggedInUser.name }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar v-else>
                    <v-list-tile-action>
                        <v-btn color="info" :href="loginLink" :disabled="loginLink.length === 0">Login</v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-toolbar>
        <v-list>
            <v-divider></v-divider>
            <v-list-tile :to="{ path: '/map' }">
                <v-list-tile-action>
                    <v-icon>dashboard</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Map</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <!--<v-list-tile :to="{ path: '/stats' }">
                <v-list-tile-action>
                    <v-icon>insert_chart</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Statistics</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>-->
            <v-list-tile :to="{ path: '/about' }">
                <v-list-tile-action>
                    <v-icon>info_outline</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>About</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-list v-if="currentIteration">
            <v-divider></v-divider>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Iteration: {{ currentIteration.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-content>
                    <v-progress-linear v-if="sectorTotalCount > 0" v-model="valueDeterminate"></v-progress-linear>
                </v-list-tile-content>
                <v-list-tile-action style="padding-left: 10px;">
                    <span>{{ sectorDoneCount }} / {{ sectorTotalCount }}</span>
                </v-list-tile-action>
            </v-list-tile>
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
                EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get the completed sector count.');
            }).finally(() => {
                EventBus.$emit('mnk:stop-loading', 'getCompletedSectorCountByIterationId');
            });
        }).catch(() => {
            EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get the current iteration.');
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
