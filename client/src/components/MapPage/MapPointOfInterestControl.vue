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
    <div class="leaflet-control-zoom leaflet-bar leaflet-control">
        <a
            class="leaflet-control-zoom-in"
            :title="$t('button_toggle_poi_visibility')"
            role="button"
            :aria-label="$t('button_toggle_poi_visibility')"
            @click="togglePoisVisibility()"
            >
            <v-icon v-if="poisVisible">mdi-eye</v-icon>
            <v-icon v-else>mdi-eye-off</v-icon>
        </a>
        <a
            class="leaflet-control-zoom-out"
            :title="$t('button_add_poi')"
            role="button"
            :aria-label="$t('button_add_poi')"
            @click="addPoi()"
            >
            <v-icon>mdi-map-marker-plus</v-icon>
        </a>
    </div>
</template>

<script>
import { SET_POIS_VISIBLE } from "@/store/mutationTypes";

async function mountButton (component) {
    let interval = setInterval(() => {
        let elements = document.getElementsByClassName('leaflet-top leaflet-right');

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
}
</style>