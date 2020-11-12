<i18n>
{
    "en": {
        "regions": "Regions",
        "show_more": "Show more",
        "show_less": "Show less"
    },
    "ko": {
        "regions": null,
        "show_more": null,
        "show_less": null
    }
}
</i18n>

<template>
    <div>
        <v-container
            class="pa-3 pt-4 pb-0">
            <v-layout>
                <v-flex>
                    <span class="font-weight-bold">{{ $t('regions') }}</span>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container class="pt-4">
            <v-row v-if="!limitedSectorSets.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
            </v-row>
            <v-row v-if="!limitedSectorSets.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
            </v-row>
            <v-row v-if="!limitedSectorSets.length">
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
                <v-col class="pt-0 pb-0"><v-skeleton-loader type="list-item"></v-skeleton-loader></v-col>
            </v-row>
            <v-row v-for="(sectorSet, index) in limitedSectorSets" :key="index">
                <v-col class="pt-0" @click.stop="selectSectorSetById(sectorSet._id)" style="cursor: pointer;">
                    {{ sectorSet.title }}
                </v-col>
                <v-col class="pt-0">
                    <v-progress-linear
                        :value="sectorSet.feature.properties._percentage"
                        height="18"
                        >
                        <strong>{{ Math.ceil(sectorSet.feature.properties._percentage) }}%</strong>
                    </v-progress-linear>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <a v-if="sectorSetLimit && limitedSectorSets.length" @click="sectorSetLimit = null;">{{ $t('show_more') }}...</a>
                    <a v-if="!sectorSetLimit && limitedSectorSets.length" @click="sectorSetLimit = 6;">{{ $t('show_less') }}...</a>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import EventBus from '@/events/EventBus';

export default {
    name: 'MenuRightRegions',
    data () {
        return {
            sectorSetLimit: 6
        };
    },
    computed: {
        sectorSets () {
            return this.$store.state.sectorSets;
        },
        limitedSectorSets () {
            return this.sectorSetLimit ? this.sectorSets.slice(0, this.sectorSetLimit) : this.sectorSets;
        }
    },
    methods: {
        selectSectorSetById (id) {
            EventBus.$emit('mnk:go-to-sector-set', id);
        }
    }
};
</script>

<style>
.v-skeleton-loader__list-item {
    padding: 0;
}
</style>
