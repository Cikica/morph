
	var module = window.morph

	describe("homomorph", function () {
		
		var input, expected_array, maped_array
		
		expected_array = [
			"stuff",
			123,
			{
				s : "stuff",
				n : 123,
				a : [1,2,3],
				o : {
					s : "stuff",
					n : 123,
					a : [1,2,3]
				},
			},
			function (stuff) { return stuff },
			[1,2,3]
		]
		input = {
			s : "stuff",
			n : 123,
			o : {
				s : "stuff",
				n : 123,
				a : [1,2,3],
				o : {
					s : "stuff",
					n : 123,
					a : [1,2,3]
				},
			},
			f : function (stuff) { return stuff },
			a : [1,2,3]
		}
		maped_array  = module.homomorph({ object : input, set : "array" })
		maped_object = module.homomorph({ object : input })
		

		it("does not copy the prototype", function () {
			var proto_test, output
			proto_test    = Object.create(input)
			proto_test.dd = "new"
			output        = module.homomorph({
				object : proto_test,
				with   : function (member) {
					return member.value
				}
			})
			expect(output.s).toBe(undefined)
			expect(output.dd).toBe("new")
		})

		it("has no references hidden in nested objects", function () {
			var output = module.homomorph({
				object : input,
				with   : function (member) {
					return member.value
				}
			})
			output.s     = "stuff2"
			output.n     = 1234
			output.o.s   = "stuff3"
			output.o.n   = 1234
			output.o.a   = output.o.a.concat(4)
			output.o.o.s = "stuff3"
			output.o.o.n = 1234
			output.o.o.a = output.o.o.a.concat(4)
			output.a     = output.a.concat(4)

			expect(input.s).not.toEqual(output.s)
			expect(input.n).not.toEqual(output.n)
			expect(input.a).not.toEqual(output.a)
			expect(input.o.s).not.toEqual(output.o.s)
			expect(input.o.n).not.toEqual(output.o.n)
			expect(input.o.a).not.toEqual(output.o.a)
			expect(input.o.o.s).not.toEqual(output.o.o.s)
			expect(input.o.o.n).not.toEqual(output.o.o.n)
			expect(input.o.o.a).not.toEqual(output.o.o.a)
			expect(output.f("test")).toEqual("test")
		})

		it("maps without reference", function() {
			expect( maped_object ).not.toBe( input )
		})

		it("maps to an array", function() {

			// the function is not checked case it wont equal or somethign, its legit
			expect( maped_array[0] ).toEqual( expected_array[0] )
			expect( maped_array[1] ).toEqual( expected_array[1] )
			expect( maped_array[2] ).toEqual( expected_array[2] )
			expect( maped_array[4] ).toEqual( expected_array[4] )
		})

		it("maps to an array without any sneaky references", function() {

			expect( maped_array[2] ).not.toBe( expected_array[2] )
			expect( maped_array[4] ).not.toBe( expected_array[4] )
		})
	})

	// describe("copy", function () {
		
	// 	var input, input_2, output
	// 	input = { 
	// 		array        : [1,2,3],
	// 		object_array : [{ s : 1, b : 2 }, { s : 1, b : 2 }],
	// 		object       : {
	// 			s : 1,
	// 			b : 2
	// 		},
	// 		number: 55,
	// 		string: "stuff",
	// 	}
	// 	input_2 = {
	// 		o1 : {
	// 			stuff : "sd",
	// 			withs : "stuff",
	// 		},
	// 		o2 : {
	// 			o3 : "s",
	// 			o4 : "b"
	// 		}
	// 	}

	// 	it("doesent mess up sibling objects in an object", function () {
	// 		output = module.copy({ what : input_2 })
	// 		expect(output).toEqual({
	// 			o1 : {
	// 				stuff : "sd",
	// 				withs : "stuff",
	// 			},
	// 			o2 : {
	// 				o3 : "s",
	// 				o4 : "b"
	// 			}
	// 		})
	// 	})

	// 	it("copies arrays without reference", function () {
	// 		output = module.copy({ what : input.array })
	// 		output.push("stuff")
	// 		expect(input.array.indexOf("stuff")).toEqual(-1)
	// 	})

	// 	it("copies object arrays without reference ", function () {
	// 		output = module.copy({ what : input.object_array, object_array : true })
	// 		output[0].s = "change"
	// 		expect(input.object_array[0].s).toEqual(1)
	// 	})
	// })

	describe("index loop", function () {
		var input_1, input_2, input_3
		input_1 = {
			subject   : [1,2,3],
			else_do : function (loop) {
				return loop.into.concat("member "+ loop.subject[loop.index])
			}
		},
		input_2 = {
			subject   : [1,2,3],
			else_do : function (loop) {
				return loop.into.concat("member "+ loop.subject[loop.index])
			}
		},
		input_3 = {
			subject   : [{ s : 1 }, { s : 2 }],
			else_do : function (loop) {
				loop.indexed.s = "change"
				return loop.into.concat(loop.indexed)
			}
		}

		it("returns expected results", function () {
			expect(module.index_loop(input_1)).toEqual(["member 1", "member 2", "member 3"])
		})

		it("has no reference upon completion to the input subject", function () {
			var output = module.index_loop(input_2)
			input_2.subject.push("stuff")
			expect(output.indexOf("stuff")).toEqual(-1)
		})

		it("result has no reference to objects that were contianed in the input subject", function () {
			var output = module.index_loop(input_3)
			expect(input_3.subject[0].s).toEqual(1)
			expect(output[0].s).toEqual("change")
		})

	})

	describe("index loop base", function () {

		var input, input_2, output, input_3, input_4, input_5

		input   = {
			subject  : [1,2,3],
			start_at : 0,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				loop.into = loop.into.concat("member "+ loop.subject[loop.start_at])
				loop.start_at += 1
				return loop
			}
		}
		input_2 = {
			subject  : 5,
			start_at : 0,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				loop.into      = loop.into.concat(loop.start_at)
				loop.start_at += 1
				return loop
			}
		}
		input_3 = {
			subject  : 5,
			start_at : 2,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				loop.into      = loop.into.concat(loop.start_at)
				loop.start_at += 1
				return loop
			}
		}
		input_4 = {
			subject  : 5,
			start_at : -1,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				loop.into      = loop.into.concat(loop.start_at)
				loop.start_at += 1
				return loop
			}
		}
		output      = module.index_loop_base(input)

		it("indexes array", function () {
			expect( output ).toEqual(["member 1", "member 2", "member 3"])
		})

		it("indexes based on number", function() {
			expect( module.index_loop_base(input_2) ).toEqual([0,1,2,3,4])	
		})

		it("indexes using the \"start_at\" as a starting point", function() {
			expect( module.index_loop_base(input_3) ).toEqual([2,3,4])	
		})

		it("indexes using a negative \"start_at\" as a starting point", function() {
			expect( module.index_loop_base(input_4) ).toEqual([-1,0,1,2,3,4])	
		})

		it("has no reference on completion to the input.into array", function () {
			input.into.push("new stuff")
			expect(output.indexOf("new stuff")).toEqual(-1)
		})

	})