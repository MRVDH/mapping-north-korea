<i18n>
{
    "en": {
        "button_toggle_poi_visibility": "Toggle Point of Interest visibility",
        "button_add_poi": "Add Point of Interest"
    },
    "ko": {
        "button_toggle_poi_visibility": null,
        "button_add_poi": null
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
            @click="addPoi()"
            >
            <span class="mapboxgl-ctrl-icon">
                <v-icon>mdi-map-marker-plus</v-icon>
            </span>
        </button>
    </div>
</template>

<script>
import MapService from '@/services/MapService';
import { SET_POIS_VISIBLE } from "@/store/mutationTypes";

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
        }
    },
    async mounted () {
        await mountButton(this);
    },
    methods: {
        togglePoisVisibility () {
            MapService.setPoiVisibility(!this.poisVisible);
            this.$store.dispatch(SET_POIS_VISIBLE, !this.poisVisible);
        },
        addPoi () {

        }
    }
};
</script>

<style scoped>
.v-icon {
    font-size: 18px;
    padding-top: 5px;
}
</style>