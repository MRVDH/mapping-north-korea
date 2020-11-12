<i18n>
{
    "en": {
        "recent_events": "Recent events",

        "request": {
            "recent_events": "Something went wrong while trying to get recent events."
        }
    },
    "ko": {
        "recent_events": "최근 내역",

        "request": {
            "recent_events": null
        }
    }
}
</i18n>

<template>
    <div>
        <v-container
            grid-list-xs
            class="pl-4 pr-4 pt-4 pb-0">
            <v-layout>
                <v-flex>
                    <span class="font-weight-bold">{{ $t('recent_events') }}</span>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container
            grid-list-md
            text-center
            class="pa-4">
            <v-row v-if="!recentEvents.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
            </v-row>
            <v-row v-if="!recentEvents.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
            </v-row>
            <v-row v-if="!recentEvents.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
            </v-row>
            <v-layout class="row" v-for="(event, index) in recentEvents" :key="index">
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
        return { };
    },
    computed: {
        recentEvents () {
            return this.$store.state.recentEvents;
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
        selectSectorById (id) {
            EventBus.$emit('mnk:go-to-sector', id);
        },
        calculateDateOutput (time) {
            return UtilService.calculateDateOutput(time);
        }
    }
};
</script>

<style scoped>

</style>
