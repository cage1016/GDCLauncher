'use strict';


var GDCLStorage = function () {
};

GDCLStorage.prototype.set = function (key, value) {
    /* if the value is an object, stringify it to save it in localStorage */
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
};


GDCLStorage.prototype.get = function (key) {
    var data;

    if (!this.hasData(key)) {
        return false;
    }

    data = localStorage[key];

    /* if the data is JSON, try to parse */
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
};


GDCLStorage.prototype.save = function (objects) {
    for (var key in objects) {
        this.set(key, objects[key]);
    }
};

GDCLStorage.prototype.hasData = function (key) {
    return !!localStorage[key] && !!localStorage[key].length;
};



module.exports = new GDCLStorage();
