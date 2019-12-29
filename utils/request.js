
const request = uni.request({
	timeout:30000,
})


//在请求和响应中加入拦截器 Interceptors
//我们在拦截器中加入加载动画
//需要注意的是，以服务的方式调用的全屏 Loading 是单例的

export default request ;