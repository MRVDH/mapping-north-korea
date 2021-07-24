<i18n>
{
    "en": {
        "title": "Add Point of Interest",
        "save": "Save",
        "close": "Close",
        "poi-title": "Title",
        "description": "Description",
        "categories": "Categories",
        "request-error-categories": "An error occurd while retrieving the categories",
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
        "request-error-categories": null,
        "input-field-error": null,
        "request-success-poi-save": null,
        "request-error-poi-save": null
    }
}
</i18n>

<template>
    <v-dialog
        v-model="addModeModal"
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
                    @click="addPoi()"
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
import { START_LOADING, STOP_LOADING, SET_ADD_MODE, SET_ADD_MODE_MODAL, SET_ADD_MODE_LONGITUDE, SET_ADD_MODE_LATITUDE } from "@/store/mutationTypes";

export default {
    name: 'AddPointOfInterestModal',
    data () {
        return {
            poiTitle: null,
            poiDescription: null,
            selectedCategories: [],
            categories: [],
            rawCategories: []
        };
    },
    computed: {
        addModeModal () {
            return this.$store.state.addModeModal;
        }
    },
    watch: {
        addModeModal () {
            if (this.addModeModal) {
                this.$store.dispatch(START_LOADING, 'loadPointOfInterestCategories');
                MapApiService.getAllPointOfInterestCategories().then((res) => {
                    this.rawCategories = res.data;
                    
                    for (let category of res.data) {
                        this.categories.push(category.title);
                    }
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request-error-categories'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'loadPointOfInterestCategories');
                });
            }
        }
    },
    methods: {
        addPoi () {
            if (!this.poiTitle || !this.selectedCategories.length) {
                EventBus.$emit(MESSAGE_INFO, this.$t('input-field-error'));
                return;
            }

            let categories = this.selectedCategories.map(x => {
                return this.rawCategories.find(y => y.title === x);
            });

            MapApiService.addPointOfInterests({
                title: this.poiTitle,
                description: this.poiDescription,
                longitude: this.$store.state.addModeLongitude,
                latitude: this.$store.state.addModeLatitude,
                categories
            }).then(() => {
                EventBus.$emit(MESSAGE_SUCCESS, this.$t('request-success-poi-save'));
                this.close();
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request-error-poi-save'));
            });
        },
        close () {
            this.poiTitle = null;
            this.poiDescription = null;
            this.selectedCategories = [];
            store.dispatch(SET_ADD_MODE, false);
            store.dispatch(SET_ADD_MODE_MODAL, false);
            store.dispatch(SET_ADD_MODE_LATITUDE, null);
            store.dispatch(SET_ADD_MODE_LONGITUDE, null);
        }
    }
};
</script>

<style scoped>

</style>
