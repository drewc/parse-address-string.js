
module.exports = parseAddress
module.exports.parseAddress = parseAddress
module.exports.printAddress = printAddress


function parseAddress(str){
    var address = {
	line1: null,
	line2: null,
	city: null,
	province: null,
	postal_code: null,
	country: null 
    }
    if (typeof str != 'string') {
	//return cb(new Error('Input must be a String'))
	return address
    }
    str = str.trim()
    
    var postalCode = str.match(/([0-9]{5})|([a-z][0-9][a-z] ?[0-9][a-z][0-9])/gi)
    ,indexOfPostalCode = -1

    if (postalCode) {
	postalCode = postalCode.pop() // pick match closest to end
	indexOfPostalCode = str.lastIndexOf(postalCode)
	if (indexOfPostalCode == 0 && str.length > 10) {
	    // postal code is probably part of street address
	    postalCode = null
	    indexOfPostalCode = -1
	}
	if (postalCode) {
	    address.postal_code = postalCode
	    var everythingAfterPostalCode = str.substr(indexOfPostalCode+postalCode.length)
	    str = str.substr(0,indexOfPostalCode)+everythingAfterPostalCode
	    var possibleCountry = everythingAfterPostalCode.replace(/\s*,/,'').split(',').shift().trim()
	    if (possibleCountry && looksLikeCountry(possibleCountry)) {
		address.country = possibleCountry
		str = str.substr(0,indexOfPostalCode) // just ditch everything after postal + country
	    }
	}
    }

    var addySplit = str.split(',')

    // Handle special cases...
    // Neighborhood, City, Province
    if (addySplit.length == 3 && looksLikeProvince(addySplit[2])) {
	address.line1 = addySplit[0].trim()
	address.city = addySplit[1].trim()
	address.province = addySplit[2].trim()
	return address
    }

    // Handle generic case...
    addySplit.forEach(function(addyPart){
	if (!(addyPart = addyPart.trim())) return
	// if has numbers, assume street address
	if (/[0-9]/.test(addyPart)) {
	    return !address.line1 && (address.line1 = addyPart)
	}
	// if looks like province
	if (looksLikeProvince(addyPart) && !address.province) {
	    return address.province = addyPart
	}
	// if looks like country
	if (looksLikeCountry(addyPart)) {
	    return !address.country && (address.country = addyPart)
	}

	// if we've set a city then this is actually the city and the
	// city is actually line2
	if (address.city && !address.line2) {
	    address.line2 = address.city;
	    
	    return address.city = addyPart
	}
	
	// else assume city
	!address.city && (address.city = addyPart)
    })

    return address

}

function printAddress(address){
    if (address === null || typeof address != 'object') {
	return false
    }
    var addyParts = []
    ,addyPart
    if (typeof address.line1 == 'string' && (addyPart = address.line1.trim())) {
	addyParts[0] = addyPart
	if (typeof address.line2 == 'string' && (addyPart = address.line2.trim())) {
	    addyParts[0] += ' '+addyPart
	}
    }
    ['city','province'].forEach(function(addyKey){
	if (typeof address[addyKey] == 'string' && (addyPart = address[addyKey].trim())) {
	    addyParts.push(addyPart)
	}
    })
    var str = addyParts.join(', ')
    if (typeof address.postal_code == 'string' && (addyPart = address.postal_code.trim())) {
	str += ' '+addyPart
	str = str.trim()
    }
    if (typeof address.country == 'string' && (addyPart = address.country.trim())) {
	str += str ? ', '+addyPart : addyPart
    }
    return str
}

var provinces
function looksLikeProvince(str){
	if (!provinces) {
		var map = require('./lib/states.json')
		provinces = {}
		for (var k in map) {
			if (map.hasOwnProperty(k)){
				provinces[k.toLowerCase()] = true
				provinces[map[k].toLowerCase()] = true
			}
		}
	}
	str = str.trim().toLowerCase()
	return !!provinces[str]
}

var countries
function looksLikeCountry(str){
	if (!countries) {
		var map = require('./lib/countries.json')
		countries = {}
		for (var k in map) {
			if (map.hasOwnProperty(k)){
				countries[k.toLowerCase()] = true
				countries[map[k].toLowerCase()] = true
			}
		}
	}
	str = str.trim().toLowerCase()
	if (str == 'usa') {
		return true
	}
	return !!countries[str]
}

