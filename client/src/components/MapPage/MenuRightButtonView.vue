<i18n>
{
    "en": {
        "button_view": "View"
    },
    "ko": {
        "button_view": null
    }
}
</i18n>

<template>
    <v-btn
        class="mb-1 ml-1 mt-0 mr-0"
        color="success"
        target="_blank"
        :href="viewLink"
        >
        {{ $t('button_view') }}
    </v-btn>
</template>

<script>
export default {
    name: 'MenuRightButtonView',
    data () {
        return { };
    },
    computed: {
        selectedSector () {
            return this.$store.state.selectedSector;
        },
        viewLink () {
            return 'https://www.openstreetmap.org/#map=13/' + (this.selectedSector.coordinates[0][1][1] + this.selectedSector.coordinates[0][2][1]) / 2 + '/' + (this.selectedSector.coordinates[0][0][0] + this.selectedSector.coordinates[0][1][0]) / 2;
        }
    }
};
</script>

<style scoped>

</style>
