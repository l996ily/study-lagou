class Dep {
	constructor(){
		// 存储所有的观察者
		this.subs = []
	}
	addSub (sub) {
		if (sub && sub.update){
			this.subs.push(sub)
		}
	}
	nodify () {
		this.subs.forEach(sub => {
			sub.update()
		})
	}
}