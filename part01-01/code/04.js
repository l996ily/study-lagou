//手写实现 MyPromise 源码
/**要求: 尽可能还远promise中的每一个API,并通过注释的方式描述思路和原理*/

// Promise 类核心逻辑实现
/**
 *1.Promise就是一个类，通过 new 关键字执行 Promise时，需要传递一个执行器进去，执行器会立即执行
	2.Promise 中有三种状态 分别为 成功fulfilled 失败 rejected 等待 pending
  	2.1pending -> fulfilled
  	2.2pending -> rejected
  	2.3一旦状态确定就不可更改
	3.resolve 和  reject 函数是用来更改状态的
  	3.1resolve 是将状态改为 fulfilled
  	3.2reject 是将状态改为 rejected
	4.then 方法内部做的事情就是判断状态。如果状态是成功，调用成功的回调函数；如果状态是失败，调用失败的回调函数。then方法是被定义在原型对象中的
	5.then 成功回调有一个参数，表示成功之后的值；then 失败回调有一个参数，表示失败后的原因
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class myPromise {
	// 执行器
	constructor (executor) {
		// 捕获执行器中的错误
		try {
			executor(this.resolve, this.reject)
		} catch(e) {
			this.reject(e)
		}
	}
	// 成功的值
	value = undefined
	// 失败的原因
	reason = undefined
	// 状态
	status = PENDING
	// 成功的回调
	// successCallback = undefined
	successCallback = []
	// 失败的回调
	// failedCallback = undefined
	failedCallback = []

	resolve = value => {
		if (this.status !== PENDING) return
		this.value = value
		this.status = FULFILLED
		// this.successCallback && this.successCallback(this.value)
		// 判断successCallback数组有值,并依次进行输出执行
		while (this.successCallback.length) this.successCallback.shift()()
	}

	reject = reason => {
		if (this.status !== PENDING) return
		this.reason = reason
		this.status = REJECTED
		// this.failedCallback && this.failedCallback(this.reason)
		// 判断failedCallback数组有值,并依次进行输出执行
		while (this.failedCallback.length) this.failedCallback.shift()()
	}

	then (successCallback, failedCallback) {
		// then 方法的参数变成可选参数
		// 判断 successCallback 是否存在，存在就调用，不存在就给它补一个参数带到下一个 then 中去
		successCallback = successCallback ? successCallback : value => value
		// 判断 failedCallback 是否存在，存在就调用，不存在就给它补一个参数带到下一个 then 中去
		failedCallback = failedCallback ? failedCallback : reason => { throw reason }
		// then 方法进行链式调用时,返回的是一个 promise 对象
		let promise2 = new myPromise((resolve, reject)=>{
			// 如果状态是成功,则执行成功的回调函数
			if (this.status === FULFILLED) {
				setTimeout(()=>{
					// promise.then内部错误的捕获
					try {
						// 通过一个变量来接收上一个then方法的返回值
						let x = successCallback(this.value)
						// resolve(x)
						/**
						 * 又因为我们无法得知 x 返回的是普通值还是一个promise对象,所以
						 *  1. 如果是普通值, 那么直接返回 resolve(x)
						 * 	2. 如果是promise对象,那么就要根据当前promise对象的状态,来执行响应的数据
						 */
						// resolvePromise(x, resolve, reject)
						/**
						 * 又因为可能出现自调用的情况，所以我们得进行处理判断
						 * 1.当程序走到这步时,promise2 可能还未赋上值,所以我们需要一个定时器,延迟执行这步,等到peomise2赋值
						*/
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) {
						reject(e)
					}
				},0)
			} 
			// 如果状态是失败,则执行失败的回调函数
			else if (this.status === REJECTED) {
				setTimeout(()=>{
					try {
						let x = failedCallback(this.reason)
						// reject(x)
						// resolvePromise(x, resolve, reject)
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) {
						reject(e)
					}
				},0)
			}
			// 当resolve或reject是异步执行时,而then是同步,这时程序就无法执行;且当前状态为pending
			else {
				// 判断状态为pending时的处理方式,将得到的回调函数进行存储,再根据resolve和reject的执行决定执行那个回调函数
				// this.successCallback = successCallback
				// this.failedCallback = failedCallback
				//  then 方法进行多次调用的时候,在同步的情况下,正常运行,但是异步的情况下,就只能输出最后一个,因此需要进行数组的存储,然后再依次执行
				this.successCallback.push(()=>{
					setTimeout(()=>{
						// 这里进行 promise.then内部的错误捕获
						 try {
								let x = successCallback(this.value)
								resolvePromise(promise2, x, resolve, reject)
						 } catch (e) {
								reject(e)
						 }
					 },0)
				})
				this.failedCallback.push(()=>{
					setTimeout(()=>{
            // 这里进行 promise.then内部的错误捕获
            try {
              let x = failedCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          },0)
				})
			}
		})
		return promise2
	}

	// 无论当前的 promise 状态是成功的还是失败的，finally 当中的回调函数都会被执行一次
	finally (callback) {
    return this.then(value => {
      return myPromise.resolve(callback()).then(()=>value)
    }, reason => {
      return myPromise.resolve(callback()).then(()=>{throw reason})
    })
  }
	// 用来处理当前 promise 对象最终状态为失败的情况，当我们调用then方法时是可以不传递失败回调的，这时就会被 catch 方法所捕获，从而执行catch中的回调函数
	catch (failedCallback) {
    return this.then(undefined, failedCallback)
  }
	/**
	 * Promise.all 接收数组的形式，数组里面为任意的值（包括普通值或Promise对象），这个数组中的顺序一定是我们得到的结果的顺序
	 * 1. all 方法中的所有 promise 对象，如果状态都是成功的，那么all方法的结果就是成功的
	 * 2. 如果有一个是失败的，那么最终的结果是失败的
	 */
	static all (arr) {
		let result = []
		let index = 0
		return new myPromise((resolve, reject)=>{
			function dataCollect (key, value) {
				result[key] = value
				index++
				if(index === arr.length) {
					resolve(result)
				}
			}
			for (let i = 0; i<arr.length; i++){
				let currentVal = arr[i]
				if (currentVal instanceof myPromise) {
					currentVal.then(value=>dataCollect(i, value), reason=>reject(reason))
				} else {
					dataCollect(i, arr[i])
				}
			}	
		})
	}

	// Promise.resolve()将给定的值转换为 promise 对象，也就是说 promise.resolve()的返回值就是一个promise对象
	static resolve (value) {
    if (value instanceof myPromise) return value;
    return new myPromise (resolve => resolve(value))
  }

}

