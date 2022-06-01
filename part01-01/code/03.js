const fp = require('lodash/fp')
const { Maybe , Container } = require('./support')

/**练习1: 使用fp.add(x,y) 和 fp.map(f,x) 创建一个能让 functor里的值增加的函数 ex1*/
let maybe = Maybe.of([5, 6, 1])
let ex1 = x => {
	// 需要实现的函数
	return maybe.map(fp.map(item => fp.add(item, x)))
}
console.log(ex1(4));

/**练习2: 实现一个函数ex2, 能够使用fp.first获取列表的第一个元素*/
let xs = Container.of(['do', 'ray','me','fa','so','la','ti','do'])
let ex2 = () => {
	// 需要实现的函数
	return xs.map(fp.first)
}
console.log(ex2());

/**练习3:  实现一个函数ex3, 使用safeProp和fp.first找到user的名字的首字母*/
let safeProp = fp.curry(function(x, o){
	return Maybe.of(o[x])
})
let user = { id: 2, name:'Albert'}
let ex3 = () => {
	// 需要实现的函数
	return safeProp('name',user).map(fp.first)
}
console.log(ex3());

/**练习4: 使用Maybe重写ex4,不要有if语句*/
// let ex4 = function(n) {
// 	if(n) {
// 		return parseInt(n)
// 	}
// }

let ex4 = x => {
	return Maybe.of(x).map(item => parseInt(item))
}

console.log(ex4(5.9));