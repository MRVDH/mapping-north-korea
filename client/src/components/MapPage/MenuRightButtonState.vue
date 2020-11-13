<i18n>
{
    "en": {
        "state": "State",

        "request": {
            "get_sector_states": "Something went wrong while trying to get all possible sector states.",
            "sector_updated": "Sector updated.",
            "sector_update": "Something went wrong while trying to update the sector."
        }
    },
    "ko": {
        "state": "상태",

        "request": {
            "get_sector_states": null,
            "sector_updated": null,
            "sector_update": null
        }
    }
}
</i18n>

<template>
    <v-list-item>
        <v-list-item-content>
            <v-list-item-title>{{ $t('state') }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
            <v-menu
                offset-y
                v-model="stateEditOpen">
                <template v-slot:activator="{ on }">
                    <v-btn
                        outlined
                        v-on="on"
                        class="mb-1 ml-0 mt-0 mr-0"
                        :disabled="!loggedInUser"
                        >
                        {{ selectedSector.properties.state.title }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="(state, index) in states"
                        :key="index"
                        @click.stop="updateSector(state)"
                        >
                        <v-list-item-title>
                            <span :style="{ color: state.color, 'vertical-align': 'text-bottom' }">■</span> {{ state.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SELECT_SECTOR, ADD_TO_RECENT_EVENTS, SET_SECTOR_EVENTS } from "@/store/mutationTypes";

export default {
    name: 'MenuRightButtonState',
    data () {
        return {
            states: null,
            stateEditOpen: false
        };
    },
    computed: {
        selectedSector: {
            set (newValue) {
                this.$store.commit(SELECT_SECTOR, newValue);
            },
            get () {
                return this.$store.state.selectedSector;
            }
        },
        sectorEvents () {
            return this.$store.state.sectorEvents;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        }
    },
    mounted () {
        this.$store.dispatch(START_LOADING, 'getAllStates');
        MapApiService.getAllStates().then((res) => {
            this.states = res.data;
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.get_sector_states'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'getAllStates');
        });
    },
    methods: {
        updateSector (state) {
            var apiSector = this.geoJsonSectorToApiSector(this.selectedSector);
            this.stateEditOpen = false;

            this.$store.dispatch(START_LOADING, 'updateSector');
            MapApiService.updateSector({
                sector: apiSector,
                state: state
            }).then((res) => {
                let newEvents = [
                    res.data.event,
                    ...this.sectorEvents
                ];

                this.$store.dispatch(SET_SECTOR_EVENTS, newEvents);
                this.$store.dispatch(ADD_TO_RECENT_EVENTS, event);

                this.selectedSector = this.sectorToGeoJson(res.data.sector);

                MapApiService.recountSectorSetCounts(res.data.sector.sectorSet);

                EventBus.$emit(MESSAGE_SUCCESS, this.$t('request.sector_updated'));
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.sector_update'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'updateSector');
            });
        },
        geoJsonSectorToApiSector (sect) {
            return {
                _id: sect.properties._id,
                sectorSet: sect.properties.sectorSet,
                state: sect.properties.state,
                coordinates: sect.geometry.coordinates
            };
        },
        sectorToGeoJson (sector) {
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
        }
    }
};
</script>

<style scoped>

</style>
