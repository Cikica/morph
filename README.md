Morph
=====
*stateless utility*

### History & Background
Il get to witting one these, one these days.
Signed Mr.Slackaslack

### Methods

 _ [inject_array](#inject_array)
 _ [inject_object](#inject_object)
 _ [surject_array](#surject_array)
 _ [surject_object](#surject_object)
 _ [biject_object](#biject_object)
 _ [biject_array](#biject_array)
 _ [object_loop](#object_loop)
 _ [does_array_contain_this_value](#does_array_contain_this_value)
 _ [are_these_two_values_the_same](#are_these_two_values_the_same)
 _ [are_these_two_objects_the_same](#are_these_two_objects_the_same)
 _ [are_these_two_arrays_the_same](#are_these_two_arrays_the_same)
 _ [get_the_keys_of_an_object](#get_the_keys_of_an_object)
 _ [get_the_values_of_an_object](#get_the_values_of_an_object)
 _ [get_object_from_array](#get_object_from_array)
 _ [while_greater_than_zero](#while_greater_than_zero)
 _ [base_loop](#base_loop)
 _ [index_loop](#index_loop)
 _ [index_loop_base](#index_loop_base)
 _ [convert_node_list_to_array](#convert_node_list_to_array)
 _ [copy](#copy)
 _ [replace_with_default](#replace_with_default)
 _ [flatten_object](#flatten_object)

#### surject_array

Remove members of an array and return leftovers.

```javascript
surject_array({
	array : [],
	with  : [],
	by    : "value" || "index"
})
```

Examples :

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