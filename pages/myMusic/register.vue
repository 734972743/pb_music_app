<template>
	<vue>
		<!-- 用户注册 -->
		<view class="messageForm" >
			<evan-form :hideRequiredAsterisk="hideRequiredAsterisk" ref="userRegisterFormRef" :model="userRegisterForm">
				<evan-form-item label="账号:" prop="loginId">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="userRegisterForm.loginId" placeholder="请输入账号" />
				</evan-form-item>
				<evan-form-item label="密码:" prop="password">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="userRegisterForm.password" placeholder="请输入密码" />
				</evan-form-item>
				<evan-form-item label="确认密码:" prop="registerCheckPassword">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="userRegisterForm.registerCheckPassword" placeholder="请再次输入密码" />
				</evan-form-item>
				<evan-form-item label="昵称:" prop="userName">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="userRegisterForm.userName" placeholder="请输入昵称" />
				</evan-form-item>
				<evan-form-item label="性别:" prop="userSex">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="userRegisterForm.userSex" placeholder="请输入性别" />
					<radio-group  v-model="userRegisterForm.userSex">
						<label>
							<radio value="0" checked="true" /><text>男</text>
						</label>
						<label>
							<radio value="1" /><text>女</text>
						</label>  
					</radio-group>
				</evan-form-item>
			</evan-form>
			<button @click="toUserRegisterBtn" class="evan-form-show__button">注册</button>
		</view>
		
		
	</vue>
</template>

<script>
	import EvanForm from '@/components/evan-form/evan-form.vue'
	import EvanFormItem from '@/components/evan-form/evan-form-item.vue'
	
	import userApi from "@/api/user.js";
	
	let that;
	export default{
		components:{
			EvanForm,
			EvanFormItem
		},
		
		data(){
			return{
				userRegisterForm:{
					loginId: "",
					password: "",
					userName: "",
					userSex: "0",
					registerCheckPassword: ""
				},
				
				userRegisterFormRules:{
					loginId: {
						required: true,
						message: '账号不能为空'
					},
					password: {
						required: true,
						message: '密码不能为空'
					},
				}
			}
		},
		
		onLoad() {
			that = this;
			// 这里必须放在$nextTick中，不然h5会找不到this.$refs.form
			this.$nextTick(() => {
				this.$refs.userRegisterFormRef.setRules(that.userRegisterFormRules);
			})
		},
		
		methods:{
			toUserRegisterBtn(){
				that.$refs.userRegisterFormRef.validate((vali)=>{
					if(vali){
						userApi.register(that.userRegisterForm,(response)=>{
							let resp = response.data;
							if(resp.code == 200){
								uni.setStorageSync("pb-music-user", resp.data);
								uni.navigateTo({
								    url: 'index'
								});
							}
						});
					}
				});
			}
		}
	}
</script>

<style>
</style>
