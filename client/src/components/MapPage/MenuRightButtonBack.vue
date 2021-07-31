<i18n>
{
    "en": {
        "back": "Back"
    },
    "ko": {
        "back": null
    }
}
</i18n>

<template>
    <v-list class="pt-0 pb-0">
        <v-list-item @click="back()">
            <v-list-item-icon>
                <v-icon>mdi-arrow-left</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ $t('back') }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>
import { SELECT_SECTOR_SET, SELECT_POI } from "@/store/mutationTypes";

export default {
    name: 'MenuRightButtonBack',
    data () {
        return { };
    },
    methods: {
        back () {
            this.$store.dispatch(SELECT_SECTOR_SET, null);
            this.$store.dispatch(SELECT_POI, null);
        }
    }
};
</script>

<style scoped>

</style>
