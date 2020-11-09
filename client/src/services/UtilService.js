export default {
    calculateDateOutput (time) {
        if (!time) {
            return;
        }

        const today = new Date();
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (time.getDate() === today.getDate() &&
            time.getMonth() === today.getMonth() &&
            time.getFullYear() === today.getFullYear()) {
            return 'today';
        } else if (time.getDate() === yesterday.getDate() &&
            time.getMonth() === yesterday.getMonth() &&
            time.getFullYear() === yesterday.getFullYear()) {
            return 'yesterday';
        } else {
            return time.toLocaleString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
        }
    }
};