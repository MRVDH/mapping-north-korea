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
            grid-list-xs
            class="pa-3">
            <v-layout>
                <v-flex>
                    <span class="font-weight-bold">{{ $t('regions') }}</span>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container>
            <v-row v-for="(sectorSet, index) in limitedSectorSets" :key="index">
                <v-col class="pt-0">
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
    }
};
</script>

<style scoped>

</style>
