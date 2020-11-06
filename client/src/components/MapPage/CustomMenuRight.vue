<i18n>
{
    "en": {
        "help": {
            "select_sector": "Select a sector on the map to start mapping or select a random sector by state.",
            "login": "Please log in to map or edit this sector.",
            "change_back": "Please change the state to 'Being edited' to edit or review this sector."
        },

        "recent_events": "Recent events",

        "sector": {
            "id": "Sector id",
            "state": "State",
            "button": {
                "map": "Map",
                "view": "View",
                "split": "Split",
                "delete": "Delete"
            }
        },

        "comment_less_than": "Comment must be less than 500 characters.",
        "comment": "Comment",

        "request": {
            "get_sector_states": "Something went wrong while trying to get all possible sector states.",
            "recent_events": "Something went wrong while trying to get recent events.",
            "sector_events": "Something went wrong while trying to get the events of a sector.",
            "sector_updated": "Sector updated.",
            "sector_update": "Something went wrong while trying to update the sector.",
            "josm_failed": "Failed to load data into JOSM. See the FAQ for more information.",
            "confirm_deletion": "Are you sure you want to delete this sector?",
            "deletion": "Something went wrong while trying to delete the sector.",
            "confirm_split": "Are you sure you want to split this sector?",
            "split": "Something went wrong while trying to split the sector."
        }
    },
    "ko": {
        "help": {
            "select_sector": "지도를 만들 부분을 선택하세요. 상태 옆의 화살표를 누르면 임의의 작업이 선택됩니다.",
            "login": "이 부분의 지도를 제작하거나 편집하려면 로그인하세요.",
            "change_back": null
        },

        "recent_events": "최근 내역",

        "sector": {
            "id": "이 부분의 id",
            "state": "상태",
            "button": {
                "map": "매핑",
                "view": null,
                "split": null,
                "delete": null
            }
        },

        "comment_less_than": null,
        "comment": null,

        "request": {
            "get_sector_states": null,
            "recent_events": null,
            "sector_events": null,
            "sector_updated": null,
            "sector_update": null,
            "josm_failed": null,
            "confirm_deletion": null,
            "deletion": null,
            "confirm_split": null,
            "split": null
        }
    }
}
</i18n>

