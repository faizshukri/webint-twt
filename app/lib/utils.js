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

/**
*   Remove duplicate object in array, by checking the path within the array
*   Path is separated by dot
*   @return New array without duplication
*/
utils.removeDuplicateObjectInArray = function(arr, path){

    var array_keys = path.split('.');
    var arrayResult = {};

    arr.forEach(function(elem, index){
        arrayResult[ getValue(elem, array_keys) ] = elem;
    });

    return Object.keys(arrayResult).map(function (key) {
        return arrayResult[key];
    });
}

// Private. Only accessible from this file.
function getValue(obj, array_keys) {
    for (i = 0; i < array_keys.length - 1; i++)
        obj = obj[array_keys[i]];

    return obj[array_keys[i]];
}

module.exports = utils;