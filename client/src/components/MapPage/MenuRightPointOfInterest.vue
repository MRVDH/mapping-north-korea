<i18n>
{
    "en": {
        "poi-title": "Title",
        "description": "Description",
        "categories": "Categories",
        "btn-edit": "Edit",
        "btn-delete": "Delete",
        "request-success-poi-delete": "Point of interest successfully deleted",
        "request-error-poi-delete": "An error occured while deleting the point of interest"
    },
    "ko": {
        "poi-title": null,
        "description": null,
        "categories": null,
        "btn-edit": null,
        "btn-delete": null,
        "request-success-poi-delete": null,
        "request-error-poi-delete": null
    }
}
</i18n>

<template>
    <v-container
        fluid
        class="pa-4"
        >
        <v-row>
            <v-col
                cols="12"
                class="text-subtitle-2 pb-1 "
                >
                {{ $t('poi-title') }}
            </v-col>
            <v-col
                cols="12"
                class="pt-0"
                >
                {{ selectedPoi.title }}
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12"
                class="text-subtitle-2 pb-1 "
                >
                {{ $t('description') }}
            </v-col>
            <v-col
                cols="12"
                class="pt-0"
                >
                {{ selectedPoi.description }}
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12"
                class="text-subtitle-2 pb-1 "
                >
                {{ $t('categories') }}
            </v-col>
            <v-col
                cols="12"
                class="pt-0"
                >
                <span
                    v-for="(category, index) in thisPoisCategories"
                    :key="index"
                    :title="category.description"
                    >
                    {{ category.title }}<span v-if="index !== thisPoisCategories.length - 1">,</span>
                </span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn
                    class="ma-0"
                    color="warning"
                    :disabled="!loggedInUser"
                    @click="edit()"
                    >
                    {{ $t('btn-edit') }}
                </v-btn>
                <v-btn
                    v-if="adminLoggedIn"
                    class="mb-0 ml-1 mt-0 mr-0"
                    color="error"
                    :disabled="!loggedInUser"
                    @click="deletePoi()"
                    >
                    {{ $t('btn-delete') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_SUCCESS, MESSAGE_ERROR } from '@/events/eventTypes';
import { START_LOADING, STOP_LOADING, SELECT_POI, SET_POINT_OF_INTERESTS } from "@/store/mutationTypes";

export default {
    name: 'MenuRightPointOfInterest',
    data () {
        return { };
    },
    computed: {
        selectedPoi () {
            return this.$store.state.selectedPoi;
        },
        pointOfInterestCategories () {
            return this.$store.state.pointOfInterestCategories;
        },
        thisPoisCategories () {
            return this.selectedPoi.categories.map(x => this.pointOfInterestCategories.find(y => y._id === x));
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        },
        adminLoggedIn () {
            return this.loggedInUser && (location.href.includes(`localhost`) || this.loggedInUser.name === `Artemis64` || this.loggedInUser.name === `Artemis64dev`);
        },
        pointOfInterests () {
            return this.$store.state.pointOfInterests;
        }
    },
    methods: {
        edit () {
            // open popup
        },
        deletePoi () {
            this.$store.dispatch(START_LOADING, 'deletePointOfInterest');
            MapApiService.deletePointOfInterest(this.selectedPoi._id).then(() => {
                let newPoiArray = this.pointOfInterests.filter(x => x._id != this.selectedPoi._id);

                this.$store.dispatch(SELECT_POI, null);
                this.$store.dispatch(SET_POINT_OF_INTERESTS, newPoiArray);
                EventBus.$emit(MESSAGE_SUCCESS, this.$t('request-success-poi-delete'));
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request-error-poi-delete'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'deletePointOfInterest');
            });
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
