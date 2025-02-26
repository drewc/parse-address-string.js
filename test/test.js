var test = require('tape')
,app = require('../')

test('parseAddress',function(t){
    var tests = [
	{
	    desc: 'basic worky'
	    ,input: '1842 W Washington Blvd, Los Angeles, CA 90007'
	    ,expected: {
		line1: '1842 W Washington Blvd',
		line2: null
		,city: 'Los Angeles'
		,province: 'CA'
		,postal_code: '90007'
		,country: null
	    }
	}
	,{
	    desc: 'street address looks like a zip code'
	    ,input: '90007 W Washington Blvd, Santa Monica, California 90007'
	    ,expected: {
		line1: '90007 W Washington Blvd',
		line2: null
		,city: 'Santa Monica'
		,province: 'California'
		,postal_code: '90007'
		,country: null
	    }
	}
	,{
	    desc: 'street address is just words'
	    ,input: 'Trousdale Parkway, Los Angeles, California'
	    ,expected: {
		line1: 'Trousdale Parkway'
		,line2: null
		,city: 'Los Angeles'
		,province: 'California'
		,postal_code: null
		,country: null
	    }
	}
	,{
	    desc: 'province and city have the same name'
	    ,input: '1201 Broadway, New York, New York 10001'
	    ,expected: {
		line1: '1201 Broadway'
		,line2: null
		,city: 'New York'
		,province: 'New York'
		,postal_code: '10001'
		,country: null
	    }
		}
		,{
			desc: 'province with two names spelled out'
			,input: '306 Deep Creek Rd, Fayetteville, North Carolina 28312'
			,expected: {
				line1: '306 Deep Creek Rd'
		,line2: null
				,city: 'Fayetteville'
				,province: 'North Carolina'
				,postal_code: '28312'
				,country: null
			}
		}
		,{
			desc: 'country is appended with comma'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007, US'
			,expected: {
				line1: '1842 W Washington Blvd'
		,line2: null
				,city: 'Los Angeles'
				,province: 'CA'
				,postal_code: '90007'
				,country: 'US'
			}
		}
		,{
			desc: 'country is appended without comma'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007 USA'
			,expected: {
				line1: '1842 W Washington Blvd'
		,line2: null
				,city: 'Los Angeles'
				,province: 'CA'
				,postal_code: '90007'
				,country: 'USA'
			}
		}
		,{
			desc: 'canada'
			,input: '646 Union Ave E, Winnipeg, MB R2L 1A4, CA'
			,expected: {
				line1: '646 Union Ave E'
		,line2: null
				,city: 'Winnipeg'
				,province: 'MB'
				,postal_code: 'R2L 1A4'
				,country: 'CA'
			}
		}
		,{
			desc: 'canada - no country indicator'
			,input: '229 Begin St W, Thunder Bay, ON P7E 5M5'
			,expected: {
				line1: '229 Begin St W'
		,line2: null
				,city: 'Thunder Bay'
				,province: 'ON'
				,postal_code: 'P7E 5M5'
				,country: null
			}
		}
		,{
			desc: 'street address + city + province only (no postal code)'
			,input: '3300-3332 Glen Koester Ln, Idaho Falls, ID'
			,expected: {
				line1: '3300-3332 Glen Koester Ln'
		,line2: null
				,city: 'Idaho Falls'
				,province: 'ID'
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'street address + city only'
			,input: '757 Juntura-Riverside Rd, Riverside'
			,expected: {
				line1: '757 Juntura-Riverside Rd'
		,line2: null
				,city: 'Riverside'
				,province: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'street address + postal code only'
			,input: '1813 Linda Vista Cir, 92831'
			,expected: {
				line1: '1813 Linda Vista Cir'
		,line2: null
				,city: null
				,province: null
				,postal_code: '92831'
				,country: null
			}
		}
		,{
			desc: 'street address only'
			,input: '145 Parkway Ave'
			,expected: {
				line1: '145 Parkway Ave'
		,line2: null
				,city:  null
				,province: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'city only'
			,input: 'Los Angeles'
			,expected: {
				line1: null
		,line2: null
				,city:  'Los Angeles'
				,province: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'province only'
			,input: 'NJ'
			,expected: {
				line1: null
		,line2: null
				,city:  null
				,province: 'NJ'
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'postal code only'
			,input: '13820'
			,expected: {
				line1: null
		,line2: null
				,city:  null
				,province: null
				,postal_code: '13820'
				,country: null
			}
		}
		,{
			desc: 'country only'
			,input: 'United States'
			,expected: {
				line1: null
		,line2: null
				,city:  null
				,province: null
				,postal_code: null
				,country: 'United States'
			}
		}
		,{
			desc: 'empty'
			,input: '  '
			,expected: {
				line1: null
		,line2: null
				,city:  null
				,province: null
				,postal_code: null
				,country: null
			}
		}
		,{
			desc: 'invalid input'
			,input: {}
			,expected: {
				line1: null
		,line2: null
				,city:  null
				,province: null
				,postal_code: null
				,country: null
			}
		}
	]

	t.plan(tests.length)

    tests.forEach(function(test){
	
	const address = app(test.input)
	if (JSON.stringify(address) != JSON.stringify(test.expected)) {
	    console.log(test.desc,'address != test.expected', JSON.stringify(address), address,'!=',JSON.stringify(test.expected))
	}
	t.ok(JSON.stringify(address) == JSON.stringify(test.expected), test.desc)
    })
})

test('printAddress',function(t){
	var tests = [
		{
			desc: 'basic worky'
			,input: {
				line1: '1842 W Washington Blvd'
				,line2: ''
				,city: 'Los Angeles'
				,province: 'CA'
				,postal_code: '90007'
				,country: null
			}
			,expected: '1842 W Washington Blvd, Los Angeles, CA 90007'
		}
		,{
			desc: 'has country'
			,input: {
				line1: '1842 W Washington Blvd'
				,line2: ''
				,city: 'Los Angeles'
				,province: 'CA'
				,postal_code: '90007'
				,country: 'US'
			}
			,expected: '1842 W Washington Blvd, Los Angeles, CA 90007, US'
		}
		,{
			desc: 'has line2'
			,input: {
				line1: '1842 W Washington Blvd'
				,line2: 'Ste 300'
				,city: 'Los Angeles'
				,province: 'CA'
				,postal_code: '90007'
				,country: null
			}
			,expected: '1842 W Washington Blvd Ste 300, Los Angeles, CA 90007'
		}
		,{
			desc: 'invalid input'
			,input: null
			,expected: ''
		}
	]

	t.plan(tests.length)

	tests.forEach(function(test){
	    const str = app.printAddress(test.input)
	    t.ok(str == test.expected, test.desc)
	})
})

