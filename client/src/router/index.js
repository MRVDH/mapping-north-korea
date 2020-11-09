import Vue from 'vue';
import Router from 'vue-router';
import MapPage from '../components/MapPage/MapPage';
import StatisticsPage from '../components/StatisticsPage/StatisticsPage';
import AboutPage from '../components/AboutPage/AboutPage';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: { name: 'MapPage' }
        },
        {
            path: '/map',
            name: 'MapPage',
            component: MapPage
        },
        {
            path: '/map/sector/:sectorId',
            name: 'MapPageSector',
            component: MapPage
        },
        {
            path: '/map/sectorset/:sectorSetId',
            name: 'MapPageSectorSet',
            component: MapPage
        },
        {
            path: '/stats',
            name: 'Statistics',
            component: StatisticsPage
        },
        {
            path: '/about',
            name: 'About',
            component: AboutPage
        }
    ]
});
