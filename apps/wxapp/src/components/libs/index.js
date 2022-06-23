const { useGlobalIconFont } = require('./iconfont/helper')

const nativeComponentList = {
	...useGlobalIconFont(),	// iconfont
}

module.exports = {
	nativeComponentList
}