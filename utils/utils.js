const fxp = require("fast-xml-parser");

module.exports = {
    getTime: () => {
        var datenow = new Date();
        return String(datenow.getHours()).padStart(2, "0") + ":" + String(datenow.getMinutes()).padStart(2, "0") + ":" + String(datenow.getSeconds()).padStart(2, "0") + "." + String(datenow.getMilliseconds()).padStart(3, "0");
    },
    escapeXml: (unsafe) => {
        return unsafe.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    },
    getNewNodeIds: (body) => {
        var newIds = [];
        var jsonBody = fxp.parse(body, { ignoreAttributes: false });
        if (Array.isArray(jsonBody.diffResult.node)) {
            for (var node of jsonBody.diffResult.node) {
                console.log(node);
                newIds.push(node["@_new_id"]);
            }
        } else {
            newIds.push(jsonBody.diffResult.node["@_new_id"]);
        }
        return newIds;
    },

    c: {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",

        FgBlack: "\x1b[30m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m",

        BgBlack: "\x1b[40m",
        BgRed: "\x1b[41m",
        BgGreen: "\x1b[42m",
        BgYellow: "\x1b[43m",
        BgBlue: "\x1b[44m",
        BgMagenta: "\x1b[45m",
        BgCyan: "\x1b[46m",
        BgWhite: "\x1b[47m"
    }
};