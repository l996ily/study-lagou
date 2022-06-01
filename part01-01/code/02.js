//基于以下代码完成下面的四个练习
// horsepower: 马力; dollar_value: 价格; in_stock:库存
const fp = require('lodash/fp')
const cars = [
	{
		name: 'Ferrari FF', horsepower:660, dollar_value: 700000, in_stock: true
	},
	{
		name: 'Spyker C12 Zagato', horsepower:650, dollar_value: 648000, in_stock: false
	},
	{
		name: 'Jaguar XKR-S', horsepower:550, dollar_value: 132000, in_stock: false
	},
	{
		name: 'Audi R8', horsepower:525, dollar_value: 114200, in_stock: false
	},
	{
		name: 'Aston Martin One-77', horsepower:750, dollar_value: 1850000, in_stock: true
	},
	{
		name: 'Pagani Huayra', horsepower:700, dollar_value: 1300000, in_stock: false
	}
]

// 练习1: 使用函数组合 fp.flowRight() 重新实现下面这个函数

/**let isLastInStock = function (cars) {
	// 获取最后一条数据
	let last_car = fp.last(cars)
	// 获取最后一条数据的 in_stock 属性
	return fp.prop('in_stock', last_car)
}*/

// 练习1: 实现
let f1 = fp.flowRight(fp.prop('in_stock'),fp.last)
console.log(f1(cars));





// 练习2: 使用fp.flowRight()、fp.prop()、fp.frist() 获取第一个 car 的name
let f2 = fp.flowRight(fp.prop('name'), fp.first)
console.log(f2(cars));




// 练习3: 使用帮助函数 _average重构 averageDollarValue，使用函数组合的方式实现
let _average = function (xs) {
	return fp.reduce(fp.add, 0, xs)/xs.length
}
// let averageDollarValue = function(cars){
// 	let dollar_values = fp.map(function(car){
// 		return car.dollar_value
// 	},cars)
// 	console.log(dollar_values);
// 	return _average(dollar_values)
// }
// 练习3: 实现
let averageDollarValue = fp.flowRight(_average,fp.map('dollar_value'))
console.log(averageDollarValue(cars));



/** 
 * 练习4: 使用flowRight 写一个sanitizeNames()函数,返回一个下划线连接的小写字符串,
 * 				把数组中的name转换为这种形式: 例如: sanitizeNames(["Hello World"]) => ["hello_world"]
 * */ 
let _underscore = fp.replace(/\W+/g,'_')
let sanitizeNames = fp.flowRight(fp.map(_underscore),fp.map(fp.toLower),fp.map('name'))
console.log(sanitizeNames(cars));
