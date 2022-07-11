class Compiler {
	// 编译模板,处理文本节点和元素节点
	constructor(vm){
		this.vm = vm
		this.el = vm.$el
		this.compile(this.el)
	}
	compile(el){
		Array.from(el.childNodes).forEach(node=>{
			if (this.isTextNode(node)){
				this.compileText(node)
			} else if (this.isElementNode(node)) {
				this.compileElement(node)
			}
			// 当前节点下的子节点
			if (node.childNodes && node.childNodes.length) {
				this.compile(node)
			}
		})
	}
	// 判断是否是文本节点
	isTextNode(node){
		return node.nodeType === 3
	}
	// 解析文本节点
	compileText (node) {
		let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
			new Watcher(this.vm, key, (newValue) => {
				node.textContent = newValue
			})
		}
	}
	// 判断是否是元素节点
	isElementNode(node){
		return node.nodeType === 1
	}
	// 判断元素指令
	isDirective(attrName){
		return attrName.startsWith('v-')
	}
	// 解析元素节点
	compileElement (node) {
		Array.from(node.attributes).forEach(attr => {
			let attrName = attr.name
			if (this.isDirective(attrName)){
				attrName = attrName.substr(2)
				let key = attr.value
				if (attrName.indexOf(':')!==-1) {
					let eventType = attrName.split(':')[1]
					this.handleEvent(node,eventType,key)
				}
				this.update(node, key, attrName)
			} 
		})
	}
	// 对v-指令进行封装处理
	update (node, key, attrName) {
		let updateFn = this[attrName + 'Updater']
		updateFn && updateFn.call(this, node , key, this.vm[key])
	}
	// 处理 v-text 指令
	textUpdater (node, key, value) {
		node.textContent = value
		new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
	}
	// 处理 v-model
	modelUpdater(node, key, value) {
		node.value = value
		new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
		node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
	}
	// 处理 v-html
	htmlUpdater (node,key,value){
		node.innerHTML = value
		new Watcher(this.vm, key, (newValue)=>{
			node.innerHTML = newValue
		})
	}
	// 处理 v-on
	handleEvent(node,eventType,key){
		node.addEventListener(eventType,()=>{
			this.vm.$options.methods[key]()
		})
	}
}