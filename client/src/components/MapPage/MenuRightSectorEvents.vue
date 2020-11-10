<i18n>
{
    "en": {
        "comment_less_than": "Comment must be less than 500 characters.",
        "comment": "Comment",

        "request": {
            "sector_events": "Something went wrong while trying to get the events of a sector.",
            "new_comment_failed": "Something went wrong while trying to add the comment.",
            "new_comment_success": "Comment added."
        }
    },
    "ko": {
        "comment_less_than": null,
        "comment": null,

        "request": {
            "sector_events": null,
            "new_comment_failed": null,
            "new_comment_success": null
        }
    }
}
</i18n>

<template>
    <div>
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
            <v-layout class="row" v-for="(event, index) in sectorEvents" :key="index">
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
    </div>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import UtilService from '@/services/UtilService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, ADD_TO_RECENT_EVENTS, SET_SECTOR_EVENTS } from "@/store/mutationTypes";

export default {
    name: 'MenuRightRecentEvents',
    data () {
        return {
            newComment: ''
        };
    },
    computed: {
        recentEvents () {
            return this.$store.state.recentEvents;
        },
        sectorEvents () {
            return this.$store.state.sectorEvents;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        },
        selectedSector () {
            return this.$store.state.selectedSector;
        }
    },
    mounted () {
        this.$store.dispatch(START_LOADING, 'getEventsBySectorId');
        MapApiService.getEventsBySectorId(this.selectedSector.properties._id).then((res) => {
            if (!res.data.length) {
                return;
            }

            let events = res.data.sort(function (a, b) { return new Date(b.time.date) - new Date(a.time.date); }).reverse();

            this.$store.dispatch(SET_SECTOR_EVENTS, events);
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.sector_events'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'getEventsBySectorId');
        });
    },
    methods: {
        calculateDateOutput (time) {
            return UtilService.calculateDateOutput(time);
        },
        postComment () {
            if (this.newComment === '' || this.newComment === null || this.newComment === undefined) {
                return;
            }
            
            this.$store.dispatch(START_LOADING, 'addEvent');
            MapApiService.addEvent({
                sectorId: this.selectedSector.properties._id,
                description: this.newComment
            }).then((res) => {
                let newEvents = [
                    res.data,
                    ...this.sectorEvents
                ];

                this.$store.dispatch(SET_SECTOR_EVENTS, newEvents);
                this.$store.dispatch(ADD_TO_RECENT_EVENTS, res.data);

                this.newComment = '';

                EventBus.$emit(MESSAGE_SUCCESS, this.$t('request.new_comment_success'));
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.new_comment_failed'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'addEvent');
            });
        },
    }
};
</script>

<style scoped>

</style>
