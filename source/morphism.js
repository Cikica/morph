(function ( window, module ) {
	if ( window.define && window.define.amd ) { 
		define(module)
	} else { 
		window.morph = module
	}
})( 
	window, 
	{
		// a structure perserving map
		homomorph : function (what) {
			
			var set, with_function_for_nested_objects, with_function

			set                              = ( what.set === "array" ? [] : {} )
			with_function_for_nested_objects = function (member) {
				return member.value
			}
			with_function                    = what.with || with_function_for_nested_objects


			for ( var property in what.object ) {

				if ( what.object.hasOwnProperty(property) ) {

					var new_value = what.object[property]

					if ( what.object[property].constructor === Object )
						new_value = this.homomorph({
							object : what.object[property],
							with   : with_function_for_nested_objects
						})

					if ( what.object[property].constructor === Array )
						new_value = what.object[property].slice(0)

					if ( set.constructor === Array ) {
						var return_value = with_function.call({}, {
							value         : new_value,
							property_name : property,
							set           : set,
						})
						set = set.concat(( 
							return_value.constructor === Array ?
							[return_value] :
							return_value
						))
					}
					
					if ( set.constructor === Object )
						set[property] = with_function.call({}, {
							value         : new_value,
							property_name : property,
							set           : set,
						})
				}
			}

			return set
		},

		inject_array : function ( what ) {
			
			if ( what.with.constructor === Array ) { 
				return what.array.concat( what.with )
			}

			if ( what.with.constructor === Object ) {
				return what.array.concat( this.homomorph({
					object : what.with,
					set    : "array"
				}) )
			}

			if ( what.with.constructor === Function ) {
				return what.array.concat(this.index_loop({
					subject : what.array,
					else_do : function ( loop ) {
						var evaluated
						evaluated = what.with.call( {}, loop.subject[loop.index] )
						if ( evaluated ) {
							return loop.into.concat( evaluated )
						} else { 
							return loop.into
						}
					}
				}))
			}
		},

		surject_array : function ( what ) {

			return this.index_loop_base({
				subject         : what.array,
				start_at        : 0,
				into            : {
					extracted : [],
					leftover  : []
				},
				if_done  : function ( loop ) {

					if ( what.take === "extracted" ) {
						return loop.into.extracted
					}
					
					return loop.into.leftover
				},
				else_do  : function ( loop ) {

					var index_of_value
					index_of_value = ( what.by === "index" ? loop.start_at : loop.subject[loop.start_at] )
					return {
						subject         : loop.subject,
						start_at        : loop.start_at + 1,
						into            : { 
							extracted : ( 
								what.with.indexOf( index_of_value ) > -1 ? 
									loop.into.extracted.concat(loop.subject[loop.start_at]) :
									loop.into.extracted.slice(0)
							),
							leftover  : ( 
								what.with.indexOf( index_of_value ) < 0 ?
									loop.into.leftover.concat(loop.subject[loop.start_at]) :
									loop.into.leftover.slice(0)	
							)
						},
						if_done  : loop.if_done,
						else_do  : loop.else_do
					}
				},
			})
		},


		eq : function(a, b, aStack, bStack) {

			if (a === b) {
				return a !== 0 || 1 / a === 1 / b
			}

			if (a == null || b == null) {
				return a === b
			}

			var className = toString.call(a)

			if ( className !== toString.call( b ) ) {
				return false
			}

			if ( className === '[object RegExp]' || className === '[object String]' ) {
				return '' + a === '' + b
			}

			if ( className === '[object Number]' ) {

				if ( +a !== +a ) {
					return +b !== +b
				}

				return ( 
					+a === 0 ? 
						1 / +a === 1 / b :
						+a === +b 
				)
			}

			if ( className === '[object Date]' || className === '[object Boolean]' ) { 
				return +a === +b
			}

    		if (typeof a != 'object' || typeof b != 'object') {
    			return false
    		}

    		var length = aStack.length

    		while (length--) {
				// Linear search. Performance is inversely proportional to the number of
				// unique nested structures.
				if ( aStack[length] === a ) {
					return bStack[length] === b
				}
    		}
			
			var aCtor, bCtor

			aCtor = a.constructor
			bCtor = b.constructor

			if (
				aCtor !== bCtor    &&
				'constructor' in a && 
				'constructor' in b &&
				!(
					aCtor.constructor === Function && 
					aCtor instanceof aCtor         &&
					bCtor.constructor === Function && 
					bCtor instanceof bCtor
				)
			) {
				return false
			}

			aStack = aStack.concat(a)
			bStack = bStack.concat(b)

			var size, result

			if (className === '[object Array]') {

				size   = a.length;
				result = size === b.length;
				if (result) {
					while (size--) {
						if ( !(result = this.eq(a[size], b[size], aStack, bStack) ) ) {
							break
						}
					}
				}

			} else {

				var keys, key

				keys   = this.get_the_keys_of_an_object( a )
				size   = keys.length
				result = this.get_the_keys_of_an_object( b ).length === size;

      			if (result) {
					while (size--) {
						key = keys[size]
						if ( 
							!( 
								result = b.hasOwnProperty(key) &&
								this.eq( a[key], b[key], aStack, bStack )
							)
						) {
							break
						}
					}
				}
			}

			aStack.pop()
			bStack.pop()

			return result
  		},

  		get_the_keys_of_an_object : function ( object ) { 
  			var keys
  			keys = []
  			for ( var property in object ) { 
  				if ( object.hasOwnProperty( property ) ) { 
  					keys = keys.concat( property )
  				}
  			}
  			return keys
  		},

		are_these_objects_the_same : function( object ) {
			return this.eq( object.first , object.second, [], [] );
		},

		biject : function () {

		},

		epimorph_array : function (loop) {
			return this.index_loop({
				array   : loop.array,
				else_do : function (index_loop) {
					if ( 
						
						 loop.by_index && loop.exclude && loop.exclude.indexOf(index_loop.index)   <  0 ||
						!loop.by_index && loop.exclude && loop.exclude.indexOf(index_loop.indexed) <  0 ||

						 loop.by_index && loop.include && loop.include.indexOf(index_loop.index)   > -1 ||
						!loop.by_index && loop.include && loop.include.indexOf(index_loop.indexed) > -1

					) {
						return index_loop.into.concat(index_loop.indexed)
					} else {
						return index_loop.into
					}
				}
			})
		},

		index_loop : function (loop) {

			var self = this

			return this.index_loop_base({
				subject  : loop.subject,
				start_at : loop.start_at || 0,
				into     : this.replace_with_default({ what : loop.into, default : [] }),
				if_done  : loop.if_done  || function (base_loop) {
					return base_loop.into
				},
				else_do : function (base_loop) {
					return {
						subject  : self.copy({ what : base_loop.subject }),
						into     : loop.else_do({
							subject : self.copy({ what : base_loop.subject }),
							index   : base_loop.start_at,
							into    : base_loop.into,
							indexed : self.copy({
								what : base_loop.subject[base_loop.start_at]
							})
						}),
						start_at : base_loop.start_at + 1,
						if_done  : base_loop.if_done,
						else_do  : base_loop.else_do
					}
				}
			})
		},

		index_loop_base : function (loop) {
			
			if ( loop.subject === undefined ) {
				throw new this.exceptions.definition("index_loop_base \"subject\" paramter has not been declared")
			}

			var length
			
			if ( loop.subject.constructor === Array )
				length = loop.subject.length
			
			if ( loop.subject.constructor === Number )
				length = loop.subject

			if ( loop.start_at >= length ) {
				return loop.if_done.call( {}, loop)
			} else {
				return this.index_loop_base(loop.else_do({
					subject  : loop.subject,
					length   : length,
					start_at : loop.start_at,
					into     : loop.into,
					if_done  : loop.if_done,
					else_do  : loop.else_do
				}))
			}
		},

		copy : function (copy) {
			
			if ( copy.what.constructor === Array && copy.object_array ) {
				return this.index_loop({
					array   : copy.what,
					else_do : function (loop) {
						return loop.into.concat(loop.indexed)
					}
				})
			}
			
			if (copy.what.constructor === Array) {
				return copy.what.slice(0)
			}
			
			if (copy.what.constructor === Object) {
				return this.homomorph({
					object : copy.what,
					with   : function (member) {
						return member.value
					}
				})
			}
			
			return copy.what
		},

		replace_with_default : function (replace) {
			if ( replace.what === undefined )
				return replace.default
			else
				return replace.what
		},

		exceptions : { 
			definition : function (message) { 
				this.name    = "Definition Error"
				this.message = message
			}
		},
		// someting that construct a list from something
	}
)