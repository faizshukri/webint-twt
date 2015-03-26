var search = {};

search.search_name = function(name){

}

search.search_coordinates = function(latitude, longitude){

}

search.pluckselect2 = function(obj, key) {
    return obj.map(function(elem){
        return {
            id   : elem[key[0]],
            text : elem[key[1]]
        };
    });
};

module.exports = search;