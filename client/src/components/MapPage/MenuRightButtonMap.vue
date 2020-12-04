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
        v-model="mappingMenuOpen"
        offset-y
        >
        <template v-slot:activator="{ on }">
            <v-btn
                color="success"
                class="mb-1 ml-0 mt-0 mr-0"
                :disabled="!loggedInUser || selectedSector.properties.state.title === 'Completed'"
                v-on="on"
                >
                {{ $t('map_button') }}
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                :href="idUrl"
                target="_blank"
                @click="updateState(); mappingMenuOpen = false;"
                >
                <v-list-item-title>iD</v-list-item-title>
            </v-list-item>
            <v-list-item
                :href="rapidUrl"
                target="_blank"
                @click="updateState(); mappingMenuOpen = false;"
                >
                <v-list-item-title>RapiD</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="mapSectorInJOSM(); updateState(); mappingMenuOpen = false;">
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

            this.setMappingLinks();
        }
    },
    mounted () {
        this.setMappingLinks();
    },
    methods: {
        setMappingLinks () {
            // get the center of the section
            let minx = 9999999;
            let miny = 9999999;
            let maxx = 0;
            let maxy = 0;

            for (let coordSet of this.selectedSector.geometry.coordinates[0]) {
                if (coordSet[0] < minx) minx = coordSet[0];
                if (coordSet[1] < miny) miny = coordSet[1];
                if (coordSet[0] > maxx) maxx = coordSet[0];
                if (coordSet[1] > maxy) maxy = coordSet[1];
            }

            let centerx = minx + ((maxx - minx) / 2);
            let centery = miny + ((maxy - miny) / 2);

            var thisHost = window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'https://www.mappingnorthkorea.com';
            var osmHost = window.location.hostname === 'localhost' ? 'https://master.apis.dev.openstreetmap.org' : 'https://www.openstreetmap.org';

            this.idUrl = `${osmHost}/edit?editor=id&#map=16/${centery}/${centerx}&comment=MappingNorthKorea.com%20sector%20${this.selectedSector.properties._id}&gpx=${thisHost}/api/sector/generate/${this.selectedSector.properties._id}.gpx`;
            this.rapidUrl = `https://www.mapwith.ai/rapid?#gpx=${thisHost}/api/sector/generate/${this.selectedSector.properties._id}.gpx&map=16/${centery}/${centerx}&comment=MappingNorthKorea.com%20sector%20${this.selectedSector.properties._id}`;
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
        updateState () {
            if (this.selectedSector.properties.state.title !== `Open`) {
                return;
            }

            EventBus.$emit(`mnk:set-sector-state-being-edited`);
        }
    }
};
</script>

<style scoped>
.v-menu {
    display: inline-block !important;
}
</style>
