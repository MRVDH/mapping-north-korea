import axios from 'axios';

export default {
    sendJOSMCommand (url, params) {
        url += '?' + Object
            .keys(params)
            .map(function (key) {
                return key + '=' + params[key];
            })
            .join('&');

        return axios.get(url);
    }
};
