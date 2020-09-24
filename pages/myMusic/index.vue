<template>
	<view class="">
		
		
		
		 <view class="" v-if="!isLogin">
			 
			 
			 <view class="" v-if="isWeixin">
			 	<!-- #ifdef MP-WEIXIN -->
			 		<button type="primary" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true" >微信登录</button>
			 	<!-- #endif -->
			 </view>
			 
			 
			 <view class="" v-else>
			 	<!-- #ifdef APP-PLUS -->
			 		
			 		<!-- 用户登录 -->
			 		<view class="messageForm" >
			 			<evan-form  ref="userLoginFormRef" :model="userLoginForm">
			 						<evan-form-item label="账号:" prop="content">
			 							<input class="form-input" placeholder-class="form-input-placeholder" v-model="userLoginForm.loginId" placeholder="请输入账号" />
			 						</evan-form-item>
			 						<evan-form-item label="密码:" prop="content">
			 							<input class="form-input" placeholder-class="form-input-placeholder" v-model="userLoginForm.password" placeholder="请输入密码" />
			 						</evan-form-item>
			 					</evan-form>
			 					<button @click="userLoginBtn" class="evan-form-show__button">登录</button>
								<button @click="userRegisterBtn" class="evan-form-show__button">注册</button>
			 		</view>
			 	<!-- #endif -->
			 </view>
			
			
		</view>
		 <view class="" v-else>
			<image src="../../static/bg_profile.jpg" class="myMusicImageBackground" ></image>
			<image :src="user && user.headSculptureUrl" mode="widthFix" class="headSculptureUrl"></image>
			<view class="userName">
				{{user.userName}}
			</view>
			
			<!-- <navTab class="navTab" ref="navTab" :tabTitle="tabTitle" @changeTab='changeTab'></navTab> -->
			
			<!-- glance 滑动导航栏组件 -->
			<glanceSlideNavTabBar 
			    topfixedval='0px' 
			    :topfixed=true 
			    @clickitem="changeTab" 
			    :data = "tabList">
			</glanceSlideNavTabBar>
			
			<view ref="navTabContent" class="navTabContent">
				
				<view class="myLike" v-if="isNavTabView0">
					<!-- 我喜欢 -->
					<navigator :url="'../../pages/index/musicDetails?songId='+music.songId" class="musicList" v-for="(music,index) in  myLikeMusicList" :key="music.songId">
						<image class="musicImg" :src="music.imgUrl|songImageFilter" mode="widthFix"></image>
						<view class="musicName">{{music.songName|songNameFilter}}</view>
						<view class="musicOperation">
							<text class="iconfont iconshoucang" 
							:id= "'main-collection-buttom-'+index"
							@tap.stop="collectionMusic"></text>
							<!-- <text class="iconfont iconshoucang" @click="playMusic"></text> -->
						</view>
					</navigator>
				</view>
				
				
				
			
				<view v-if="isNavTabView1">
					<!-- 收听历史 -->
					<button class="clearAllHistoryBtn" type="warn" @click="clearAllHistory">清除所有的收听记录</button>
					<navigator :url="'../../pages/index/musicDetails?songId='+music.songs[0].songId" class="myHistorymusicList" v-for="(music,index) in  myHistoryMusicList" :key="music.songId">
						<image class="musicImg" :src="music.songs[0].imgUrl|songImageFilter" mode="widthFix"></image>
						<view class="musicName">{{music.songs[0].songName|songNameFilter}}</view>
						<view class="historyTime">
							{{music.historyDate}}
						</view>
						
					</navigator>
				</view>
				<view class="createCollectionListTable" v-if="isNavTabView2">
					
					<t-table border="2" border-color="#95b99e" :is-check="true">
						<t-tr font-size="14" color="#95b99e" align="left">
							<t-th align="left">歌单名</t-th>
							<t-th align="left">歌单简介</t-th>
							<t-th align="left">曲目数</t-th>
							<t-th align="left">收听次数</t-th>
							<t-th align="center">操作</t-th>
						</t-tr>
						<t-tr font-size="12" style="height: 50px;" color="#5d6f61" align="right" v-for="(collection,index) in myCreateCollectionList" :key="collection.songListId">
							<t-td align="left">{{ collection.songListName }}</t-td>
							<t-td align="left">{{ collection.introduce }}</t-td>
							<t-td align="left">{{ collection.collectionCount }}</t-td>
							<t-td align="left">{{ collection.accessAount }}</t-td>
							<t-td align="left"><button class="createCollectiontTbleButton" @click="openCollection(collection)">选择</button></t-td>
						</t-tr>
					</t-table>
		
				</view>
				
				<view v-if="isNavTabView3">
					该组件正在开发中。。。
					<view class="">
						sdfsdfd
					</view>
				</view>
			</view>
		</view> 
		

	

	</view>
</template>

