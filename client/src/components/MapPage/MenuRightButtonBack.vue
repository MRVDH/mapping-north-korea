<i18n>
{
    "en": {
        "back_to_regions": "Back to regions"
    },
    "ko": {
        "back_to_regions": null
    }
}
</i18n>

<template>
    <v-list class="pt-0 pb-0">
        <v-list-item
            @click="backToRegions()">
            <v-list-item-icon>
                <v-icon>mdi-arrow-left</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ $t('back_to_regions') }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>
import { SELECT_SECTOR_SET } from "@/store/mutationTypes";

export default {
    name: 'MenuRightButtonBack',
    data () {
        return { };
    },
    methods: {
        backToRegions () {
            this.$store.dispatch(SELECT_SECTOR_SET, null);
        }
    }
};
</script>

<style scoped>

</style>
