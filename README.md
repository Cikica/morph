Morph
=====
*stateless utility*

### History & Background
Il get to witting one these, one these days.
Signed Mr.Slackaslack

### Methods

- [inject_array](#inject_array)
- [surject_array](#surject_array)
- [inject_object](#inject_object)
- [surject_object](#surject_object)
- [biject_object](#biject_object)
- [biject_array](#biject_array)
- [object_loop](#object_loop)
- [does_array_contain_this_value](#does_array_contain_this_value)
- [are_these_two_values_the_same](#are_these_two_values_the_same)
- [are_these_two_objects_the_same](#are_these_two_objects_the_same)
- [are_these_two_arrays_the_same](#are_these_two_arrays_the_same)
- [get_the_keys_of_an_object](#get_the_keys_of_an_object)
- [get_the_values_of_an_object](#get_the_values_of_an_object)
- [get_object_from_array](#get_object_from_array)
- [while_greater_than_zero](#while_greater_than_zero)
- [base_loop](#base_loop)
- [index_loop](#index_loop)
- [index_loop_base](#index_loop_base)
- [convert_node_list_to_array](#convert_node_list_to_array)
- [copy](#copy)
- [replace_with_default](#replace_with_default)
- [flatten_object](#flatten_object)

#### inject_array

Insert members into an array and return result.

```javascript
inject_array({
	array : [],
	with  : [] || {} || function ( member ) {}
})
```

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

#### surject_array

Remove members of an array and return leftovers.

```javascript
surject_array({
	array : [],
	with  : [],
	by    : "value" || "index"
})

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
```