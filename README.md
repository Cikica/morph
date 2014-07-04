Morphism
=====

#### Functional helper library from the future ####

Morphism is a library that comes with functinal methods for iterating arrays and objects.

#### History & Background #####
Il get to writting one these, one these days.

Signed Mr.Slackaslack

### Methods

#### Homomorph

Definition : 

```javascript
morph.homomorph({ object : {}, set : "(object|array)", with : function () {} })
```

Examples : 

```javascript
var who
who = morph.homomorph({
	object : {
		title : "Count",
		name  : "Dracula"
	},
	with   : function ( member ) {
		// first iteration
		member.value         // => Count
		member.property_name // => title
		member.set           // => {}
		return member.value + "mwhaahaha"
	}
})
console.log( who ) 
// => { title : "Countmwhaahaha", name : "Draculamwhaahaha" }
```

```javascript
var who
who = morph.homomorph({
	object : {
		title : "Count",
		name  : "Dracula"
	},
	set    : "array",
	with   : function ( member ) {
		// first iteration
		member.value         // => Count
		member.property_name // => title
		member.set           // => []
		return member.value + "mwhaahaha"
	}
})
console.log( who ) 
// => [ "Countmwhaahaha", "Draculamwhaahaha" ]
```