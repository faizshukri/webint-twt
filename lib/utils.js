var utils = {};

utils.pluckselect2 = function(obj, key) {
    return obj.map(function(elem){
        return {
            id   : elem[key[0]],
            text : elem[key[1]]
        };
    });
};

module.exports = utils;