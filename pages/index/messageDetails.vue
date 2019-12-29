<template>
	<view class="">
		<view class="messageTitle">
			评论列表
		</view>
		<view class="" v-if="messageList.length === 0">
			暂无评论
		</view>
		<view class="" v-else>
			<view class="messageList" v-for="message in messageList">
				<text class="messageUser">
					{{message.userName}}
				</text>
				<text class="messageContent">
					{{message.content}}
				</text>
			</view>
		</view>
		
		<!-- 添加评论 -->
		<view class="messageForm" >
			<evan-form :hideRequiredAsterisk="hideRequiredAsterisk" ref="newMessageFormRef" :model="newMessageForm">
						<evan-form-item label="评论:" prop="content">
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="newMessageForm.content" placeholder="请输入评论" />
						</evan-form-item>
					</evan-form>
					<button @click="saveMessageForm" class="evan-form-show__button">提交</button>
		</view>
	</view>
</template>

<script>
	let that; 
	import messageApi from "../../api/message.js";
	import EvanForm from '@/components/evan-form/evan-form.vue'
	import EvanFormItem from '@/components/evan-form/evan-form-item.vue'
	
	export default{
		components:{
			EvanForm,
			EvanFormItem
		},
		
		data(){
			return{
				messageList:[],
				songId: 0,
				newMessageForm:{
					content:""
				},
				user:null,
				newMessageFormRules: {
					content: {
						required: true,
						message: '评论不能为空'
					},
				},
			}
		},
		
		onLoad(e) {
			console.log(e);
			that = this;
			that.songId = e.songId;

			this.fetchData();
		
			
			// 这里必须放在$nextTick中，不然h5会找不到this.$refs.form
			this.$nextTick(() => {
				this.$refs.newMessageFormRef.setRules(that.newMessageFormRules);
			})
		},
		
		onShow() {
			this.user = uni.getStorageSync("pb-music-user");  // 每次页面刷新时就获取用户信息
		},
		
		methods:{
			fetchData(){
				messageApi.getMessagesBySongId(that.songId,1,10,function(response){
					let resp = response.data;
					if(resp.flag){
						that.messageList = resp.data;
						let userLiset = resp.obj;
						
						for(let i=0; i<that.messageList.length; i++){
							for(let j=0; j<userLiset.length;j++){
								if(that.messageList[i].userId == userLiset[j].userId){
									that.messageList[i].userName = userLiset[j].userName;
									break;
								}
							}
						}
						console.log("that.messageList",that.messageList)
					}
				});
			},
			
			saveMessageForm(){
				that.$refs.newMessageFormRef.validate((vali)=>{
					if(vali){
						if(!this.user){
							uni.showModal({
								title: '提示',
								content: '登录成功后，才可以发表评论',
								success: function (res) {
									if (res.confirm) {
										uni.switchTab({  //切换到指定的tab中
										    url: '/pages/myMusic/index'
										});
										return false;
									} else if (res.cancel) {
										return false;
									}
								}
							});
						}else{
							let message = {};
							message.songId =  this.songId;
							message.content = this.newMessageForm.content;
							message.userId = this.user.userId;
							messageApi.replyMessage(message,(response)=>{
								let resp = response.data;
								console.log("resp",resp);
								if(resp.code == 200){
									uni.showToast({
										title: '评论发表成功',
										icon:"success",
										duration: 2000
									})
								}
							});
						}
						
					}
				})
			}
		}
	}
</script>

<style>
	.messageTitle{
		font-size: 20px;
		color: #555555;
		text-align: center;
		margin-top: 15px;
		margin-bottom: 15px;
	}
	
	.messageList text{
		font-size: 16px;
	}
	
	.messageList .messageUser{
		margin-left: 20px;
		color: #007AFF;
	}
	
	.messageList .messageContent{
		margin-left: 40px;
		color: #4CD964;
	}
	
	.messageForm{
		margin-top: 20px;
	}
	
	evan-form .evan-form-item-container__labe{
		font-size: 30px;
		color: red;
	}
	
	.form-input{
		margin-left: 15px;
	}
</style>
