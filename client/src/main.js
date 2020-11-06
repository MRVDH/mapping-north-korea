import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from '@/App';
import router from '@/router';
import i18n from '@/i18n';
import 'leaflet/dist/leaflet.css';
import store from '@/store';

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    vuetify,
    i18n,
    render: h => h(App)
}).$mount('#app');
