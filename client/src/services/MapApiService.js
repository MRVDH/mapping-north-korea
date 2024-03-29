import axios from 'axios';

var host = window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'https://www.mappingnorthkorea.com';

export default {
    getAllSectors () {
        return axios.get(host + '/api/sector');
    },
    getSectorsBySectorSetId (sectorSetId) {
        return axios.get(host + '/api/sector/sectorset/' + sectorSetId);
    },
    getAllSectorSetsByIterationId (iterationId) {
        return axios.get(host + '/api/sectorset/iteration/' + iterationId);
    },
    recountSectorSetCounts (sectorSetId) {
        return axios.put(host + '/api/sectorset/recount/' + sectorSetId);
    },
    getAllStates () {
        return axios.get(host + '/api/state');
    },
    updateSector (data) {
        return axios.put(host + '/api/sector/' + data.sector._id, data);
    },
    addEvent (data) {
        return axios.post(host + '/api/event/add', data);
    },
    getAllEvents (amount) {
        return axios.get(host + '/api/event/all/' + amount);
    },
    getEventsBySectorId (id) {
        return axios.get(host + '/api/event/sectorid/' + id);
    },
    getCurrentIteration () {
        return axios.get(host + '/api/iteration/current');
    },
    deleteSectorById (id) {
        return axios.delete(host + '/api/sector/' + id);
    },
    splitSectorById (id) {
        return axios.get(host + '/api/sector/split/' + id);
    },
    getAllPointOfInterests () {
        return axios.get(host + '/api/pointofinterest');
    },
    getAllPointOfInterestCategories () {
        return axios.get(host + '/api/pointofinterestcategories');
    },
    addPointOfInterest (data) {
        return axios.post(host + '/api/pointofinterest', data);
    },
    deletePointOfInterest (id) {
        return axios.delete(host + '/api/pointofinterest/' + id);
    },
    updatePointOfInterest (data) {
        return axios.put(host + '/api/pointofinterest', data);
    },
    likePointOfInterest (id) {
        return axios.post(host + '/api/pointofinterestlike/' + id);
    }
};
