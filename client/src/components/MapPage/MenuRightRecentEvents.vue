<i18n>
{
    "en": {
        "recent_events": "Recent events",
        "show_more": "Show more",
        "show_less": "Show less",

        "request": {
            "recent_events": "Something went wrong while trying to get recent events."
        }
    },
    "ko": {
        "recent_events": "최근 내역",
        "show_more": null,
        "show_less": null,

        "request": {
            "recent_events": null
        }
    }
}
</i18n>

<template>
    <div>
        <v-container class="pa-4 pb-0">
            <v-row>
                <v-col class="py-0">
                    <span class="font-weight-bold">{{ $t('recent_events') }}</span>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="pt-4">
            <v-row v-if="!limitedRecentEvents.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item" /></v-col>
            </v-row>
            <v-row v-if="!limitedRecentEvents.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item" /></v-col>
            </v-row>
            <v-row v-if="!limitedRecentEvents.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item" /></v-col>
            </v-row>
            <v-row
                v-for="(event, index) in limitedRecentEvents"
                :key="index"
                >
                <v-col class="pt-0 px-4">
                    <div
                        class="text-left"
                        style="cursor: pointer;"
                        @click="selectSector(event.sector)"
                        >
                        {{ event.description }}
                    </div>
                    <div class="text-right grey--text caption">
                        {{ event.osmUserName }}
                        <a
                            :href="'https://www.openstreetmap.org/user/' + event.osmUserName"
                            target="_blank"
                            style="text-decoration: none;"
                            >
                            <v-icon
                                small
                                style="font-size: 10px; vertical-align: initial;"
                                >
                                launch
                            </v-icon>
                        </a> - <span :title="new Date(event.time)">{{ calculateDateOutput(new Date(event.time)) }}</span>
                    </div>
                </v-col>
            </v-row>
            <v-row text-left>
                <v-col class="py-0 px-4">
                    <a
                        v-if="eventsLimit && limitedRecentEvents.length"
                        @click="eventsLimit = null;"
                        >{{ $t('show_more') }}...</a>
                    <a
                        v-if="!eventsLimit && limitedRecentEvents.length"
                        @click="eventsLimit = 4;"
                        >{{ $t('show_less') }}...</a>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import UtilService from '@/services/UtilService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SET_RECENT_EVENTS } from "@/store/mutationTypes";

export default {
    name: 'MenuRightRecentEvents',
    data () {
        return {
            eventsLimit: 4
        };
    },
    computed: {
        recentEvents () {
            return this.$store.state.recentEvents;
        },
        limitedRecentEvents () {
            return this.eventsLimit ? this.recentEvents.slice(0, this.eventsLimit) : this.recentEvents;
        }
    },
    mounted () {
        this.$store.dispatch(START_LOADING, 'getAllEvents');
        MapApiService.getAllEvents(25).then((res) => {
            this.$store.dispatch(SET_RECENT_EVENTS, res.data);
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.recent_events'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'getAllEvents');
        });
    },
    methods: {
        selectSector (sector) {
            EventBus.$emit('mnk:go-to-sector', { sectorId: sector._id.toString(), sectorSetId: sector.sectorSet.toString() });
        },
        calculateDateOutput (time) {
            return UtilService.calculateDateOutput(time);
        }
    }
};
</script>

<style scoped>
.v-skeleton-loader__list-item {
    padding: 0;
}
</style>
