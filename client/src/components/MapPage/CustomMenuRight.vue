<template>
    <v-navigation-drawer
        fixed
        v-model="drawerRight"
        right
        clipped
        mobile-break-point="0"
        app>
        <v-list v-if="!selectedSector">
            <v-container
                text-xs-center
                grid-list-xs
                style="padding: 16px;">
                <v-layout>
                    <v-flex>
                        Select a sector on the map to start mapping or select a random sector by state.
                    </v-flex>
                </v-layout>
            </v-container>
            <v-list-tile v-for="(state, index) in states" :key="index">
                <v-list-tile-content>
                    <v-list-tile-title><span :style="{ color: state.color }">■</span> {{ state.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon @click.stop="selectRandomSector(state._id)">
                        <v-icon>forward</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="allEvents.length > 0"></v-divider>
            <v-container
                grid-list-xs
                style="padding: 16px 16px 0 16px;">
                <v-layout>
                    <v-flex>
                        <span class="font-weight-bold">Recent events</span>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container grid-list-md text-xs-center style="padding: 16px;">
                <v-layout row v-for="(event, index) in allEvents" :key="index">
                    <v-flex xs12>
                        <div class="text-xs-left" @click.stop="selectSectorById(event.sector)" style="cursor: pointer;">{{ event.description }}</div>
                        <div class="text-xs-right grey--text text--lighten-1 caption">{{ event.osmUserName }}
                            <a
                                :href="'https://www.openstreetmap.org/user/' + event.osmUserName"
                                target="_blank"
                                style="text-decoration: none;">
                                <v-icon small style="font-size: 10px; vertical-align: initial;">launch</v-icon>
                            </a> - <span :title="new Date(event.time)">{{ calculateDateOutput(new Date(event.time)) }}</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-list>
        <v-list v-else>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Sector id</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-list-tile-title class="text-xs-right">{{ selectedSector.properties._id }}</v-list-tile-title>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>State</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-list-tile-title class="text-xs-right">{{ selectedSector.properties.state.title }}</v-list-tile-title>
                    <v-menu offset-y v-model="stateEditOpen">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                outline
                                v-on="on"
                                class="no-margin-button"
                                :disabled="!$root.loggedInUser"
                                >{{ selectedSector.properties.state.title }}</v-btn>
                        </template>
                        <v-list>
                            <v-list-tile
                                v-for="(state, index) in states"
                                :key="index"
                                @click.stop="updateSector(state, null)"
                                >
                                <v-list-tile-title>
                                    <span :style="{ color: state.color, 'vertical-align': 'text-bottom' }">■</span> {{ state.title }}
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-list-tile-action>
            </v-list-tile>
            <div>
                <v-container
                    text-xs-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="!$root.loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">Please log in to map or edit this sector.</span>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container
                    text-xs-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="selectedSector.properties.state.title === 'Open' && $root.loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">Please change the state to "Being edited" to map this sector.</span>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container
                    text-xs-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="selectedSector.properties.state.title === 'Review needed' && $root.loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">Please change the state to "Being reviewed" to review or back to "Being edited" to edit this sector.</span>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container
                    text-xs-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="selectedSector.properties.state.title === 'Completed' && $root.loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">Please change the state back to "Being edited" or "Being reviewed" to edit or review this sector.</span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </div>
            <v-container grid-list-xs style="padding: 16px;">
                <v-layout>
                    <v-flex>
                        <v-menu offset-y v-model="mappingMenuOpen">
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    color="success"
                                    v-on="on"
                                    class="no-margin-button"
                                    :disabled="!$root.loggedInUser || selectedSector.properties.state.title === 'Open' || selectedSector.properties.state.title === 'Review needed' || selectedSector.properties.state.title === 'Completed'"
                                    >Map</v-btn>
                            </template>
                            <v-list>
                                <v-list-tile :href="idUrl" target="_blank">
                                    <v-list-tile-title>iD</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile :href="rapidUrl" target="_blank">
                                    <v-list-tile-title>RapiD</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click.stop="mapSectorInJOSM(); mappingMenuOpen = false;">
                                        <v-list-tile-title>JOSM</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                        <v-btn
                            class="no-margin-button"
                            color="success"
                            target="_blank"
                            :href="'https://www.openstreetmap.org/#map=13/' +
                                (this.selectedSector.geometry.coordinates[0][1][1] +
                                this.selectedSector.geometry.coordinates[0][2][1]) / 2 + '/' +
                                (this.selectedSector.geometry.coordinates[0][0][0] +
                                this.selectedSector.geometry.coordinates[0][1][0]) / 2"
                            >View</v-btn>
                        <v-btn
                            v-if="adminLoggedIn"
                            class="no-margin-button"
                            color="warning"
                            @click.stop="splitSector()"
                            :disabled="!$root.loggedInUser"
                            >Split</v-btn>
                        <v-btn
                            v-if="adminLoggedIn"
                            class="no-margin-button"
                            color="error"
                            @click.stop="deleteSector()"
                            :disabled="!$root.loggedInUser"
                            >Delete</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-container
                text-xs-center
                grid-list-xs
                style="padding: 0 16px;"
                v-if="$root.loggedInUser">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-textarea
                            v-model="newComment"
                            append-outer-icon="send"
                            @click:append-outer="postComment();"
                            :counter="500"
                            :rules="[v => v.length <= 500 || 'Comment must be less than 500 characters']"
                            label="Comment"
                        ></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container grid-list-md text-xs-center style="padding: 16px;">
                <v-layout row v-for="(event, index) in events" :key="index">
                    <v-flex xs12>
                        <div class="text-xs-left">{{ event.description }}</div>
                        <div class="text-xs-right grey--text text--lighten-1 caption">{{ event.osmUserName }}
                            <a
                                :href="'https://www.openstreetmap.org/user/' + event.osmUserName"
                                target="_blank"
                                style="text-decoration: none;">
                                <v-icon small style="font-size: 10px; vertical-align: initial;">launch</v-icon>
                            </a> - <span :title="new Date(event.time)">{{ calculateDateOutput(new Date(event.time)) }}</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import JOSMService from '@/services/JOSMService';
import EventBus from '@/services/EventBus';

export default {
    name: 'CustomMenuRight',
    data () {
        return {
            drawerRight: !this.$vuetify.breakpoint.xs,
            selectedSector: null,
            idUrl: '',
            rapidUrl: '',
            valid: true,
            newComment: '',
            newState: null,
            states: null,
            events: [],
            allEvents: [],
            mappingMenuOpen: false,
            stateEditOpen: false
        };
    },
    mounted () {
        EventBus.$on('mnk:toggle-drawer-right', () => {
            this.drawerRight = !this.drawerRight;
        });
        EventBus.$on('mnk:select-sector', this.selectSector);
        EventBus.$on('mnk:deselect-sector', () => {
            this.selectedSector = null;
        });

        EventBus.$emit('mnk:start-loading', 'getAllStates');
        MapApiService.getAllStates().then((res) => {
            this.states = res.data;
        }).catch(() => {
            EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get all possible sector states.');
        }).finally(() => {
            EventBus.$emit('mnk:stop-loading', 'getAllStates');
        });
        EventBus.$emit('mnk:start-loading', 'getAllEvents');
        MapApiService.getAllEvents(25).then((res) => {
            this.allEvents = res.data;
        }).catch(() => {
            EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get recent events.');
        }).finally(() => {
            EventBus.$emit('mnk:stop-loading', 'getAllEvents');
        });
    },
    methods: {
        selectSectorById: (id) => {
            EventBus.$emit('mnk:go-to-sector', id);
        },
        selectSector: function (selectedSect) {
            this.selectedSector = selectedSect;
            this.newState = this.selectedSector.properties.state._id;

            var coords = this.selectedSector.geometry.coordinates[0];
            this.idUrl = 'https://www.openstreetmap.org/edit?editor=id' +
                '&#map=13/' + (coords[1][1] + coords[2][1]) / 2 + '/' + (coords[0][0] + coords[1][0]) / 2 +
                '&comment=MappingNorthKorea.com%20sector%20' + this.selectedSector.properties._id +
                '&gpx=https://mappingnorthkorea.com/api/sector/generate/' + this.selectedSector.properties._id + '.gpx';
            this.rapidUrl = 'https://www.mapwith.ai/rapid?#' +
                'gpx=https://mappingnorthkorea.com/api/sector/generate/' + this.selectedSector.properties._id + '.gpx' +
                '&map=13/' + (coords[1][1] + coords[2][1]) / 2 + '/' + (coords[0][0] + coords[1][0]) / 2 +
                '&comment=MappingNorthKorea.com%20sector%20' + this.selectedSector.properties._id;

            EventBus.$emit('mnk:start-loading', 'getEventsBySectorId');
            MapApiService.getEventsBySectorId(this.selectedSector.properties._id).then((res) => {
                if (!res.data.length) return;
                this.events = res.data.sort(function (a, b) { return new Date(b.time.date) - new Date(a.time.date); }).reverse();
            }).catch(() => {
                EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get the events of a sector.');
            }).finally(() => {
                EventBus.$emit('mnk:stop-loading', 'getEventsBySectorId');
            });
        },
        selectRandomSector: (id) => {
            EventBus.$emit('mnk:select-random-sector-by-state-id', id);
        },
        postComment: function () {
            if (this.newComment === '' || this.newComment === null || this.newComment === undefined) return;
            this.updateSector(this.selectedSector.properties.state, this.newComment);
        },
        updateSector: function (state, comment) {
            var apiSector = this.geoJsonSectorToApiSector(this.selectedSector);
            this.stateEditOpen = false;

            EventBus.$emit('mnk:start-loading', 'updateSector');
            MapApiService.updateSector({
                sector: apiSector,
                comment: comment || '',
                state: state
            }).then((res) => {
                for (var event of res.data.events) {
                    this.events.unshift(event);
                    this.allEvents.unshift(event);
                }

                this.selectedSector = this.sectorToGeoJson(res.data.sector);
                this.newComment = '';
                this.newState = this.selectedSector.properties.state._id;

                EventBus.$emit('mnk:message-success', 'Sector updated');
                EventBus.$emit('mnk:update-sector', this.selectedSector);
            }).catch(() => {
                EventBus.$emit('mnk:message-error', 'Something went wrong while trying to update the sector.');
            }).finally(() => {
                EventBus.$emit('mnk:stop-loading', 'updateSector');
            });
        },
        mapSectorInJOSM () {
            var loadAndZoomParams = {
                left: this.selectedSector.geometry.coordinates[0][0][0],
                bottom: this.selectedSector.geometry.coordinates[0][2][1],
                right: this.selectedSector.geometry.coordinates[0][1][0],
                top: this.selectedSector.geometry.coordinates[0][0][1],
                changeset_comment: encodeURIComponent('MappingNorthKorea.com sector ' + this.selectedSector.properties._id)
            };

            EventBus.$emit('mnk:start-loading', 'sendJOSMCommand');
            JOSMService.sendJOSMCommand('https://127.0.0.1:8112/load_and_zoom', loadAndZoomParams).catch(() => {
                EventBus.$emit('mnk:message-error', 'Failed to load data into JOSM. Is JOSM running and is Remote Contol (by HTTPS) enabled?');
                EventBus.$emit('mnk:stop-loading', 'sendJOSMCommand');
            });
            JOSMService.sendJOSMCommand('https://127.0.0.1:8112/imagery', {
                type: 'bing',
                url: 'https://www.bing.com/maps/'
            });
        },
        cancelDialog: function () {
            this.updateSectorDialog = false;
            this.newComment = '';
            this.newState = this.selectedSector.properties.state._id;
        },
        geoJsonSectorToApiSector: (sect) => {
            return {
                _id: sect.properties._id,
                sectorSet: sect.properties.sectorSet,
                state: sect.properties.state,
                coordinates: sect.geometry.coordinates
            };
        },
        calculateDateOutput: (time) => {
            const today = new Date();
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (time.getDate() === today.getDate() &&
                time.getMonth() === today.getMonth() &&
                time.getFullYear() === today.getFullYear()) {
                return 'today';
            } else if (time.getDate() === yesterday.getDate() &&
                time.getMonth() === yesterday.getMonth() &&
                time.getFullYear() === yesterday.getFullYear()) {
                return 'yesterday';
            } else {
                return time.toLocaleString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
            }
        },
        sectorToGeoJson: function (sector) {
            return {
                type: 'Feature',
                properties: {
                    _id: sector._id,
                    state: sector.state,
                    sectorSet: sector.sectorSet
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: sector.coordinates
                }
            };
        },
        deleteSector: function () {
            if (confirm('Are you sure you want to delete this sector?')) {
                EventBus.$emit('mnk:start-loading', 'deleteSectorById');
                MapApiService.deleteSectorById(this.selectedSector.properties._id).then(function (res) {
                    location.reload();
                }).catch(() => {
                    EventBus.$emit('mnk:message-error', 'Something went wrong while trying to delete the sector.');
                }).finally(() => {
                    EventBus.$emit('mnk:stop-loading', 'deleteSectorById');
                });
            }
        },
        splitSector: function () {
            if (confirm('Are you sure you want to split this sector?')) {
                EventBus.$emit('mnk:start-loading', 'splitSectorById');
                MapApiService.splitSectorById(this.selectedSector.properties._id).then(function (res) {
                    location.reload();
                }).catch(() => {
                    EventBus.$emit('mnk:message-error', 'Something went wrong while trying to split the sector.');
                }).finally(() => {
                    EventBus.$emit('mnk:stop-loading', 'splitSectorById');
                });
            }
        }
    },
    computed: {
        adminLoggedIn: function () {
            if (this.$root.loggedInUser && document.getElementById('logged-in-user-name')) {
                return document.getElementById('logged-in-user-name').innerText === 'Artemis64' || document.getElementById('logged-in-user-name').innerText === 'Artemis64dev';
            } else {
                return false;
            }
        }
    }
};
</script>

<style scope>
.no-margin-button {
    margin: 0 !important;
    margin-bottom: 4px !important;
}
.v-btn--depressed .v-btn__content {
    padding: 0 10px;
}
.v-menu {
    display: inline-block !important;
}
</style>
