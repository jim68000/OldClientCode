// turns the non-standard date format returned to milliseconds
// to get over Chrome's dictionary order date sorting
// Crufty

var date_validator = function(str) { 
	try {
		parseInt(str) 
	} catch (e) {
		str = (new Date(str.split(" ")[0].split("/")[2], str.split(" ")[0].split("/")[1], str.split(" ")[0].split("/")[0], str.split(" ")[1].split(":")[0], str.split(" ")[1].split(":")[1], str.split(" ")[1].split(":")[2], 0)).getTime();
	}
	
	return str;
}; 


var Recommend = {
	__meta__: {tableName: "Recommends"},
	category: {type: types.TEXT, mandatory: true},
	id: {type: types.TEXT, mandatory: true},
	packageName: {type: types.TEXT, mandatory: true, xmlkey: 'package-name'},
	name: {type: types.TEXT, mandatory: true},
	icon: {type: types.URL, mandatory: true},
	shortDescription: {type: types.TEXT, mandatory: true, xmlkey: 'short-description'},
	longDescription: {type: types.TEXT, mandatory: true, xmlkey: 'long-description'},
	cost: {type: types.MONEY, mandatory: false},
	position: {type: types.RANKING, mandatory: false, default: 0},
	type: {type: types.TEXT, mandatory: true},
	publishedDate: {type: types.DATE, mandatory: true, validator:date_validator, xmlkey: 'published-date'},
	releaseDate: {type: types.DATE, mandatory: true, validator:date_validator, xmlkey: 'release-date'},
	catalogueDate: {type: types.DATE, mandatory: true, validator:date_validator, xmlkey: 'catalogue-date'},
	promotion: {type: types.BOOLEAN, mandatory: false, default: false}
}