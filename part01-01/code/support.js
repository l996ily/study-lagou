// 基于下面提供的代码,完成后续的四个练习
class Container {
	static of(value) {
		return new Container(value)
	}

	constructor(value) {
		this._value = value
	}

	map(fn){
		return Container.of(fn(this._value))
	}
}

class Maybe {
	static of(x) {
		return new Maybe(x)
	}

	isNothing() {
		return this._value === null || this._value === undefined
	}

	constructor(x) {
		this._value = x
	}

	map(fn){
		return this.isNothing() ? this : Maybe.of(fn(this._value))
	}
}
module.exports = { Maybe, Container}