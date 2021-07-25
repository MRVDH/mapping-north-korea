<i18n>
{
    "en": {
        "regions": "Regions",
        "hide_completed_regions": "Hide completed regions",
        "show_more": "Show more",
        "show_less": "Show less"
    },
    "ko": {
        "regions": null,
        "hide_completed_regions": null,
        "show_more": null,
        "show_less": null
    }
}
</i18n>

<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <span class="font-weight-bold">{{ $t('regions') }}</span>
            </v-col>
            <v-col
                v-if="limitedSectorSets.length"
                id="regions-switch"
                >
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <div
                            v-bind="attrs"
                            style="height: 24px;"
                            v-on="on"
                            >
                            <v-switch
                                v-model="hideCompletedRegions"
                                dense
                                hide-details
                                class="mt-0"
                                />
                        </div>
                    </template>
                    <span>{{ $t('hide_completed_regions') }}</span>
                </v-tooltip>
            </v-col>
        </v-row>
        <v-row v-if="!limitedSectorSets.length">
            <v-col class="py-0 pl-4"><v-skeleton-loader type="list-item" /></v-col>
            <v-col class="py-0 pr-4"><v-skeleton-loader type="list-item" /></v-col>
        </v-row>
        <v-row v-if="!limitedSectorSets.length">
            <v-col class="py-0 pl-4"><v-skeleton-loader type="list-item" /></v-col>
            <v-col class="py-0 pr-4"><v-skeleton-loader type="list-item" /></v-col>
        </v-row>
        <v-row v-if="!limitedSectorSets.length">
            <v-col class="py-0 pl-4"><v-skeleton-loader type="list-item" /></v-col>
            <v-col class="py-0 pr-4"><v-skeleton-loader type="list-item" /></v-col>
        </v-row>
        <v-row
            v-for="(sectorSet, index) in limitedSectorSets"
            :key="index"
            >
            <v-col
                class="pt-0 pl-4"
                style="cursor: pointer;"
                @click="selectSectorSetById(sectorSet._id)"
                >
                {{ sectorSet.title }}
            </v-col>
            <v-col class="pt-0 pr-4">
                <v-progress-linear
                    :value="sectorSet.feature.properties._percentage"
                    height="18"
                    >
                    <strong>{{ Math.ceil(sectorSet.feature.properties._percentage) }}%</strong>
                </v-progress-linear>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0 px-4">
                <a
                    v-if="sectorSetLimit && limitedSectorSets.length"
                    @click="sectorSetLimit = null;"
                    >{{ $t('show_more') }}...</a>
                <a
                    v-if="!sectorSetLimit && limitedSectorSets.length"
                    @click="sectorSetLimit = 6;"
                    >{{ $t('show_less') }}...</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import EventBus from '@/events/EventBus';

export default {
    name: 'MenuRightRegions',
    data () {
        return {
            sectorSetLimit: 6,
            hideCompletedRegions: false
        };
    },
    computed: {
        sectorSets () {
            return this.$store.state.sectorSets;
        },
        limitedSectorSets () {
            let sectorSetsToReturn = this.hideCompletedRegions ? this.sectorSets.filter(x => x.feature.properties._percentage !== 100) : this.sectorSets;
            
            return this.sectorSetLimit ? sectorSetsToReturn.slice(0, this.sectorSetLimit) : sectorSetsToReturn;
        }
    },
    methods: {
        selectSectorSetById (id) {
            EventBus.$emit('mnk:go-to-sector-set', id);
        }
    }
};
</script>

<style scoped>
.v-skeleton-loader__list-item {
    padding: 0;
}

#regions-switch .v-input--switch {
    padding-top: 0;
    float: right;
}
#regions-switch .v-input--selection-controls__input {
    margin-right: 0;
}
</style>
