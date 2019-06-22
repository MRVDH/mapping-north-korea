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
        <v-toolbar-side-icon v-if="displayRightIcon" @click.stop="toggleDrawerRight()"></v-toolbar-side-icon>
        <v-progress-linear v-if="processesWorking.length > 0" slot="extension" :indeterminate="true" class="ma-0"></v-progress-linear>
        <v-dialog v-model="infoDialog" max-width="700px">
            <v-card id="info-dialog">
                <v-card-title>
                    <h1>New to mappingnorthkorea.com?</h1>
                    Read some frequently asked questions here.
                </v-card-title>
                <v-card-text>
                    <h3>What is this?</h3>
                    <p>
                        This is MappingNorthKorea.com, a collaborative effort to map one of the most isolated countries on earth. Read more on the about page <a @click.stop="infoDialog = false" href="/#/about">here</a>.
                    </p>
                    <h3>Why are all the buttons disabled?</h3>
                    <p>
                        You probably haven't logged in yet. You can browse sectors without an account, but to map you will need an OpenStreetMap account. If you don't have one, sign up <a href="https://www.openstreetmap.org/user/new" target="_blank">here</a>. If you have an account, open the left menu by pressing the three-lined-button in the top left corner and click the login button. If only the Map button is disabled but the edit button is clickable, then the sector is probably not in an editable state. Check the question below.
                    </p>
                    <h3>Why is the Map button disabled?</h3>
                    <p>
                        The sector that you selected is probably not in an editable state. Use the Edit button to switch the sector to either Being edited or Being reviewed. If the edit button is disabled then you are probably not logged in yet. Check the question above.
                    </p>
                    <h3>The sector I am editing is too much work or too big. How do I split a sector into smaller sectors?</h3>
                    <p>
                        To avoid abuse of the system currently only people whom have administrator rights are allowed to do this. Please send an email to <a href="mailto:info@maartenvandenhoven.com">info@maartenvandenhoven.com</a> for a split request and include the sector id. The sector id can be found after selecting a sector.
                    </p>
                    <h3>Where can I contribute code or report bugs and enhancements?</h3>
                    <p>
                        There is a public GitHub repository <a href="https://github.com/MRVDH/mapping-north-korea" target="_blank">here</a> where you can contribute either by writing code or by reporting bugs and enhancements. If you don't have a GitHub account or with to quickly send me a message about a bug or enhancement you can send me an email at the email address above.
                    </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outline @click.stop="infoDialog = false">Got it</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-toolbar>
</template>

<script>
import EventBus from '@/services/EventBus';

export default {
    name: 'CustomHeader',
    data () {
        return {
            processesWorking: [],
            displayRightIcon: this.$router.currentRoute.name === 'MapPage',
            infoDialog: false
        };
    },
    mounted () {
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
        }
    },
    watch: {
        '$route' () {
            this.displayRightIcon = this.$router.currentRoute.name === 'MapPage';
        }
    }
};
</script>

<style>
    .v-toolbar__extension {
        padding: 0 !important;
    }
    #info-dialog a {
        color: #6baff3;
    }
</style>