<script>
	
	//import navTab from "@/components/zhaowenyu-list/navTab.vue";    //这个组件参考 https://ext.dcloud.net.cn/plugin?id=443

	import glanceSlideNavTabBar from  "@/components/glance-SlideNavTabBar/glance-SlideNavTabBar.vue";   //请参考 https://ext.dcloud.net.cn/plugin?id=145
	//import myLikeSong from "@/pages/myMusic/myLike.vue";  
	
	import tTable from '@/components/t-table/t-table.vue';  //组件参考： https://ext.dcloud.net.cn/plugin?id=413
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue'; 
	
	import musicApi from "@/api/music.js";
	import userApi from "@/api/user.js";
	
	import EvanForm from '@/components/evan-form/evan-form.vue'
	import EvanFormItem from '@/components/evan-form/evan-form-item.vue'
	import popupLayer from '@/components/popup-layer/popup-layer.vue';
	
	let that;
	export default {
		components:{
			//navTab,
			glanceSlideNavTabBar,
		//	myLikeSong,
			tTable,
			tTh,
			tTr,
			tTd,
			popupLayer,
		},
		data() {
			return {
				isWeixin: true,  //判断是否是微信还是andorid程序
				userLoginForm:{
					loginId: "",
					password: ""
				},
				
				isLogin: false,
				userRegister: {}, //用户注册信息
				user:null,
				currentTab: 0, //sweiper所在页
				// tabTitle:['选择一','选择二','选择三','选择四'], //导航栏格式
				tabList:[{textcontent:'我喜欢'},
			            {textcontent:'收听历史'},
			            {textcontent:'我创建的歌单'},
			            {textcontent:'我上传的歌曲'}],
						
				isNavTabView0: true,		
				isNavTabView1: false,
				isNavTabView2: false,
				
				
				myLikeMusicList:[],   //我喜欢的歌曲列表
				myHistoryMusicList:[],  //我的收听历史列表
				myCreateCollectionList:[],  //我创建的歌单列表
				
				
				//校验规则
				userLoginFormRules: {
					loginId: {
						required: true,
						message: '账号不能为空'
					},
					password: {
						required: true,
						message: '密码不能为空'
					},
				},
				
			}
		},

		onLoad() {
			that = this;
			this.isLogin = global.isLogin();
			this.isWeixin = uni.getSystemInfoSync().platform !== 'android' 
			
			// 这里必须放在$nextTick中，不然h5会找不到this.$refs.form
			this.$nextTick(() => {
				this.$refs.userLoginFormRef.setRules(that.userLoginFormRules);
			})

		},
		
		onShow() {	
			this.user = uni.getStorageSync("pb-music-user");  // 每次页面刷新时就获取用户信息
		},
		
		onReady(){
			that = this;
		},

		methods: {
			getuserinfo: function(res) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						if (!res.detail.iv) {
							uni.showToast({
								title: "你取消了授权",
								icon: "none",
							})
							return false;
						}

						that.isLogin = true;


						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log('用户昵称为：' + infoRes);
								console.log(JSON.stringify(infoRes));
								that.infoRes = infoRes;
							}
						});

						//登录凭证校验。通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程。更多使用方法详见 小程序登录。
						uni.request({
							url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx6ccb429aaf7dcb89&secret=dc4e17ab8476ea0c027b2aad3580c3a6&js_code=" +
								loginRes.code + "&grant_type=authorization_code",
							method: "GET",
							success: function(res3) {
								console.log("res3", res3);
								//把oppenid和sessionkey保存到本地
								try {
									uni.setStorageSync("openid", res3.data.openid);
									uni.setStorageSync("session_key", res3.data.session_key);
								} catch (e) {
									//TODO handle the exception
								}
								// //以下步骤可以获取加密信息，需要授权
								//获取加密信息
								var session_key = uni.getStorageSync("session_key");

								//先从数据库中查询是否有这个用户，没有就注册这个用户
								let userQuery = {};
								userQuery.loginId = res3.data.openid,
									userQuery.password = "123456",
									userApi.getUsers(userQuery, function(response) {
										if (response.data.data && response.data.data.length <= 0) {
											that.userRegister.loginId = res3.data.openid;
											that.userRegister.password = "123456";  //密码默认为 123456

						
											// JSON.parse()【从一个字符串中解析出json对象】
											// JSON.stringify()【从一个对象中解析出字符串】
											let rawData =  JSON.parse(that.infoRes.rawData);
										
											that.userRegister.userSex = rawData.gender;
											that.userRegister.userName = rawData.nickName;
											that.userRegister.headSculptureUrl = rawData.avatarUrl;
											that.userRegister.userType = '0';
											that.userRegister.userStateId = '0';
											
											console.log("注册");
											console.log("that.userRegister", that.userRegister)
											//	注册用户
											userApi.register(that.userRegister, function(response2) {
												let resp2 = response2.data;
												if (resp2.code == 200) {
													//把用户信息保存
													uni.setStorageSync("pb-music-user", resp2.data);
													 that.user = resp2.data;
												}
											});
										} else {
											
											uni.setStorageSync("pb-music-user", response.data.data[0]);
										}
									})



							}
						})
					}
				});
			},
			
			//tab事件
			 changeTab(index,val){
				 console.log("changeTab",index,val)
				//this.currentTab = index;
				
				that.isNavTabView0 = false;
				that.isNavTabView1 = false;
				that.isNavTabView2 = false;
				that.isNavTabView3 = false;
				
				
				switch(index){
					case 0:
					  that.isNavTabView0 = true;
					  break;
					case 1:
					  that.isNavTabView1 = true;
					  break;
					case 2:
					  that.isNavTabView2 = true;
					  break;
					case 3:
					  that.isNavTabView3 = true;
					  break;			  
				}
				
			},
			
			fetchDataMyLike(){
				musicApi.getCollectionSongByUserId(that.user.userId,function(response){
					let resp = response.data;
					console.log("resp",resp);
					if(resp.code == 200){
						
						that.myLikeMusicList = resp.data;
					}
				})
			},
			
			fetchDataMyHistory(){
				musicApi.getUserHistorySongsByUserId(that.user.userId,function(response){
					let resp = response.data;
					console.log("resp",resp);
					if(resp.code == 200){
						let data = resp.data;
						 data.forEach(e => {
							let date = new Date(e.historyDate);
							console.log("date",date);
							e.historyDate = date.formate("yyyy-MM-dd HH:mm:ss");
						});
						that.myHistoryMusicList = data;
					}
				})
			},
			
			clearAllHistory(){
				musicApi.deleteAllHistorySongByUserId(that.user.userId,function(response){
					let resp = response.data;
					if(resp.code == 200){
						uni.showToast({
							title:"清除收听历史成功",
							
						})
					}
				});
			},
			
			fetchDataMyCreateCollection(){
				musicApi.getgetSongListsByUserId(that.user.userId,function(response){
					let resp = response.data;
					console.log("resp",resp)
					if(resp.code ==200){
						that.myCreateCollectionList = resp.data;
					}
				});
			},
			
			openCollection(item) {
				
			},
			
			userLoginBtn(){
				debugger
				that.$refs.userLoginFormRef.validate((vali)=>{
					if(vali){
						userApi.login(that.userLoginForm,(response)=>{
							let resp = response.data;
							console.log("resp",resp);
							if (resp.flag) {
							  that.isLogin = false;
							  uni.setStorageSync("pb-music-user", resp.data);
							  that.user = resp.data;  
							}
						});
					}
				});
			},
			
			userRegisterBtn(){
				uni.navigateTo({
				    url: 'register'
				});
			}
			
			
			
		},
		
		computed:{
			isNavTabView0Com:{
				get(){
					that.fetchDataMyLike();	
					return that.isNavTabView0;
				}
			},
			isNavTabView1Com:{
				get(){
					that.fetchDataMyHistory();	
					return that.isNavTabView1;
				}
			},
			
			isNavTabView2Com:{
				get(){
					that.fetchDataMyCreateCollection();	
					return that.isNavTabView2;
				}
			},
		}
	}
