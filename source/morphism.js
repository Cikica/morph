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

		// this is an injective homomorphism or atleast should be
		monomorph : function (what) {

			var set, homomorph_function, with_function
			
			set                = what.first_object
			homomorph_function = function (member) {
				return member.value
			}
			with_function      = what.with || function (detail) {
				return detail.value
			}

			for ( var property in what.second_object ) {

				if ( what.second_object.hasOwnProperty(property) ) {

					var new_value = what.second_object[property]

					if ( what.second_object[property].constructor === Object )
						new_value = this.homomorph({
							object : what.second_object[property],
							with   : homomorph_function
						})

					if ( what.second_object[property].constructor === Array )
						new_value = what.second_object[property].slice(0)

					what.first_object[property] = with_function.call({}, {
						set           : set,
						property_name : property,
						value         : new_value
					})
				}
			}

			return set
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