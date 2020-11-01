<i18n>
{
    "en": {
        "dismiss": "Dismiss",

        "request": {
            "oauth_token": "Something went wrong while trying to get your OAuth request token.",
            "user_details": "Something went wrong while trying to get your user details.",
            "logged_in": "Something went wrong while trying to check if you are logged in."
        }
    },
    "ko": { }
}
</i18n>

<template>
    <v-app id="app" v-cloak>
        <CustomMenuLeft/>
        <CustomHeader/>
        <router-view/>
        <CustomFooter/>
        <v-snackbar
            left
            v-model="snackbar"
            :color="snackbarOptions.color"
            :timeout="snackbarOptions.timeout">
            {{ snackbarOptions.text }}
            <v-btn
                text
                @click="snackbar = false">
                {{ $t('dismiss') }}
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
import CustomMenuLeft from '@/components/navigation/CustomMenuLeft';
import CustomHeader from '@/components/navigation/CustomHeader';
import CustomFooter from '@/components/navigation/CustomFooter';
import OAuthService from '@/services/OAuthService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_INFO } from '@/events/eventTypes';
import { SET_LOGGED_IN_USER, SET_LOGIN_LINK, START_LOADING, STOP_LOADING } from "@/store/mutationTypes";

export default {
    name: 'App',
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
        // Remove the loading screen.
        document.getElementById('loading-text').remove();

        // Check if user is logged in and if so, get details. If not, get the request token.
        this.$store.dispatch(START_LOADING, 'isuserloggedin');
        OAuthService.isUserLoggedIn().then((res) => {
            if (!res.data || !res.data.isAuthenticated) {
                this.$store.dispatch(START_LOADING, 'getrequesttoken');
                OAuthService.getRequestToken().then((res) => {
                    this.$store.dispatch(SET_LOGIN_LINK, res.data);
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.oauth_token'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'getrequesttoken');
                });
            } else {
                this.$store.dispatch(START_LOADING, 'getUserDetails');
                OAuthService.getUserDetails().then((res) => {
                    this.$store.dispatch(SET_LOGGED_IN_USER, res.data);
                }).catch(() => {
                    EventBus.$emit(MESSAGE_ERROR, this.$t('request.user_details'));
                }).finally(() => {
                    this.$store.dispatch(STOP_LOADING, 'getUserDetails');
                });
            }
        }).catch(() => {
            EventBus.$emit(MESSAGE_ERROR, this.$t('request.logged_in'));
        }).finally(() => {
            this.$store.dispatch(STOP_LOADING, 'isuserloggedin');
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
    },
    components: {
        CustomMenuLeft,
        CustomHeader,
        CustomFooter
    }
};
</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>