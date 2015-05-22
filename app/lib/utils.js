var utils = {};

/**
*   Create array structure that acceptable by Select2
*   @return array of objects with only id and text properties
*/
utils.pluckselect2 = function(objs, keys, source) {
  if(typeof(source) == 'undefined') source = null;

  function pluckSplitByComma(obj,key){
    return key.split(',').map(function(item){return obj[item]}).filter(function(n){ return n != undefined }).join(' ');
  }
  return objs.map(function(elem){
    return {
      id     : pluckSplitByComma(elem,keys[0]),
      text   : pluckSplitByComma(elem,keys[1]),
      source : source
    };
  });
};

/**
*   Remove duplicate object in array, by checking the path within the array
*   Path is separated by dot
*   @return New array without duplication
*/
utils.removeDuplicateObjectInArray = function(arr, path){

  var arrayResult = {};

  arr.forEach(function(elem, index){
    var value = getValue(elem, path);
    if(value) arrayResult[ value ] = elem;
  });

  return Object.keys(arrayResult).map(function (key) {
    return arrayResult[key];
  });
}

/**
*   Remove duplicate value in array
*   @return New array without duplication
*/
utils.removeDuplicateValuesInArray = function(arr){
  var hash = {}, result = [];
  for ( var i = 0, l = arr.length; i < l; ++i ) {
    if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
      hash[ arr[i] ] = true;
      result.push(arr[i]);
    }
  }
  return result;
}

// Private. Only accessible from this file.
function getValue(obj, path) {

  path = path.split('.');

  for (i = 0; i < path.length - 1; i++){
    if(typeof(obj[path[i]]) === 'undefined' || obj[path[i]] === NaN || obj[path[i]] === null) return null;
    obj = obj[path[i]]
  }
  return obj[path[i]];
}

module.exports = utils;
