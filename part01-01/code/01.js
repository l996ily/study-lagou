// 将下面异步代码使用 Promise 的方式改进
// setTimeout(function (){
// 	var a = 'hello'
// 	setTimeout(function () {
// 		var b = 'lagou'
// 		setTimeout(function () {
// 			var c = 'I ♥ U'
// 			console.log(a + b + c)
// 		},10)
// 	},10)
// },10)

// 实现方式
let p1 = new Promise((resolve, reject)=>{
	resolve('hello')
})
p1.then(res => {
	return `${res}lagou`
}).then(res=>{
	return `${res}I ♥ U`
}).then(res => {
	console.log(res);
})
