<i18n>
{
    "en": {
        "button": {
            "login": "Login"
        },
        "menu": {
            "map": "Map",
            "about": "About"
        },
        "iteration": "Iteration: {iterationTitle}",

        "request": {
            "oauth_token": "Something went wrong while trying to get your OAuth request token."
        }
    },
    "ko": {
        "button": {
            "login": "로그인"
        },
        "menu": {
            "map": "지도",
            "about": "정보"
        },
        "iteration": "반복: {iterationTitle}",

        "request": {
            "oauth_token": null
        }
    }
}
</i18n>

<template>
    <v-navigation-drawer
        v-model="drawerLeft"
        app
        temporary
        clipped
        width="300"
        >
        <v-toolbar
            flat
            class="transparent"
            >
            <v-list class="pa-0">
                <v-list-item
                    v-if="loggedInUser"
                    class="pa-0"
                    :href="'https://www.openstreetmap.org/user/' + loggedInUser.name"
                    target="_blank"
                    >
                    <v-list-item-content>
                        <v-list-item-title id="logged-in-user-name">{{ loggedInUser.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                    v-else
                    class="pa-0"
                    >
                    <v-list-item-action>
                        <v-btn
                            color="info"
                            :href="loginLink"
                            :disabled="!loginLink"
                            >
                            {{ $t('button.login') }}
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-toolbar>
        <v-list>
            <v-divider />
            <v-list-item :to="{ path: '/map' }">
                <v-list-item-action>
                    <v-icon>dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('menu.map') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <!--<v-list-item :to="{ path: '/stats' }">
                <v-list-item-action>
                    <v-icon>insert_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Statistics</v-list-item-title>
                </v-list-item-content>
            </v-list-item>-->
            <v-list-item :to="{ path: '/about' }">
                <v-list-item-action>
                    <v-icon>info_outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('menu.about') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list v-if="currentIteration">
            <v-divider />
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('iteration', { iterationTitle: currentIteration.title }) }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-progress-linear
                        v-if="sectorTotalCount > 0"
                        v-model="totalPercentageDone"
                        />
                </v-list-item-content>
                <v-list-item-action style="padding-left: 10px;">
                    <span>{{ sectorDoneCount }} / {{ sectorTotalCount }}</span>
                </v-list-item-action>
            </v-list-item>
        </v-list>
        <a
            class="pl-4"
            href="https://www.buymeacoffee.com/MRVDH"
            target="_blank"
            >
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=MRVDH&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00">
        </a>
        <iframe
            src="https://github.com/sponsors/MRVDH/button"
            title="Sponsor MRVDH"
            class="ml-4 mt-4"
            height="35"
            width="116"
            style="border: 0;"
            />
    </v-navigation-drawer>
</template>

<script>
import OAuthService from '@/services/OAuthService';
import EventBus from '@/events/EventBus';
import { MESSAGE_ERROR } from '@/events/eventTypes';
import { SET_DRAWER_LEFT, START_LOADING, STOP_LOADING } from "@/store/mutationTypes";

export default {
    name: 'MenuLeft',
    data () {
        return {
            loginLink: null
        };
    },
    computed: {
        drawerLeft: {
            set (newValue) {
                this.$store.commit(SET_DRAWER_LEFT, newValue);
            },
            get () {
                return this.$store.state.drawerLeft;
            }
        },
        sectorSets () {
            return this.$store.state.sectorSets;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        },
        currentIteration () {
            return this.$store.state.currentIteration;
        },
        totalPercentageDone () {
            var percentageDone = (this.sectorDoneCount * 100) / this.sectorTotalCount;
            return percentageDone < 1 ? 1 : percentageDone;
        },
        sectorTotalCount () {
            return this.sectorSets.reduce((prev, curr) => prev + curr.totalCount, 0);
        },
        sectorDoneCount () {
            return this.sectorSets.reduce((prev, curr) => prev + curr.completedCount, 0);
        }
    },
    watch: {
        drawerLeft (drawerLeft) {
            if (this.loginLink || !drawerLeft || this.loggedInUser) {
                return;
            }

            this.$store.dispatch(START_LOADING, 'getrequesttoken');
            OAuthService.getRequestToken().then((res) => {
                this.loginLink = res.data;
            }).catch(() => {
                EventBus.$emit(MESSAGE_ERROR, this.$t('request.oauth_token'));
            }).finally(() => {
                this.$store.dispatch(STOP_LOADING, 'getrequesttoken');
            });
        }
    }
};
</script>