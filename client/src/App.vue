<i18n>
{
    "en": {
        "dismiss": "Dismiss",

        "request": {
            "user_details": "Something went wrong while trying to get your user details.",
            "logged_in": "Something went wrong while trying to check if you are logged in.",
            "current_iteration": "Something went wrong while trying to get the current iteration.",
            "categories": "An error occurd while retrieving the categories"
        }
    },
    "ko": {
        "dismiss": null,

        "request": {
            "user_details": null,
            "logged_in": null,
            "current_iteration": null,
            "categories": null
        }
    }
}
</i18n>

<template>
    <v-app
        v-cloak
        id="app"
        >
        <CustomMenuLeft />
        <CustomHeader />
        <router-view />
        <CustomFooter />
        <v-snackbar
            v-model="snackbar"
            left
            :color="snackbarOptions.color"
            :timeout="snackbarOptions.timeout"
            >
            {{ snackbarOptions.text }}
            <v-btn
                text
                @click="snackbar = false"
                >
                {{ $t('dismiss') }}
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
import CustomMenuLeft from '@/components/Navigation/MenuLeft';
import CustomHeader from '@/components/Navigation/CustomHeader';
import CustomFooter from '@/components/Navigation/CustomFooter';
import OAuthService from '@/services/OAuthService';
import MapApiService from '@/services/MapApiService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_INFO } from '@/events/eventTypes';
import { SET_LOGGED_IN_USER, START_LOADING, STOP_LOADING, SET_CURRENT_ITERATION, SET_POINT_OF_INTEREST_CATEGORIES } from "@/store/mutationTypes";

export default {
    name: 'App',
    components: {
        CustomMenuLeft,
        CustomHeader,
        CustomFooter
    },
    data: () => {
        return {
            snackbar: false,
            snackbarOptions: {
                color: '',
                timeout: 5000,
                text: ''
            }
        };
    },
    computed: {
        locale () {
            return this.$store.state.locale;
        },
        darkMode () {
            return this.$store.state.darkMode;
        }
    },
    watch: {
        locale (newValue) {
            this.$i18n.locale = newValue;
        },
        darkMode (newValue) {
            this.$vuetify.theme.dark = newValue;
        }
    },
    mounted () {
        this.$i18n.locale = this.locale;
        this.$vuetify.theme.dark = this.darkMode;

        // Remove the loading screen.
        document.getElementById('loading-text').remove();

        // Check if user is logged in and if so, get details. If not, get the request token.
        this.$store.dispatch(START_LOADING, 'isuserloggedin');
        OAuthService.isUserLoggedIn().then((res) => {
            if (!res.data || !res.data.isAuthenticated) {
                return;
            }

            this.$store.dispatch(START_LOADING, 'getUserDetails');
            OAuthService.getUserDetails().then((res) => {
                this.$store.dispatch(SET_LOGGED_IN_USER, res.data);
            }).catch((error) => {
                console.error(error);
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.user_details'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'getUserDetails');
            });
        }).catch((error) => {
            console.error(error);
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.logged_in'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'isuserloggedin');
        });
        
        // Get the current iteration
        this.$store.dispatch(START_LOADING, 'getCurrentIteration');
        MapApiService.getCurrentIteration().then((res) => {
            this.$store.dispatch(SET_CURRENT_ITERATION, res.data);
        }).catch((error) => {
            console.error(error);
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.current_iteration'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'getCurrentIteration');
        });

        // Get the poi categories
        this.$store.dispatch(START_LOADING, 'loadPointOfInterestCategories');
        MapApiService.getAllPointOfInterestCategories().then((res) => {
            this.$store.dispatch(SET_POINT_OF_INTEREST_CATEGORIES, res.data);
        }).catch((error) => {
            console.error(error);
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.categories'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'loadPointOfInterestCategories');
        });

        // Set the toast event listeners.
        EventBus.$on(MESSAGE_SUCCESS, (text) => {
            this.snackbar = true;
            this.snackbarOptions.color = 'success';
            this.snackbarOptions.text = text;
        });
        EventBus.$on(MESSAGE_INFO, (text) => {
            this.snackbar = true;
            this.snackbarOptions.color = 'info';
            this.snackbarOptions.text = text;
        });
        EventBus.$on(MESSAGE_ERROR, (text) => {
            this.snackbar = true;
            this.snackbarOptions.color = 'error';
            this.snackbarOptions.text = text;
        });
    }
};
</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>