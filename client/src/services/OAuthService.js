import axios from 'axios';

var host = window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'https://mappingnorthkorea.com';

export default {
    getRequestToken () {
        return axios.post(host + '/api/osm/oauth/request');
    },
    isUserLoggedIn () {
        return axios.get(host + '/api/osm/oauth/isauthenticated');
    },
    getUserDetails () {
        return axios.get(host + '/api/osm/getuserdetails');
    }
};
