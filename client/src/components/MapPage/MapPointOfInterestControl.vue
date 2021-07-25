<i18n>
{
    "en": {
        "button_toggle_poi_visibility": "Toggle Point of Interest visibility",
        "button_add_poi": "Add Point of Interest",
        "message_select_on_map": "Select a location on the map for the Point of Interest."
    },
    "ko": {
        "button_toggle_poi_visibility": null,
        "button_add_poi": null,
        "message_select_on_map": null
    }
}
</i18n>

<template>
    <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
            type="button"
            :title="$t('button_toggle_poi_visibility')"
            @click="togglePoisVisibility()"
            >
            <span class="mapboxgl-ctrl-icon">
                <v-icon v-if="poisVisible">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
            </span>
        </button>
        <button
            type="button"
            :title="$t('button_add_poi')"
            :disabled="!loggedInUser"
            @click="addPoi()"
            >
            <span class="mapboxgl-ctrl-icon">
                <v-icon>mdi-map-marker-plus</v-icon>
            </span>
        </button>
    </div>
</template>

<script>
import EventBus from '@/events/EventBus';
import { MESSAGE_INFO } from '@/events/eventTypes';
import MapService from '@/services/MapService';
import { SET_POIS_VISIBLE, SET_ADD_MODE } from "@/store/mutationTypes";

async function mountButton (component) {
    let interval = setInterval(() => {
        let elements = document.getElementsByClassName('mapboxgl-ctrl-top-right');

        if (!elements || !elements.length) {
            return;
        }

        elements[0].appendChild(component.$el);
        clearInterval(interval);
    }, 10);
}

export default {
    name: 'MapPointOfInterestControl',
    computed: {
        poisVisible () {
            return this.$store.state.poisVisible;
        },
        addMode () {
            return this.$store.state.addMode;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        }
    },
    async mounted () {
        // add auth check
        await mountButton(this);
    },
    methods: {
        togglePoisVisibility () {
            MapService.setPoiVisibility(!this.poisVisible);
            this.$store.dispatch(SET_POIS_VISIBLE, !this.poisVisible);
        },
        addPoi () {
            MapService.setAddMode(!this.addMode);
            this.$store.dispatch(SET_ADD_MODE, !this.addMode);

            if (this.addMode) {
                EventBus.$emit(MESSAGE_INFO, this.$t('message_select_on_map'));
            }
        }
    }
};
</script>

<style scoped>
.v-icon {
    font-size: 18px;
    padding-top: 5px;
    color: #333333;
}
</style>