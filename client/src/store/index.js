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
        drawerLeft: false,
        drawerRight: true,
        processesWorking: [],
        selectedSector: null,
        currentIteration: null,
        sectorSets: [],
        recentEvents: [],
        selectedSectorSet: null,
        sectorEvents: [],
        pointOfInterests: [],
        poisVisible: true
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
        [mt.TOGGLE_DRAWER_LEFT] (state) {
            state.drawerLeft = !state.drawerLeft;
        },
        [mt.TOGGLE_DRAWER_RIGHT] (state) {
            state.drawerRight = !state.drawerRight;
        },
        [mt.SET_DRAWER_RIGHT] (state, show) {
            state.drawerRight = show;
        },
        [mt.SET_DRAWER_LEFT] (state, show) {
            state.drawerLeft = show;
        },
        [mt.START_LOADING] (state, key) {
            state.processesWorking.push(key);
        },
        [mt.STOP_LOADING] (state, key) {
            state.processesWorking = state.processesWorking.filter(x => x !== key);
        },
        [mt.SELECT_SECTOR] (state, sector) {
            state.selectedSector = sector;
        },
        [mt.SET_CURRENT_ITERATION] (state, iteration) {
            state.currentIteration = iteration;
        },
        [mt.SET_SECTOR_SETS] (state, sectorSets) {
            state.sectorSets = sectorSets;
        },
        [mt.SET_RECENT_EVENTS] (state, recentEvents) {
            state.recentEvents = recentEvents;
        },
        [mt.ADD_TO_RECENT_EVENTS] (state, recentEvent) {
            state.recentEvents.unshift(recentEvent);
        },
        [mt.SELECT_SECTOR_SET] (state, sectorSet) {
            state.selectedSectorSet = sectorSet;
        },
        [mt.SET_SECTOR_EVENTS] (state, sectorEvents) {
            state.sectorEvents = sectorEvents;
        },
        [mt.SET_POINT_OF_INTERESTS] (state, pointOfInterests) {
            state.pointOfInterests = pointOfInterests;
        },
        [mt.SET_POIS_VISIBLE] (state, poisVisible) {
            state.poisVisible = poisVisible;
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
        [mt.TOGGLE_DRAWER_LEFT] ({ commit }) {
            commit(mt.TOGGLE_DRAWER_LEFT);
        },
        [mt.TOGGLE_DRAWER_RIGHT] ({ commit }) {
            commit(mt.TOGGLE_DRAWER_RIGHT);
        },
        [mt.SET_DRAWER_RIGHT] ({ commit }, show) {
            commit(mt.SET_DRAWER_RIGHT, show);
        },
        [mt.SET_DRAWER_LEFT] ({ commit }, show) {
            commit(mt.SET_DRAWER_LEFT, show);
        },
        [mt.START_LOADING] ({ commit }, key) {
            commit(mt.START_LOADING, key);
        },
        [mt.STOP_LOADING] ({ commit }, key) {
            commit(mt.STOP_LOADING, key);
        },
        [mt.SELECT_SECTOR] ({ commit }, sector) {
            commit(mt.SELECT_SECTOR, sector);
        },
        [mt.SET_CURRENT_ITERATION] ({ commit }, iteration) {
            commit(mt.SET_CURRENT_ITERATION, iteration);
        },
        [mt.SET_SECTOR_SETS] ({ commit }, sectorSets) {
            commit(mt.SET_SECTOR_SETS, sectorSets);
        },
        [mt.SET_RECENT_EVENTS] ({ commit }, recentEvents) {
            commit(mt.SET_RECENT_EVENTS, recentEvents);
        },
        [mt.ADD_TO_RECENT_EVENTS] ({ commit }, recentEvent) {
            commit(mt.ADD_TO_RECENT_EVENTS, recentEvent);
        },
        [mt.SELECT_SECTOR_SET] ({ commit }, sectorSet) {
            commit(mt.SELECT_SECTOR_SET, sectorSet);
        },
        [mt.SET_SECTOR_EVENTS] ({ commit }, sectorEvents) {
            commit(mt.SET_SECTOR_EVENTS, sectorEvents);
        },
        [mt.SET_POINT_OF_INTERESTS] ({ commit }, pointOfInterests) {
            commit(mt.SET_POINT_OF_INTERESTS, pointOfInterests);
        },
        [mt.SET_POIS_VISIBLE] ({ commit }, poisVisible) {
            commit(mt.SET_POIS_VISIBLE, poisVisible);
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
