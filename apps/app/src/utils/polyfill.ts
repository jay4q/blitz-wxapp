// 解决iOS不支持Promis.finally的问题
(function () {
	if (typeof Promise.prototype.finally === 'function') {
		return
	}

	Promise.prototype.finally = function (callback: any) {
		let P = this.constructor
		return this.then(
			value => P.resolve(callback()).then(() => value),
			reason => P.resolve(callback()).then(() => { throw reason })
		)
	}
})()