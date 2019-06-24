<template>
    <v-toolbar app clipped-right extended extension-height="7">
        <v-toolbar-side-icon @click.stop="toggleDrawerLeft()"></v-toolbar-side-icon>
        <v-toolbar-title>Mapping North Korea</v-toolbar-title>
        <v-btn icon @click.stop="infoDialog = true">
            <v-icon>help_outline</v-icon>
        </v-btn>
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
                <v-list-tile
                    v-for="(item, index) in langs"
                    :key="index"
                    @click="setLocale(item.localeCode)"
                    active-class="highlighted"
                    :class="item.localeCode === $i18n.locale ? 'highlighted' : ''"
                    >
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-toolbar-side-icon v-if="displayRightIcon" @click.stop="toggleDrawerRight()"></v-toolbar-side-icon>
        <v-progress-linear v-if="processesWorking.length > 0" slot="extension" :indeterminate="true" class="ma-0"></v-progress-linear>
        <CustomHeaderFaq/>
    </v-toolbar>
</template>

<script>
import CustomHeaderFaq from '@/components/navigation/CustomHeaderFaq';
import EventBus from '@/services/EventBus';

export default {
    name: 'CustomHeader',
    data () {
        return {
            processesWorking: [],
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
    mounted () {
        EventBus.$on('mnk:set-locale', (localeCode) => {
            this.$i18n.locale = localeCode;
        });
        EventBus.$on('mnk:start-loading', this.addLoading);
        EventBus.$on('mnk:stop-loading', this.removeLoading);
    },
    methods: {
        toggleDrawerLeft: function () {
            EventBus.$emit('mnk:toggle-drawer-left');
        },
        toggleDrawerRight: function () {
            EventBus.$emit('mnk:toggle-drawer-right');
        },
        toggleDarkTheme: function () {
            EventBus.$emit('mnk:toggle-dark-theme', localStorage.darkTheme !== 'true');
        },
        addLoading: function (id) {
            this.processesWorking.push(id);
        },
        removeLoading: function (id) {
            this.processesWorking = this.processesWorking.filter(pw => pw !== id);
        },
        setLocale: function (localeCode) {
            EventBus.$emit('mnk:set-locale', localeCode);
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
