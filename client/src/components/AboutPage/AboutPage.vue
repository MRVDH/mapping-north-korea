<template>
    <v-content>
        <v-container id="about-page" grid-list-xs fill-height>
            <v-layout row>
                <v-flex xs12>
                    <v-card>
                        <v-card-title id="about-page-headline">
                            <h3 class="headline">Mapping one of the most isolated and unmapped countries on earth.</h3>
                        </v-card-title>
                        <v-card-text>
                            The purpose of this tool is to discover North Korea by analysing sattelite imagery and mapping everything to <a target="_blank" href="https://www.openstreetmap.org/about">OpenStreetMap</a>. Because of a lack of interest, and probably due to it being unmonetizable, other map providers (such as Google, Bing and Apple) have only mapped North Korea to a very basic level.
                        </v-card-text>
                        <v-card-title id="about-page-how-it-works">
                            <h5 class="headline">How it works</h5>
                        </v-card-title>
                        <v-card-text>
                            The map is divided into 4723 sectors at the time of writing. These sectors can be selected for editing, reviews and more. Reviews can be done by anyone who would like to, but it's encouraged to let experienced OpenStreetMap mappers do it. An OpenStreetMap account is required to edit sectors. Users can log in with the OpenStreetMap account via OAuth using the menu on the left.<br/>
                            The sectors are part of an iteration. The iteration system was added for the reason that once mapping starts, it will take a long time for the whole country to be completed. By the time the last sectors are done, the first sectors might be outdated. After completing the country a second iteration can be started for updates.<br/>
                            The application is fully dynamic, which means it can be used for any other place on earth as well. The GitHub repository can be found <a href="https://github.com/MRVDH/mapping-north-korea" target="_blank">here</a>.
                        </v-card-text>
                        <v-card-title id="about-page-attribution">
                            <h5 class="headline">Attribution</h5>
                        </v-card-title>
                        <v-card-text>
                            There several articles, languages and frameworks that I have used to create this web app. I think it's fair to give attribution and to list those items as they have significantly helped me with the development.
                            <br/><br/>
                            Back-end attribution.
                            <ul>
                                <li>The back-end is built on <a target="_blank" href="https://nodejs.org/en/">Node.js</a> using the <a target="_blank" href="https://expressjs.com/">Express.js</a> framework.</li>
                                <li>The <a target="_blank" href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a> platform (free tier) is used for running the <a target="_blank" href="https://www.mongodb.com/">MongoDB</a> instance.</li>
                                <li>npm packages include <a target="_blank" href="https://github.com/expressjs/session">express-session</a>, <a target="_blank" href="https://github.com/expressjs/body-parser">body-parser</a>, <a target="_blank" href="https://github.com/kelektiv/node-uuid">uuid</a>, <a target="_blank" href="https://github.com/jdesboeufs/connect-mongo">connect-mongo</a>, <a target="_blank" href="https://github.com/Automattic/mongoose">mongoose</a> and <a target="_blank" href="https://github.com/nfriedly/express-rate-limit">express-rate-limit</a>.</li>
                            </ul>
                            <br/>
                            Front-end attribution.
                            <ul>
                                <li>As a front-end framework <a target="_blank" href="https://vuejs.org/">Vue.js</a> is used and <a target="_blank" href="https://vuetifyjs.com/en/">Vuetify</a> is used for styling.</li>
                                <li>Icons and fonts are from <a target="_blank" href="https://fonts.google.com/">Google Fonts</a>.</li>
                                <li>Testing has been done in the <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a>, <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a>, <a target="_blank" href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a> and <a target="_blank" href="https://www.opera.com/">Opera</a> browsers.</li>
                                <li>For the light map <a target="_blank" href="https://leafletjs.com/">Leaflet</a> and a plugin <a target="_blank" href="https://github.com/leaflet-extras/leaflet-providers">Leaflet-providers</a> is used and for the dark map the awesome <a target="_blank" href="https://docs.stadiamaps.com/themes/#alidade-smooth-dark">"Alidade Smooth Dark" layer</a> of <a target="_blank" href="https://stadiamaps.com/">Stadia Maps</a> is used.</li>
                                <li><a target="_blank" href="https://github.com/axios/axios">axios</a> is used for sending requests to the server.</li>
                                <li>To transpile and build all the front-end code <a target="_blank" href="https://webpack.js.org/">webpack</a>, <a target="_blank" href="https://eslint.org/">ESLint</a> and a ton of other packages were used.</li>
                                <li>I took inspiration for the color codes of the sectors and how to get the connection strings for iD and JOSM from the <a target="_blank" href="https://github.com/hotosm/tasking-manager">HOT Tasking Manager</a>.</li>
                            </ul>
                            <br/>
                            I already had some experience building web applications with Node.js, but to get started with Webpack, Vue.js and Vuetify I used some articles and guides.
                            <ul>
                                <li>"<i>Develop awesome webapps using VueJS + Webpack (demonstrating by building a XRP ledger integration)</i>" by Wietse Wind - <a target="_blank" href="https://itnext.io/develop-awesome-webapps-using-vuejs-webpack-bda08ebb691c">link</a></li>
                                <li>"<i>Anyway, here’s how to make AJAX &amp; API calls with Vue JS</i>" by darkylmnx - <a target="_blank" href="https://itnext.io/anyway-heres-how-to-do-ajax-api-calls-with-vue-js-e71e57d5cf12">link</a></li>
                                <li>"<i>A simple EventBus to communicate between Vue.js components</i>" by Andrejs Abrickis - <a target="_blank" href="https://medium.com/@andrejsabrickis/https-medium-com-andrejsabrickis-create-simple-eventbus-to-communicate-between-vue-js-components-cdc11cd59860">link</a></li>
                                <li>And of course many many many <a target="_blank" href="https://stackoverflow.com/">Stack Overflow</a> Q&amp;As.</li>
                            </ul>
                        </v-card-text>
                        <v-card-title id="about-page-data-usage">
                            <h5 class="headline">Data usage and Privacy</h5>
                        </v-card-title>
                        <v-card-text>
                            After logging in, cookies are stored for session management. The cookie contains only your session id, but your OSM user name and OSM user id are stored server-side while the session lasts. Sessions will automatically be removed after a certain amount of time. Each time a sector is edited an 'event' is created to keep track of what happens to sectors, when and by whom. This event contains the OSM user name, OSM user id, timestamp, message and reference to said sector. Mappingnorthkorea.com does not keep ip, useragent or any other privacy sensitive logs. If users would like to have their OSM user name and id redacted or anonymised then they can send a request to the email address below.
                        </v-card-text>
                        <v-card-title id="about-page-contact">
                            <h5 class="headline">Contact</h5>
                        </v-card-title>
                        <v-card-text>
                            You can contact me at <a href="mailto:info@maartenvandenhoven.com">info@maartenvandenhoven.com</a> for questions about this project and anything else or visit my website at <a href="https://maartenvandenhoven.com">https://maartenvandenhoven.com</a>. Alternatively I am also reachable on OpenStreetMap by the username <a href="https://www.openstreetmap.org/user/Artemis64" target="_blank">Artmemis64</a> or on GitHub <a href="https://github.com/MRVDH/mapping-north-korea" target="_blank">here</a>.
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-navigation-drawer
        right
        clipped
        permanent
        mobile-break-point="0"
        app>
            <v-list>
                <v-list-tile>
                    <v-list-tile-action target="_blank" href="#about-page-headline">Header</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action target="_blank" href="#about-page-how-it-works">How it works</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action target="_blank" href="#about-page-attribution">Attribution</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action target="_blank" href="#about-page-data-usage">Data usage and Privacy</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action target="_blank" href="#about-page-contact">Contact</v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </v-content>
</template>

<script>
export default {
    name: 'AboutPage',
    data () {
        return { };
    }
};
</script>

<style>
    #about-page .v-card-text {
        text-align: justify;
    }
    #about-page .v-card__title {
        padding-bottom: 0px !important;
    }
    #about-page ul {
        margin-top: 10px;
    }
    #about-page a {
        color: #6baff3;
    }
</style>
