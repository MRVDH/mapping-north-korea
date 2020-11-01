import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App';
import router from './router/index.js';
import i18n from './i18n';
import 'leaflet/dist/leaflet.css';
import store from './store';

Vue.config.productionTip = false;

new Vue({
    router,
    vuetify,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');
