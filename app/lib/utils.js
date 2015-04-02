var utils = {};

/**
*   Create array structure that acceptable by Select2
*   @return array of objects with only id and text properties
*/
utils.pluckselect2 = function(obj, key) {
    return obj.map(function(elem){
        return {
            id   : elem[key[0]],
            text : elem[key[1]]
        };
    });
};

module.exports = utils;