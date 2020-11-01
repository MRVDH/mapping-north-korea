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
import EventBus from '@/services/EventBus';
export default {
    name: 'App',
    data: () => {
        return {
            darkTheme: false,
            snackbar: false,
            snackbarOptions: {
                color: '',
                timeout: 5000,
                text: ''
            }
        };
    },
    mounted () {
        this.$root.loggedInUser = null;
        if (localStorage.darkTheme) {
            this.darkTheme = localStorage.darkTheme === 'true';
        } else {
            localStorage.darkTheme = false;
            this.darkTheme = false;
        }
        if (localStorage.locale) {
            this.$i18n.locale = localStorage.locale;
            EventBus.$emit('mnk:set-locale', localStorage.locale);
        } else {
            localStorage.locale = this.$i18n.locale;
        }
        EventBus.$on('mnk:set-locale', (localeCode) => {
            this.$i18n.locale = localeCode;
            localStorage.locale = localeCode;
        });
        document.getElementById('loading-text').remove();
        EventBus.$emit('mnk:start-loading', 'isuserloggedin');
        OAuthService.isUserLoggedIn().then((res) => {
            if (!res.data.isAuthenticated) {
                EventBus.$emit('mnk:start-loading', 'getrequesttoken');
                OAuthService.getRequestToken().then((res) => {
                    EventBus.$emit('mnk:oauth-request-token-received', res.data);
                }).catch(() => {
                    EventBus.$emit('mnk:message-error', this.$t('request.oauth_token'));
                }).finally(() => {
                    EventBus.$emit('mnk:stop-loading', 'getrequesttoken');
                });
            } else {
                EventBus.$emit('mnk:start-loading', 'getUserDetails');
                OAuthService.getUserDetails().then((res) => {
                    this.$root.loggedInUser = res.data;
                }).catch(() => {
                    EventBus.$emit('mnk:message-error', this.$t('request.user_details'));
                }).finally(() => {
                    EventBus.$emit('mnk:stop-loading', 'getUserDetails');
                });
            }
        }).catch(() => {
            EventBus.$emit('mnk:message-error', this.$t('request.logged_in'));
        }).finally(() => {
            EventBus.$emit('mnk:stop-loading', 'isuserloggedin');
        });
        EventBus.$on('mnk:toggle-dark-theme', () => {
            this.darkTheme = !this.darkTheme;
        });
        EventBus.$on('mnk:message-success', (text) => {
            this.snackbar = true;
            this.snackbarOptions.color = 'success';
            this.snackbarOptions.text = text;
        });
        EventBus.$on('mnk:message-info', (text) => {
            this.snackbar = true;
            this.snackbarOptions.color = 'info';
            this.snackbarOptions.text = text;
        });
        EventBus.$on('mnk:message-error', (text) => {
            this.snackbar = true;
            this.snackbarOptions.color = 'error';
            this.snackbarOptions.text = text;
        });
    },
    watch: {
        darkTheme (newSetting) {
            localStorage.darkTheme = newSetting;
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
        }
    },
    components: {
        CustomMenuLeft,
        CustomHeader,
        CustomFooter
    }
};
</script>

<style scoped>
    [v-cloak] { display:none; }
</style>