</script>

<style lang="scss">
	.myMusicImageBackground{
		width: 100%;
		height: 110px;
	}
	
	.headSculptureUrl{
		border-radius: 53px;
		width: 50px;
		position: absolute;
		top: 17px;
		left: 120px;
	}
	
	.userName{
		position: absolute;
		top: 76px;
		left: 125px;
		font-size: 13px;
		font-weight: bold;
		color: white;
	}
	.navTab{
		position: relative;
	}
	
	
	.myLike{
		.musicList{
			display: flex;
			flex-wrap: nowrap;
			/*  三个view ,左边左对齐，右边右对齐 */
			flex-flow: row nowrap;
			justify-content: space-between;
			align-content: flex-start;
		}
		
		.musicImg{
			width: 100px;
			flex-shrink: 0;
			
		}
		
		.musicName{
			font-size: 14px;
			text-align: center;
			margin-top: 19px;
		}
		
		.musicOperation{
			margin-top: 21px;
		}
		
		.musicOperation .iconfont{	
			font-size: 20px;	
			margin-right: 8px;
		}
	}
	
	.myHistorymusicList {
		view {
				display: inline;
		}
		
		.musicImg{
			width: 100px;
			flex-shrink: 0;
			
		}
		
		.musicName{
			font-size: 14px;
			text-align: center;
			margin-top: 19px;
		}
		
		
		
	}
	
	
	.clearAllHistoryBtn{
		width: 192px;
		
	}
	
	.createCollectionListTable table{border:1px solid #F00} 
	
	.createCollectionListTable td{
		display: inline;
		margin-left: 10px;
		float: left;
	}
	.createCollectionListTable tr{
		word-break: break-all;/*必须*/
	}
	
	.createCollectionList .accessAount{
		float: none;
	}
	.createCollectionList{
		margin-top: 20px;
	}
	
	.createCollectiontTbleButton{
		width: 43px;
		height: 50px;
		font-size: 10px;
		text-align: center;
	}
</style>
