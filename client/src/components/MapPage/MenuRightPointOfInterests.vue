<i18n>
{
    "en": {
        "pois": "Points of interest",
        "show_more": "Show more",
        "show_less": "Show less"
    },
    "ko": {
        "pois": null,
        "show_more": null,
        "show_less": null
    }
}
</i18n>

<template>
    <div>
        <v-container class="pa-4 pb-0">
            <v-row>
                <v-col class="pt-0 pb-0">
                    <span class="font-weight-bold">{{ $t('pois') }}</span>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="pt-4">
            <v-row v-if="!limitedPointOfInterests.length">
                <v-col class="py-0 pl-4"><v-skeleton-loader type="list-item" /></v-col>
                <v-col class="py-0 pr-4"><v-skeleton-loader type="list-item" /></v-col>
            </v-row>
            <v-row v-if="!limitedPointOfInterests.length">
                <v-col class="py-0 pl-4"><v-skeleton-loader type="list-item" /></v-col>
                <v-col class="py-0 pr-4"><v-skeleton-loader type="list-item" /></v-col>
            </v-row>
            <v-row v-if="!limitedPointOfInterests.length">
                <v-col class="py-0 pl-4"><v-skeleton-loader type="list-item" /></v-col>
                <v-col class="py-0 pr-4"><v-skeleton-loader type="list-item" /></v-col>
            </v-row>
            <v-row
                v-for="(poi, index) in limitedPointOfInterests"
                :key="index"
                >
                <v-col
                    class="pt-0 pl-4"
                    style="cursor: pointer;"
                    @click="selectPointOfInterest(poi._id)"
                    >
                    {{ poi.title }}
                    <div class="grey--text caption"><v-icon class="grey--text">mdi-thumb-up</v-icon> {{ poi.likes.length }}</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-0 px-4">
                    <a
                        v-if="poiLimit && limitedPointOfInterests.length && limitedPointOfInterests.length > 6"
                        @click="poiLimit = null;"
                        >{{ $t('show_more') }}...</a>
                    <a
                        v-if="!poiLimit && limitedPointOfInterests.length"
                        @click="poiLimit = 6;"
                        >{{ $t('show_less') }}...</a>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
//import EventBus from '@/events/EventBus';

export default {
    name: 'MenuRightPointOfInterests',
    data () {
        return {
            poiLimit: 6
        };
    },
    computed: {
        pointOfInterests () {
            return this.$store.state.pointOfInterests;
        },
        limitedPointOfInterests () {
            return this.poiLimit ? this.pointOfInterests.slice(0, this.poiLimit) : this.pointOfInterests;
        }
    },
    methods: {
        selectPointOfInterest (/* id */) {
            // TODO
        }
    }
};
</script>

<style scoped>
.v-skeleton-loader__list-item {
    padding: 0;
}

.v-icon {
    font-size: 16px;
    vertical-align: text-bottom;
}
</style>