<template>
    <v-navigation-drawer
        v-model="drawerRight"
        right
        clipped
        mobile-breakpoint="0"
        app
        class="drawer">
        <v-list v-if="!selectedSector">
            <v-container
                text-center
                grid-list-xs
                style="padding: 16px;">
                <v-layout>
                    <v-flex>{{ $t('help.select_sector') }}</v-flex>
                </v-layout>
            </v-container>
            <v-list-item v-for="(state, index) in states" :key="index">
                <v-list-item-content class="pa-0">
                    <v-list-item-title><span :style="{ color: state.color }">■</span> {{ state.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="ma-0">
                    <v-btn icon @click.stop="selectRandomSector(state._id)">
                        <v-icon>forward</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-divider v-if="allEvents.length > 0"></v-divider>
            <v-container
                grid-list-xs
                style="padding: 16px 16px 0 16px;">
                <v-layout>
                    <v-flex>
                        <span class="font-weight-bold">{{ $t('recent_events') }}</span>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container grid-list-md text-center style="padding: 16px;">
                <v-layout class="row" v-for="(event, index) in allEvents" :key="index">
                    <v-flex xs12>
                        <div class="text-left" @click.stop="selectSectorById(event.sector)" style="cursor: pointer;">{{ event.description }}</div>
                        <div class="text-right grey--text text--lighten-1 caption">{{ event.osmUserName }}
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
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('sector.id') }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-list-item-title class="text-right">{{ selectedSector.properties._id }}</v-list-item-title>
                </v-list-item-action>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('sector.state') }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-menu offset-y v-model="stateEditOpen">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                outlined
                                v-on="on"
                                class="no-margin-button"
                                :disabled="!loggedInUser"
                                >{{ selectedSector.properties.state.title }}</v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(state, index) in states"
                                :key="index"
                                @click.stop="updateSector(state, null)"
                                >
                                <v-list-item-title>
                                    <span :style="{ color: state.color, 'vertical-align': 'text-bottom' }">■</span> {{ state.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item-action>
            </v-list-item>
            <div>
                <v-container
                    text-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="!loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">{{ $t('help.login') }}</span>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container
                    text-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="selectedSector.properties.state.title === 'Open' && loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">{{ $t('help.change_back') }}</span>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container
                    text-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="selectedSector.properties.state.title === 'Review needed' && loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">{{ $t('help.change_back') }}</span>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container
                    text-center
                    grid-list-xs
                    style="padding: 0 16px;"
                    v-if="selectedSector.properties.state.title === 'Completed' && loggedInUser">
                    <v-layout>
                        <v-flex>
                            <span class="orange--text">{{ $t('help.change_back') }}</span>
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
                                    :disabled="!loggedInUser || selectedSector.properties.state.title === 'Open' || selectedSector.properties.state.title === 'Review needed' || selectedSector.properties.state.title === 'Completed'"
                                    >{{ $t('sector.button.map') }}</v-btn>
                            </template>
                            <v-list>
                                <v-list-item :href="idUrl" target="_blank">
                                    <v-list-item-title>iD</v-list-item-title>
                                </v-list-item>
                                <v-list-item :href="rapidUrl" target="_blank">
                                    <v-list-item-title>RapiD</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click.stop="mapSectorInJOSM(); mappingMenuOpen = false;">
                                        <v-list-item-title>JOSM</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-btn
                            class="left-margin-button"
                            color="success"
                            target="_blank"
                            :href="'https://www.openstreetmap.org/#map=13/' +
                                (this.selectedSector.geometry.coordinates[0][1][1] +
                                this.selectedSector.geometry.coordinates[0][2][1]) / 2 + '/' +
                                (this.selectedSector.geometry.coordinates[0][0][0] +
                                this.selectedSector.geometry.coordinates[0][1][0]) / 2"
                            >{{ $t('sector.button.view') }}</v-btn>
                        <v-btn
                            v-if="adminLoggedIn"
                            class="left-margin-button"
                            color="warning"
                            @click.stop="splitSector()"
                            :disabled="!loggedInUser"
                            >{{ $t('sector.button.split') }}</v-btn>
                        <v-btn
                            v-if="adminLoggedIn"
                            class="left-margin-button"
                            color="error"
                            @click.stop="deleteSector()"
                            :disabled="!loggedInUser"
                            >{{ $t('sector.button.delete') }}</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-container
                text-center
                grid-list-xs
                style="padding: 0 16px;"
                v-if="loggedInUser">
                <v-layout class="row" wrap>
                    <v-flex xs12>
                        <v-textarea
                            v-model="newComment"
                            append-outer-icon="send"
                            @click:append-outer="postComment();"
                            :counter="500"
                            :rules="[v => v.length <= 500 || $t('comment_less_than')]"
                            :label="$t('comment')"
                        ></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container grid-list-md text-center style="padding: 16px;">
                <v-layout class="row" v-for="(event, index) in events" :key="index">
                    <v-flex xs12>
                        <div class="text-left">{{ event.description }}</div>
                        <div class="text-right grey--text text--lighten-1 caption">{{ event.osmUserName }}
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
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SET_DRAWER_RIGHT, SELECT_SECTOR } from "@/store/mutationTypes";

export default {
    name: 'CustomMenuRight',
    data () {
        return {
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
    computed: {
        drawerRight: {
            set (newValue) {
                this.$store.commit(SET_DRAWER_RIGHT, newValue);
            },
            get () {
                return this.$store.state.drawerRight;
            }
        },
        selectedSector: {
            set (newValue) {
                this.$store.commit(SELECT_SECTOR, newValue);
            },
            get () {
                return this.$store.state.selectedSector;
            }
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        },
        adminLoggedIn () {
            if (this.loggedInUser && document.getElementById('logged-in-user-name')) {
                return document.getElementById('logged-in-user-name').innerText === 'Artemis64' || document.getElementById('logged-in-user-name').innerText === 'Artemis64dev';
            } else {
                return false;
            }
        }
    },
    mounted () {
        this.$store.dispatch(SET_DRAWER_RIGHT, !this.$vuetify.breakpoint.xs);

        this.$store.dispatch(START_LOADING, 'getAllStates');
        MapApiService.getAllStates().then((res) => {
            this.states = res.data;
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.get_sector_states'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'getAllStates');
        });
        
        this.$store.dispatch(START_LOADING, 'getAllEvents');
        MapApiService.getAllEvents(25).then((res) => {
            this.allEvents = res.data;
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.recent_events'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'getAllEvents');
        });
    },
    methods: {
        selectSectorById: (id) => {
            EventBus.$emit('mnk:go-to-sector', id);
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

            this.$store.dispatch(START_LOADING, 'updateSector');
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

                EventBus.$emit(MESSAGE_SUCCESS, this.$t('request.sector_updated'));
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.sector_update'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'updateSector');
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

            this.$store.dispatch(START_LOADING, 'sendJOSMCommand');
            JOSMService.sendJOSMCommand('http://127.0.0.1:8111/load_and_zoom', loadAndZoomParams).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.josm_failed'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'sendJOSMCommand');
            });

            this.$store.dispatch(START_LOADING, 'sendJOSMImageryCommand');
            JOSMService.sendJOSMCommand('http://127.0.0.1:8111/imagery', {
                type: 'bing',
                url: 'https://www.bing.com/maps/'
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'sendJOSMImageryCommand');
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
            if (confirm(this.$t('request.confirm_deletion'))) {
                this.$store.dispatch(START_LOADING, 'deleteSectorById');
                MapApiService.deleteSectorById(this.selectedSector.properties._id).then(function () {
                    location.reload();
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.deletion'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'deleteSectorById');
                });
            }
        },
        splitSector: function () {
            if (confirm(this.$t('request.confirm_split'))) {
                this.$store.dispatch(START_LOADING, 'splitSectorById');
                MapApiService.splitSectorById(this.selectedSector.properties._id).then(function () {
                    location.reload();
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.split'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'splitSectorById');
                });
            }
        }
    },
    watch: {
        selectedSector () {
            if (!this.selectedSector) {
                return;
            }

            this.newState = this.selectedSector.properties.state._id;

            var coords = this.selectedSector.geometry.coordinates[0];
            this.idUrl = 'https://www.openstreetmap.org/edit?editor=id' +
                '&#map=13/' + (coords[1][1] + coords[2][1]) / 2 + '/' + (coords[0][0] + coords[1][0]) / 2 +
                '&comment=MappingNorthKorea.com%20sector%20' + this.selectedSector.properties._id +
                '&gpx=https://www.mappingnorthkorea.com/api/sector/generate/' + this.selectedSector.properties._id + '.gpx';
            this.rapidUrl = 'https://www.mapwith.ai/rapid?#' +
                'gpx=https://www.mappingnorthkorea.com/api/sector/generate/' + this.selectedSector.properties._id + '.gpx' +
                '&map=13/' + (coords[1][1] + coords[2][1]) / 2 + '/' + (coords[0][0] + coords[1][0]) / 2 +
                '&comment=MappingNorthKorea.com%20sector%20' + this.selectedSector.properties._id;

            this.$store.dispatch(START_LOADING, 'getEventsBySectorId');
            MapApiService.getEventsBySectorId(this.selectedSector.properties._id).then((res) => {
                if (!res.data.length) return;
                this.events = res.data.sort(function (a, b) { return new Date(b.time.date) - new Date(a.time.date); }).reverse();
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.sector_events'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'getEventsBySectorId');
            });
        }
    }
};
</script>

<style scoped>
.no-margin-button {
    margin: 0 !important;
    margin-bottom: 4px !important;
}
.left-margin-button {
    margin: 0 !important;
    margin-bottom: 4px !important;
    margin-left: 4px !important;
}
.v-btn--depressed .v-btn__content {
    padding: 0 10px;
}
.v-menu {
    display: inline-block !important;
}
</style>
