import * as common from "../utils/common.js";

export default{
	
	 //登录
	  login(userForm,callback) {
	    return uni.request({
	      url: common.VUE_APP_JAVA_URL+`/user/login`,
	      method: "POST",
	      data: {
	        loginId: userForm.username,
	        password: userForm.password
	      },
		  success: callback
	    });
	  },
	
	
	//注册用户
	register(userForm,callback) {
		return uni.request({
		  url: common.VUE_APP_JAVA_URL+"/user/register",
		  method: "POST",
		  data: {
			//user: userForm
			loginId: userForm.loginId,  //登录名
			password: userForm.password,  //密码
			userName: userForm.userName,   //昵称
			userSex: userForm.userSex     ,//性别
			headSculptureUrl: userForm.headSculptureUrl ?  userForm.headSculptureUrl : ''    ,// 头像
			userType: userForm.userType ?  userForm.userType : ''    ,// 用户类别
			userStateId: userForm.userStateId ?  userForm.userStateId : ''    ,// 用户状态
		  },
		  success: callback   //成功后的回调函数
		});
	  },
	  
	 
	 //查询用户
	  getUsers(user,callback) {
		return uni.request({
		  url: common.VUE_APP_JAVA_URL+`/user/getUsers`,
		  method: "POST",
		  data: {
			userId: user.userId ? user.userId : '', 
			loginId: user.loginId ? user.loginId: '',
			password: user.password ? user.password : '' ,
		  },
		  success: callback
		});
	  }, 
	
}