function resolvePromise (promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('Chaining cycle detected for promise #<promise>'))
	}
	if (x instanceof myPromise) {
		x.then(resolve, reject)
	} else {
		resolve(x)
	}
}

let p1 = new myPromise((resolve, reject) =>{
	resolve('成功回调')
	// setTimeout(()=>{
	// 	resolve('成功回调')
	// 	// reject('失败回调')
	// },200)
	// reject('失败回调')
	// throw new Error('executor error')
})
// p1.then(res => {
// 	console.log(res)
// },rea => {
// 	console.log(rea);
// })

// then 方法多次调用
// p1.then(res=>{
// 	console.log(1, res);
// })

// p1.then(res => {
// 	console.log(2, res);
// })

// p1.then(res => {
// 	console.log(3, res);
// })

// then 方法链式调用
// function newPromise () {
// 	return new Promise ((resolve, reject) => {
// 		resolve('返回promise对象')
// 	})
// }
// p1.then(res=>{
// 	console.log(res);
// 	return newPromise()
// 	// return 100
// }).then(res=>{
// 	console.log(res);
// })

// then 方法链式调用识别 Promise 对象自返回
// var p2 = p1.then(res=>{
// 	console.log('158',res)
// 	return p2
// })
// p2.then(function(value){
// 	console.log(value);
// }, function(reason){
//   console.log(reason)
// })

// 捕获错误
// p1.then(res=>{
// 	console.log(res);
// 	throw new Error('错误')
// },rea=>{
// 	console.log(rea);
// }).then(res=>{
// 	console.log(res);
// },rea=>{
// 	console.log(rea);
// })

// then 方法变为可选参数
// p1.then()
//   .then()
//   .then(value => console.log(value))
 
// promise.all 方法的实现
// function p2 () {
//   return new myPromise (function(resolve, reject) {
//     setTimeout(function () {
//       resolve('p1')
//     }, 2000)
//   })
// }
// function p3 () {
//   return new myPromise (function(resolve, reject) {
//     resolve('p2')
//   })
// }
// myPromise.all(['a', 'b', p2(), p3(), 'c']).then(function(result){
// 	console.log(result);
// })

// Promise.resolve 实现
function p2 () {
  return new myPromise (function(resolve, reject) {
    resolve('hello')
  })
}
// 在 resolve 的内部会创建一个 promise 对象, 并且把10包裹在这个promise对象中
// 然后把创建出来的promise对象作为resolve方法的返回值
myPromise.resolve(10).then(value => console.log(value))

// 也可以接收一个promise对象,如果是promise对象它会原封不动的把这个promise对象再作为
// 这个方法的返回值
myPromise.resolve(p2()).then(value => console.log(value))
