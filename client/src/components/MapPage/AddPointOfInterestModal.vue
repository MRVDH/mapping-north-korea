<i18n>
{
    "en": {
        "title": "Add Point of Interest",
        "save": "Save",
        "close": "Close",
        "poi-title": "Title",
        "description": "Description",
        "categories": "Categories",
        "request-error-categories": "An error occurd while retrieving the categories"
    },
    "ko": {
        "title": null,
        "save": null,
        "close": null,
        "poi-title": null,
        "description": null,
        "categories": null,
        "request-error-categories": null
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
                                :label="$t('poi-title') + '*'"
                                required
                                />
                            <v-textarea
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
import { MESSAGE_ERROR } from '@/events/eventTypes';
import store from '@/store';
import { START_LOADING, STOP_LOADING, SET_ADD_MODE, SET_ADD_MODE_MODAL } from "@/store/mutationTypes";

export default {
    name: 'AddPointOfInterestModal',
    data () {
        return {
            poiName: null,
            selectedCategories: [],
            categories: []
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
            this.close();
        },
        close () {
            this.poiName = null;
            this.selectedCategories = [];
            store.dispatch(SET_ADD_MODE, false);
            store.dispatch(SET_ADD_MODE_MODAL, false);
        }
    }
};
</script>

<style scoped>

</style>
