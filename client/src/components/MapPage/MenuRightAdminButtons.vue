<i18n>
{
    "en": {
        "button_split": "Split",
        "button_delete": "Delete",

        "request": {
            "confirm_deletion": "Are you sure you want to delete this sector?",
            "deletion": "Something went wrong while trying to delete the sector.",
            "confirm_split": "Are you sure you want to split this sector?",
            "split": "Something went wrong while trying to split the sector."
        }
    },
    "ko": {
        "button_split": null,
        "button_delete": null,

        "request": {
            "confirm_deletion": null,
            "deletion": null,
            "confirm_split": null,
            "split": null
        }
    }
}
</i18n>

<template>
    <div>
        <br/>
        <v-btn
            v-if="adminLoggedIn"
            class="ma-0"
            color="warning"
            @click.stop="splitSector()"
            :disabled="!loggedInUser"
            >{{ $t('button_split') }}</v-btn>
        <v-btn
            v-if="adminLoggedIn"
            class="mb-0 ml-1 mt-0 mr-0"
            color="error"
            @click.stop="deleteSector()"
            :disabled="!loggedInUser"
            >{{ $t('button_delete') }}</v-btn>
    </div>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING } from "@/store/mutationTypes";

export default {
    name: 'MenuRightAdminButtons',
    data () {
        return { };
    },
    computed: {
        selectedSector () {
            return this.$store.state.selectedSector;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        },
        adminLoggedIn () {
            return this.loggedInUser && (location.href.includes(`localhost`) || this.loggedInUser.name === `Artemis64` || this.loggedInUser.name === `Artemis64dev`);
        }
    },
    methods: {
        deleteSector () {
            if (confirm(this.$t('request.confirm_deletion'))) {
                this.$store.dispatch(START_LOADING, 'deleteSectorById');
                MapApiService.deleteSectorById(this.selectedSector.properties._id).then(function () {
                    MapApiService.recountSectorSetCounts(this.selectedSector.properties.sectorSet);
                    location.reload();
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.deletion'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'deleteSectorById');
                });
            }
        },
        splitSector () {
            if (confirm(this.$t('request.confirm_split'))) {
                this.$store.dispatch(START_LOADING, 'splitSectorById');
                MapApiService.splitSectorById(this.selectedSector.properties._id).then(() => {
                    MapApiService.recountSectorSetCounts(this.selectedSector.properties.sectorSet);
                    location.reload();
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.split'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'splitSectorById');
                });
            }
        }
    }
};
</script>

<style scoped>

</style>
