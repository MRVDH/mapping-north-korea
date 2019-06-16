<template>
    <v-app id="app" v-bind:dark="darkTheme" v-cloak>
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
                flat
                @click="snackbar = false">
                Close
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

        document.getElementById('loading-text').remove();

        EventBus.$emit('mnk:start-loading', 'isuserloggedin');
        OAuthService.isUserLoggedIn().then((res) => {
            if (!res.data.isAuthenticated) {
                EventBus.$emit('mnk:start-loading', 'getrequesttoken');
                OAuthService.getRequestToken().then((res) => {
                    EventBus.$emit('mnk:oauth-request-token-received', res.data);
                }).catch(() => {
                    EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get your OAuth request token.');
                }).finally(() => {
                    EventBus.$emit('mnk:stop-loading', 'getrequesttoken');
                });
            } else {
                EventBus.$emit('mnk:start-loading', 'getUserDetails');
                OAuthService.getUserDetails().then((res) => {
                    this.$root.loggedInUser = res.data;
                }).catch(() => {
                    EventBus.$emit('mnk:message-error', 'Something went wrong while trying to get your user details.');
                }).finally(() => {
                    EventBus.$emit('mnk:stop-loading', 'getUserDetails');
                });
            }
        }).catch(() => {
            EventBus.$emit('mnk:message-error', 'Something went wrong while trying to check if you are logged in.');
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
