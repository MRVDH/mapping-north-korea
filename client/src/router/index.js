import Vue from 'vue';
import Router from 'vue-router';
import MapPage from '@/components/MapPage/MapPage';
import StatisticsPage from '@/components/StatisticsPage/StatisticsPage';
import AboutPage from '@/components/AboutPage/AboutPage';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'MapPage',
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
