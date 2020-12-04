<template>
    <v-app-bar
        app
        clipped-right
        extended
        extension-height="7"
        >
        <v-app-bar-nav-icon @click="toggleDrawerLeft()" />
        <v-toolbar-title>
            Mapping North Korea 
            <v-icon
                v-if="currentIteration"
                style="vertical-align: text-bottom"
                >
                mdi-arrow-right
            </v-icon>
            <span
                v-if="currentIteration"
                style="color: gray"
                >
                {{ currentIteration.title }}
            </span>
        </v-toolbar-title>
        <CustomHeaderFaq />
        <v-spacer />
        <v-btn
            icon
            @click="toggleDarkTheme()"
            >
            <v-icon>invert_colors</v-icon>
        </v-btn>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    >
                    <v-icon>translate</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in langs"
                    :key="index"
                    active-class="highlighted"
                    :class="item.localeCode === $i18n.locale ? 'highlighted' : ''"
                    @click="setLocale(item.localeCode)"
                    >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-app-bar-nav-icon
            v-if="displayRightIcon"
            @click="toggleDrawerRight()"
            />
        <v-progress-linear
            v-if="processesWorking.length > 0"
            :indeterminate="true"
            class="ma-0"
            />
    </v-app-bar>
</template>

<script>
import CustomHeaderFaq from '@/components/Navigation/HeaderFaq';
import { SET_LOCALE, TOGGLE_DARK_MODE, TOGGLE_DRAWER_LEFT, TOGGLE_DRAWER_RIGHT } from "@/store/mutationTypes";

export default {
    name: 'CustomHeader',
    components: {
        CustomHeaderFaq
    },
    data () {
        return {
            displayRightIcon: this.$router.currentRoute.name === 'MapPage',
            langs: [
                {
                    title: 'English',
                    localeCode: 'en',
                    active: true
                },
                {
                    title: '한국어',
                    localeCode: 'ko',
                    active: false
                }
            ]
        };
    },
    computed: {
        processesWorking () {
            return this.$store.state.processesWorking;
        },
        currentIteration () {
            return this.$store.state.currentIteration;
        }
    },
    watch: {
        '$route' () {
            this.displayRightIcon = this.$router.currentRoute.name === 'MapPage';
        }
    },
    methods: {
        toggleDrawerLeft: function () {
            this.$store.dispatch(TOGGLE_DRAWER_LEFT);
        },
        toggleDrawerRight: function () {
            this.$store.dispatch(TOGGLE_DRAWER_RIGHT);
        },
        toggleDarkTheme: function () {
            this.$store.dispatch(TOGGLE_DARK_MODE);
        },
        setLocale: function (localeCode) {
            this.$store.dispatch(SET_LOCALE, localeCode);
        }
    }
};
</script>

<style>
    .v-toolbar__extension {
        padding: 0 !important;
    }
    .highlighted {
        color: rgb(25, 118, 210);
    }
</style>
