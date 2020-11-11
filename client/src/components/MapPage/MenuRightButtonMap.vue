<i18n>
{
    "en": {
        "map_button": "Map",

        "request": {
            "josm_failed": "Failed to load data into JOSM. See the FAQ for more information."
        }
    },
    "ko": {
        "map_button": "매핑",

        "request": {
            "josm_failed": null
        }
    }
}
</i18n>

<template>
    <v-menu
        offset-y
        v-model="mappingMenuOpen">
        <template v-slot:activator="{ on }">
            <v-btn
                color="success"
                v-on="on"
                class="mb-1 ml-0 mt-0 mr-0"
                :disabled="!loggedInUser || selectedSector.properties.state.title === 'Open' || selectedSector.properties.state.title === 'Review needed' || selectedSector.properties.state.title === 'Completed'"
                >
                {{ $t('map_button') }}
            </v-btn>
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
</template>

<script>
import JOSMService from '@/services/JOSMService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING } from "@/store/mutationTypes";

export default {
    name: 'MenuRightButtonMap',
    data () {
        return {
            idUrl: '',
            rapidUrl: '',
            mappingMenuOpen: false
        };
    },
    computed: {
        selectedSector () {
            return this.$store.state.selectedSector;
            
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        }
    },
    watch: {
        selectedSector () {
            if (!this.selectedSector) {
                return;
            }

            var coords = this.selectedSector.geometry.coordinates[0];

            this.idUrl = 'https://www.openstreetmap.org/edit?editor=id' +
                '&#map=13/' + (coords[1][1] + coords[2][1]) / 2 + '/' + (coords[0][0] + coords[1][0]) / 2 +
                '&comment=MappingNorthKorea.com%20sector%20' + this.selectedSector.properties._id +
                '&gpx=https://www.mappingnorthkorea.com/api/sector/generate/' + this.selectedSector.properties._id + '.gpx';
            this.rapidUrl = 'https://www.mapwith.ai/rapid?#' +
                'gpx=https://www.mappingnorthkorea.com/api/sector/generate/' + this.selectedSector.properties._id + '.gpx' +
                '&map=13/' + (coords[1][1] + coords[2][1]) / 2 + '/' + (coords[0][0] + coords[1][0]) / 2 +
                '&comment=MappingNorthKorea.com%20sector%20' + this.selectedSector.properties._id;
        }
    },
    methods: {
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
        }
    }
};
</script>

<style scoped>
.v-menu {
    display: inline-block !important;
}
</style>
