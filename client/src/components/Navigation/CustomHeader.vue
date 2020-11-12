<template>
    <v-app-bar app clipped-right extended extension-height="7">
        <v-app-bar-nav-icon @click.stop="toggleDrawerLeft()"></v-app-bar-nav-icon>
        <v-toolbar-title>Mapping North Korea <v-icon style="vertical-align: text-bottom">mdi-arrow-right</v-icon> <span style="color: gray">{{ currentIteration.title }}</span></v-toolbar-title>
        <CustomHeaderFaq/>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="toggleDarkTheme()">
            <v-icon>invert_colors</v-icon>
        </v-btn>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>translate</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in langs"
                    :key="index"
                    @click="setLocale(item.localeCode)"
                    active-class="highlighted"
                    :class="item.localeCode === $i18n.locale ? 'highlighted' : ''"
                    >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-app-bar-nav-icon v-if="displayRightIcon" @click.stop="toggleDrawerRight()"></v-app-bar-nav-icon>
        <v-progress-linear v-if="processesWorking.length > 0" slot="extension" :indeterminate="true" class="ma-0"></v-progress-linear>
    </v-app-bar>
</template>

<script>
import CustomHeaderFaq from '@/components/Navigation/CustomHeaderFaq';
import { SET_LOCALE, TOGGLE_DARK_MODE, TOGGLE_DRAWER_LEFT, TOGGLE_DRAWER_RIGHT } from "@/store/mutationTypes";

export default {
    name: 'CustomHeader',
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
    },
    watch: {
        '$route' () {
            this.displayRightIcon = this.$router.currentRoute.name === 'MapPage';
        }
    },
    components: {
        CustomHeaderFaq
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
