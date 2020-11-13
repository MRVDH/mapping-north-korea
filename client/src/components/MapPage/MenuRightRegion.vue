<i18n>
{
    "en": {
        "name": "Name",
        "completed": "Completed sectors",
        "total": "Total sectors"
    },
    "ko": {
        "name": null,
        "completed": null,
        "total": null
    }
}
</i18n>

<template>
    <v-container
        class="py-0 px-4">
        <v-row>
            <v-col cols="8">{{ $t('name') }}</v-col>
            <v-col cols="4" class="text-right">{{ selectedSectorSet.title }}</v-col>
        </v-row>
        <v-row>
            <v-col cols="8">{{ $t('completed') }}</v-col>
            <v-col cols="4" class="text-right">{{ selectedSectorSet.completedCount }}</v-col>
        </v-row>
        <v-row>
            <v-col cols="8">{{ $t('total') }}</v-col>
            <v-col cols="4" class="text-right">{{ selectedSectorSet.totalCount }}</v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-progress-linear
                    :value="selectedSectorSet.feature.properties._percentage"
                    height="18"
                    >
                    <strong>{{ Math.ceil(selectedSectorSet.feature.properties._percentage) }}%</strong>
                </v-progress-linear>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'MenuRightRegion',
    data () {
        return { };
    },
    computed: {
        selectedSectorSet () {
            return this.$store.state.selectedSectorSet;
        }
    }
};
</script>

<style scoped>
.col {
    font-size: 1rem;
    line-height: 1.2;
}
</style>
