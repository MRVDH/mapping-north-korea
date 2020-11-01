import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import * as mt from './mutationTypes';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        darkMode: false,
        locale: `en`,
        loggedInUser: null,
        loginLink: null,
        drawerLeft: false,
        drawerRight: true,
        processesWorking: [],
        selectedSector: null
    },
    mutations: {
        [mt.TOGGLE_DARK_MODE] (state) {
            state.darkMode = !state.darkMode;
        },
        [mt.SET_LOCALE] (state, locale) {
            state.locale = locale;
        },
        [mt.SET_LOGGED_IN_USER] (state, loggedInUser) {
            state.loggedInUser = loggedInUser;
        },
        [mt.SET_LOGIN_LINK] (state, loginLink) {
            state.loginLink = loginLink;
        },
        [mt.TOGGLE_DRAWER_LEFT] (state) {
            state.drawerLeft = !state.drawerLeft;
        },
        [mt.TOGGLE_DRAWER_RIGHT] (state) {
            state.drawerRight = !state.drawerRight;
        },
        [mt.SET_DRAWER_RIGHT] (state, show) {
            state.drawerRight = show;
        },
        [mt.START_LOADING] (state, key) {
            state.processesWorking.push(key);
        },
        [mt.STOP_LOADING] (state, key) {
            state.processesWorking = state.processesWorking.filter(x => x !== key);
        },
        [mt.SELECT_SECTOR] (state, sector) {
            state.selectedSector = sector;
        }
    },
    actions: {
        [mt.TOGGLE_DARK_MODE] ({ commit }) {
            commit(mt.TOGGLE_DARK_MODE);
        },
        [mt.SET_LOCALE] ({ commit }, locale) {
            commit(mt.SET_LOCALE, locale);
        },
        [mt.SET_LOGGED_IN_USER] ({ commit }, loggedInUser) {
            commit(mt.SET_LOGGED_IN_USER, loggedInUser);
        },
        [mt.SET_LOGIN_LINK] ({ commit }, loginLink) {
            commit(mt.SET_LOGIN_LINK, loginLink);
        },
        [mt.TOGGLE_DRAWER_LEFT] ({ commit }) {
            commit(mt.TOGGLE_DRAWER_LEFT);
        },
        [mt.TOGGLE_DRAWER_RIGHT] ({ commit }) {
            commit(mt.TOGGLE_DRAWER_RIGHT);
        },
        [mt.SET_DRAWER_RIGHT] ({ commit }, show) {
            commit(mt.SET_DRAWER_RIGHT, show);
        },
        [mt.START_LOADING] ({ commit }, key) {
            commit(mt.START_LOADING, key);
        },
        [mt.STOP_LOADING] ({ commit }, key) {
            commit(mt.STOP_LOADING, key);
        },
        [mt.SELECT_SECTOR] ({ commit }, sector) {
            commit(mt.SELECT_SECTOR, sector);
        }
    },
    plugins: [new VuexPersistence({
        storage: window.localStorage,
        reducer: (state) => ({
            darkMode: state.darkMode,
            locale: state.locale
        }),
    }).plugin]
});
