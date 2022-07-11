class Vue {
	constructor (options) {
		// 通过属性保存选项的数据
		this.$options = options || {}
		this.$data = options.data || {}
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
		// 将 data 中的成员转换成getter和setter,注入到vue实例中
		this._proxyData(this.$data)
		new Observer(this.$data)
		new Compiler(this)
	}
	_proxyData (data) {
		Object.keys(data).forEach(key => {
			Object.defineProperty(this, key, {
				enumerable: true,
				configurable: true,
				get () {
					return data[key]
				},
				set (newValue) {
					if (newValue === data[key]) return
					data[key] = newValue
				}
			})
		})
	}
}