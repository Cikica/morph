Morph
=====
*stateless utility*

### History & Background
Il get to witting one these, one these days.

Signed Mr.Slackaslack

### Methods

#### Homomorph

**Definition** : 

```javascript
morph.object_loop({ 
	"subject"  : {}, 
	"if_done?" : function ( loop ) { 
		console.log( loop )
		=> {
			object : Object,
			key    : Array,
			value  : Array
		}
		return Anything
	},
	"else_do"  : function ( loop ) {
		console.log( loop ) 
		=> {
			index : Number,
			key   : String,
			value : String || Number || Object || Array
		}

		return { 
			key   : Number,
			value : String || Number || Object || Array
		}
	}
})
```

```javascript
var who
who = morph.object_loop({
	subject : {},
	if_done : function ( loop ) {},
	else_do : function ( loop ) {

	},
})
console.log( who ) 
=> 
```

### To Do

* A method that maps new members onto an existing set and returns result ( injective )
* A method that removes members from an existing set and returns leftover ( surjective )
* A method that extracts members from an existing set and returns extraction ( surjective )
* Unification of object and array looping