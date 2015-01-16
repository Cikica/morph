Morph
=====
*stateless utility*

### History & Background
Il get to witting one these, one these days.
Signed Mr.Slackaslack

### Methods

(inject array)
	[#inject array]

(inject object)
	[#inject object]

(surject array)
	[#surject array]

(surject object)
	[#surject object]

(biject object)
	[#biject object]

(biject array)
	[#biject array]

(object loop)
	[#object loop]

(does array contain this value)
	[#does array contain this value]

(are these two values the same)
	[#are these two values the same]

(are these two objects the same)
	[#are these two objects the same]

(are these two arrays the same)
	[#are these two arrays the same]

(get the keys of an object)
	[#get the keys of an object]

(get the values of an object)
	[#get the values of an object]

(get object from array)
	[#get object from array]

(while greater than zero)
	[#while greater than zero]

(base loop)
	[#base loop]

(index loop)
	[#index loop]

(index loop base)
	[#index loop base]

(convert node list to array)
	[#convert node list to array]

(copy)
	[#copy]

(replace with default)
	[replace with default]

(flatten object)
	[flatten object]

#### flatten_object

**Definition**

```javascript
morph.flatten_object({
	to_level : Number,
	object   : Object
}) => Object
```
**Examples** :

```javascript
morph.flatten_object({ 
	object : {
		some : "here",
		som  : {
			level : "2"
		},
		somesome : { 
			"level1" : {
				"level2" : "3"
			},
			"levelsome" : {
				"levelsomesome" : {
					"level3" : "4"
				}
			}
		}
	}
}) 

==>	{
	"some"   : "here",
	"level"  : "2",
	"level2" : "3",
	"level3" : "4"
}
```

```javascript
morph.flatten_object({
	to_level : 1,
	object   : {
		"some" : { 
			"level1" : 1
		},
		"somesome" : {
			"level1.1" : 2,
			"level2"   : {
				"level2.2" : 3,
				"moremore" : { 
					"level.3.3" : 4
				}
			}
		}
	}
})

==> {
	"level1"   : 1,
	"level1.1" : 2,
	"level2"   : {
		"level2.2" : 3,
		"moremore" : { 
			"level.3.3" : 4
		}
	}
}
```

#### object_loop

**Definition** :

```javascript
morph.object_loop({ 
	"subject"  : {},
	"into?"    : Anything,
	"if_done?" : function ( loop ) {
		/*
			console.log( loop )
			=> {
				object : Object,
				key    : Array,
				value  : Array,
				into   : Anything
			}
		*/
		return Anything
	},
	"else_do"  : function ( loop ) {
		/*
			console.log( loop ) 
			=> {
				index : Number,
				key   : String,
				value : String || Number || Object || Array,
				into  : Anything
			}
		*/

		return { 
			key   : Number,
			value : String || Number || Object || Array,
			into  : Anything
		}
	}
}) => Anything
```

**Examples** :

```javascript
morph.object_loop({
	"subject" : {
		s : "d",
		b : "some"
	},
	"else_do" : function ( loop ) {
		return {
			key   : loop.index + "2" + loop.key,
			value : loop.value + loop.index + "4"
		}
	}
})

==> {
	"02s" : "d04",
	"12b" : "some14",
}
```

```javascript
var result
result = morph.object_loop({
	"subject" : {
		s : "d",
		b : "some"
	},
	"if_done?" : function ( loop ) { 
		console.log( loop )
		return [ loop.key[0], loop.value[0], loop.key[1], loop.value[1] ].join(":")
	},
	"else_do" : function ( loop ) {
		return {
			key   : loop.index + "2" + loop.key,
			value : loop.value + loop.index + "4"
		}
	}
})
console.log( result )
=> "02s:d04:12b:some14"
```

### To Do

* A method that maps new members onto an existing set and returns result ( injective )
* A method that removes members from an existing set and returns leftover ( surjective )
* A method that extracts members from an existing set and returns extraction ( surjective )
* Unification of object and array looping