# Morph

**Stateless Utility**

The purpose of morph is to provide a functional way to handle day to day tasks of programing such as 
iterating, comparing, removing and adding. All of this whilst being stateless.

## Methods

### Glossary

[inject_array](#inject_array)

[surject_array](#surject_array)

[biject_array](#biject_array)

[inject_object](#inject_object)

[surject_object](#surject_object)

[biject_object](#biject_object)

[index_loop](#index_loop)

[copy_value](#copy_value)

[merge_two_objects](#merge_two_objects)

[are_these_two_values_the_same](#are_these_two_values_the_same)

[does_array_contain_this_value](#does_array_contain_this_value)

[create_object_from_key_and_value_array](#create_object_from_key_and_value_array)

[get_the_keys_of_an_object](#get_the_keys_of_an_object)

[get_the_values_of_an_object](#get_the_values_of_an_object)

[while_greater_than_zero](#while_greater_than_zero)

[convert_node_list_to_array](#convert_node_list_to_array)

### Syntax Definition Guide

Through out the docs you will come across syntax definitions for every method. Here is a guide to
what each peculiarity means, though some may be obvious.

`Array`    : Can be array

`Object`   : Can be object

`Number`   : Can be number

`String`   : Can be string

`Infinity` : Can be any type of value

`||`       : Can be the type to the left but will default to whatever is at the left if nothing is given.

`&&`       : Can be the type to the left and the type to the right

`=>`       : The resulst is this	

### inject_array

```javascript
inject_array({
	array : Array,
	with  : Array && Object && function ( member ) {}
})
```

Insert members into an array and return result.

**Examples :**

```javascript
inject_array({
	array : [1,2,3,4],
	with  : [5,6,7,8]
})
// => [1,2,3,4,5,6,7,8]

inject_array({
	array : [1,2,3,4],
	with  : { s : "a", ss : "b", sss : "c" },
})
// => [1, 2, 3, 4, "a", "b", "c" ]

inject_array({
	array : [1,2,3,4],
	with  : function ( member ) { 
		return member * 2
	}
})
// => [ 1, 2, 3, 4, 2, 4, 6, 8]

inject_array({
	array : [1,2,3,4],
	with  : function ( member ) { 
		if ( member % 2 === 0 ) {
			return member * 2
		} else {
			return false
		}
	}
}) 
// => [1,2,3,4,4,8]
```

### surject_array

```javascript
surject_array({
	array : Array,
	with  : Array,
	by    : "value" && "index"
})
```

Remove members of an array and return leftovers.

**Examples :**

```javascript
surject_array({
	array : [1,2,3,4], 
	with  : [2,4]
}) 
// => [1,3]

surject_array({
	array : [{ s : 1 }, 2, { d : 2 }, 4],
	with  : [0,2],
	by    : "index"
})
// => [2,4]

surject_array({
	array : [{ s : 1 }, 2, { d : 2 }, 4],
	with  : [{ s : 1 }, { d : 2 }]
})
// => [2,4]
```

### biject_array

```javascript
biject_array({
	array : Array,
	with  : function ( loop ) {
		// loop =>
		// {
		// 	index   : Number,
		// 	indexed : Array Value
		// }
	}
})
```

One to one map of array.

**Examples :**

```javascript
biject_array({
	array : [1,2,3,4,5,6],
	with  : function ( loop ) { 
		return loop.index+loop.indexed
	}
})
// => [1,3,5,7,9,11]
```

### inject_object

```javascript
inject_object({
	object : Object,
	with   : Object && Array
})
```

Insert members into object and return result.

**Examples :**

```javascript
inject_object({
	object : { 
		s : "some",
		d : "some other"
	},
	with : { 
		c : "another some"
	}
}) 
// => {
//	s : "some",
//	d : "some other",
//	c : "another some"
// }

inject_object({
	object : { 
		a : "some",
		b : "some other"
	},
	with : ["a", "b", "c"]
}) 
// => {
// 	"a" : "some",
// 	"b" : "some other",
// 	"0" : "a",
// 	"1" : "b",
// 	"2" : "c"
// }
```

### surject_object

Remove members of an object and return result.

```javascript
surject_object({
	object : Object,
	with   : Object && Array
	by     : "value" && "key"
})
```

**Examples**

```javascript
surject_object({
	object : { 
		"some"    : "name",
		"another" : "value"
	},
	with   : ["some"],
	by     : "key"
}) 
// => { "another" : "value" }

surject_object({
	object : { 
		"some"     : "name", 
		"another"  : "value",
		"another2" : "values",
	},
	with   : ["name", "values"],
	by     : "value"

})
// => { "another" : "value" }
```

### biject_object

```javascript
surject_object({
	object : Object,
	with   : function ( loop ) {
		// loop =>
		// {
		// 	index : Number,
		// 	into  : { 
		// 		key   : Boolean && Array,
		// 		value : Boolean && Array
		// 	},
		// 	key   : Value,
		// 	value : Value
		// }
	}
})
```

One to one maping of an object.

**Examples**

```javascript
biject_object({
	object : {
		"some"    : "here",
		"another" : "over there",
	},
	with   : function ( loop ) {
		return { 
			key   : loop.key   +"some",
			value : loop.value +"some",
		}
	}
})
// => {
// 	"somesome"    : "heresome",
// 	"anothersome" : "over theresome",
// }

biject_object({
	object : {
		"some"    : "here",
		"another" : "over there",
	},
	with   : function ( loop ) {
		return { 
			value : loop.value +"some",
		}
	}
})

// => {
// 	"some"    : "heresome",
// 	"another" : "over theresome",
// }

biject_object({
	object : {
		"some"    : "here",
		"another" : "over there",
	},
	with   : function ( loop ) {
		return { 
			key : loop.key + "some"
		}
	}
})

// => {
// 	"somesome"    : "here",
// 	"anothersome" : "over there",
// }
```

### index_loop

```javascript
index_loop({
	subject  : Array,
	into     : Infinity || Array,
	if_done  : function ( loop ) {
		// loop =>
		// {
		//	subject : Array,
		//  index   : Number,
		//  into    : Infinity,
		//  indexed : Infinity,
		// }
		return loop.into
	} || Function,
	else_do  : function ( loop ) {
		return loop.into
	}
})
```

A robust method for iterating arrays or numbers, when all else is not enough use index loop.

**Examples**
```javascript
index_loop({
	subject   : [ 1, 2, 3 ],
	else_do : function (loop) {
		return loop.into.concat( "index " + loop.index + ", value "+ loop.indexed)
	}
})
// =>
// [
// 	"index 0, value 1", 
// 	"index 1, value 2", 
// 	"index 2, value 3"
// ]

index_loop({
	subject : [ 1, 2, 3, 4 ],
	into    : {},
	else_do : function ( loop ) {
		loop.into["yolo"+loop.index] = "smolo"+loop.indexed
		return loop.into
	}
})
// =>
// {
// 	"yolo0" : "smolo1",
// 	"yolo1" : "smolo2",
// 	"yolo2" : "smolo3",
// 	"yolo3" : "smolo4",
// }

index_loop({
	subject : [ 1, 2, 3 ],
	into    : false,
	else_do : function ( loop ) { 
		if ( loop.indexed % 2 ) { 
			return true
		}
		return loop.into
	}
})
// => true

index_loop({
	subject : [ 
		"some", 
		"somehere", 
		"here bla", 
		"some" 
	],
	if_done : function ( loop ) {
		return loop.into.length
	},
	else_do : function ( loop ) {
		if ( loop.indexed === "some" ) { 
			return loop.into.concat( loop.indexed )
		}
		return loop.into
	}
})
// => 2
```

### copy_value

```javascript
copy_value({
	value : Infinity
})
```

Creates a copy of the given value, useful for copying objects, arrays, arrays of objects without 
reference.

### are_these_two_values_the_same

```javascript
are_these_two_values_the_same({
	first  : Infinity,
	second : Infinity
})
```
Compare if two values are the same, useful for nested objects, arrays of objects, and so forth.

### merge_two_objects

```javascript
merge_two_objects({
	object : Object,
	onto   : Object
})
// => Object
```

Merge two objects. The ```object``` replaces duplicate keys of the ```onto```

**Examples**
```javascript
merge_two_objects({
	onto : {
		"s1" : "should be overwriten",
		"s2" : "this one is new",
		"s5" : "original"
	},
	object   : {
		"s1" : "this one overwrites",
		"s3" : "some new stuff",
	}
})
// => {
// 	"s1" : "this one overwrites",
// 	"s2" : "this one is new",
// 	"s3" : "some new stuff",
// 	"s5" : "original"
// }

merge_two_objects({
	onto : {
		"s4" : {
			"s3" : "originale",
			"s2" : "shoudl be overwriten",
			"s4" : "originale 2",
		}
	},
	object   : {
		"s4" : {
			"s1" : "this one is new",
			"s2" : "overwrites"
		}
	}
})
// => {
// 	"s4" : { 
// 		"s1" : "this one is new",
// 		"s2" : "overwrites",
// 		"s3" : "originale",
// 		"s4" : "originale 2"
// 	}
// }
```