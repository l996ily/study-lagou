class Observer {
	constructor (data) {
		this.walk(data)
	}
	walk (data) {
		if (!data || typeof data !== 'object') return 
		Object.keys(data).forEach(key => {
			this.defineReactive(data, key, data[key])
		})
	}
	defineReactive(data,key,val){
		let _this = this
		let dep = new Dep()
		// 若val是对象,把val内部的属性转换成响应式数据
		this.walk(val)
		Object.defineProperty(data,key,{
			enumerable: true,
			configurable: true,
			get () {
				Dep.target && dep.addSub(Dep.target)
				return val
			},
			set (newValue) {
				if (newValue === val) return
				val = newValue
				// 新赋的值同样转换成响应式数据
				_this.walk(newValue)
				dep.nodify()
			}
		})
	}
}