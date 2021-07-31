<i18n>
{
    "en": {
        "title": "Point of Interest",
        "save": "Save",
        "close": "Close",
        "poi-title": "Title",
        "description": "Description",
        "categories": "Categories",
        "input-field-error": "Not all required input fields are filled.",
        "request-success-poi-save": "Point of Interest saved",
        "request-error-poi-save": "An error occurd while saving the Point of Interest"
    },
    "ko": {
        "title": null,
        "save": null,
        "close": null,
        "poi-title": null,
        "description": null,
        "categories": null,
        "input-field-error": null,
        "request-success-poi-save": null,
        "request-error-poi-save": null
    }
}
</i18n>

<template>
    <v-dialog
        v-model="poiModal"
        max-width="700px"
        persistent
        >
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ $t('title') }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="poiTitle"
                                :label="$t('poi-title') + '*'"
                                required
                                />
                            <v-textarea
                                v-model="poiDescription"
                                :label="$t('description')"
                                rows="3"
                                />
                            <v-combobox
                                v-model="selectedCategories"
                                :items="categories"
                                :label="$t('categories') + '*'"
                                multiple
                                chips
                                deletable-chips
                                required
                                />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close()"
                    >
                    {{ $t('close') }}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save()"
                    >
                    {{ $t('save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_SUCCESS, MESSAGE_ERROR, MESSAGE_INFO } from '@/events/eventTypes';
import store from '@/store';
import { START_LOADING, STOP_LOADING, SET_ADD_MODE, SET_POI_MODAL, SET_ADD_MODE_LONGITUDE, SET_ADD_MODE_LATITUDE, SET_POINT_OF_INTERESTS, SELECT_POI } from "@/store/mutationTypes";

export default {
    name: 'PointOfInterestModal',
    data () {
        return {
            poiTitle: null,
            poiDescription: null,
            selectedCategories: [],
            categories: []
        };
    },
    computed: {
        poiModal () {
            return this.$store.state.poiModal;
        },
        pointOfInterests () {
            return this.$store.state.pointOfInterests;
        },
        pointOfInterestCategories () {
            return this.$store.state.pointOfInterestCategories;
        },
        selectedPoi () {
            return this.$store.state.selectedPoi;
        }
    },
    watch: {
        poiModal () {
            if (this.poiModal) {
                this.categories = this.pointOfInterestCategories.map(x => x.title);

                if (this.selectedPoi) {
                    this.selectedCategories = this.pointOfInterestCategories.filter(x => this.selectedPoi.categories.find(y => y === x._id)).map(x => x.title);
                    this.poiTitle = this.selectedPoi.title;
                    this.poiDescription = this.selectedPoi.description;
                }
            }
        }
    },
    methods: {
        save () {
            if (!this.poiTitle || !this.selectedCategories.length) {
                EventBus.$emit(MESSAGE_INFO, this.$t('input-field-error'));
                return;
            }

            let categories = this.selectedCategories.map(x => this.pointOfInterestCategories.find(y => y.title === x));

            if (!this.selectedPoi) {
                this.$store.dispatch(START_LOADING, 'savePointOfInterest');
                MapApiService.addPointOfInterest({
                    title: this.poiTitle,
                    description: this.poiDescription,
                    longitude: this.$store.state.addModeLongitude,
                    latitude: this.$store.state.addModeLatitude,
                    categories
                }).then((res) => {
                    let newPoiArray = this.pointOfInterests;
                    newPoiArray.push(res.data);
                    newPoiArray = newPoiArray.sort((first, second) => second.likeCount - first.likeCount);

                    this.$store.dispatch(SET_POINT_OF_INTERESTS, newPoiArray);
                    EventBus.$emit(MESSAGE_SUCCESS, this.$t('request-success-poi-save'));
                    this.close();
                }).catch((error) => {
                    console.error(error);
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request-error-poi-save'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'savePointOfInterest');
                });
            } else {
                let updatedPoi = { ...this.selectedPoi };

                updatedPoi.title = this.poiTitle;
                updatedPoi.description = this.poiDescription;
                updatedPoi.categories = categories;

                this.$store.dispatch(START_LOADING, 'updatePointOfInterest');
                MapApiService.updatePointOfInterest(updatedPoi).then((res) => {
                    res.data.categories = res.data.categories.map(x => x._id);
                    let newPoiArray = this.pointOfInterests.filter(x => x._id !== updatedPoi._id);
                    newPoiArray.push(res.data);

                    newPoiArray = newPoiArray.sort((first, second) => second.likeCount - first.likeCount);

                    this.$store.dispatch(SELECT_POI, res.data);
                    this.$store.dispatch(SET_POINT_OF_INTERESTS, newPoiArray);
                    EventBus.$emit(MESSAGE_SUCCESS, this.$t('request-success-poi-save'));
                    this.close();
                }).catch((error) => {
                    console.error(error);
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request-error-poi-save'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'updatePointOfInterest');
                });
            }
        },
        close () {
            this.poiTitle = null;
            this.poiDescription = null;
            this.selectedCategories = [];
            store.dispatch(SET_ADD_MODE, false);
            store.dispatch(SET_POI_MODAL, false);
            store.dispatch(SET_ADD_MODE_LATITUDE, null);
            store.dispatch(SET_ADD_MODE_LONGITUDE, null);
        }
    }
};
</script>

<style scoped>

</style>
