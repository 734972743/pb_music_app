<template>
	<view class="">
		<navigator :url="'../../pages/index/musicDetails?songId='+music.songId" class="musicList" v-for="(music,index) in  musicList">
			<image class="musicImg" :src="music.imgUrl|songImageFilter" ></image>
			<view class="musicName">{{music.songName|songNameFilter}}</view>
			<view class="musicOperation">
				<text :class="[iconfont, music.isCollection ? iconlove1 : iconlove ]" 
				:id= "'main-collection-buttom-'+index"
				@tap.stop="collectionMusic"></text>
				<!-- <text class="iconfont iconshoucang" @click="playMusic"></text> -->
				
				
			</view>
		</navigator>
		
		<view class="playView"  v-if="playMusic" @click="goTOMusic">
			<image class="playMusicImgage" :src="playMusic && playMusic.imgUrl|songImageFilter" ></image>
			<view class="playMusicName">{{playMusic && playMusic.songName|songNameFilter}}</view>
			<text :class="[iconfont, playMusic && playMusic.isPlay ? iconzanting: iconbofang  ,playMusicState]" ></text>
		</view>
		
		
		
		
		 <popup-layer ref="collectionRef" :direction="'top'" >
			<view class="box" >
				<list>
					<view class="collectionList" v-for="(collection,index) in collectionList" >
						<view class="collectionName">
							{{collection.songListName}}
						</view>
						<view><button class="collectionButtion" type="default" @tap="addSongToCollection(index)">选择</button></view>
						
					</view>
				</list>
				<van-button class="addCollection" @tap="openNewCollection">添加新收藏夹</van-button>
			</view>
		</popup-layer>
		
		<popup-layer ref="newCollectionRef" :direction="'top'" >
			<view class="box" >				
				<evan-form :hideRequiredAsterisk="hideRequiredAsterisk" ref="newCollectionFormRef" :model="newCollectionForm">
							<evan-form-item label="收藏夹名称：" prop="collectionName">
								<input class="form-input" placeholder-class="form-input-placeholder" v-model="newCollectionForm.collectionName" placeholder="请输入收藏夹名称" />
							</evan-form-item>
							<evan-form-item label="收藏夹简介：" prop="introduce">
								<input class="form-input" placeholder-class="form-input-placeholder" v-model="newCollectionForm.introduce" placeholder="请输入收藏夹简介" />
							</evan-form-item>
							<evan-form-item label="是否公开：" prop="songListStateId">
								<radio-group  v-model="newCollectionForm.songListStateId">
									<label>
										<radio value="0" checked="true" /><text>是</text>
									</label>
									<!-- <label>
										<radio value="1" /><text>否(vip)</text>
									</label>  -->
								</radio-group>
							</evan-form-item>
							
						</evan-form>
						<button @click="saveNewCollectionForm" class="evan-form-show__button">保存</button>
			</view>
		</popup-layer>
	</view>
	
</template>

<script>
	var that ;
	import musicApi from "../../api/music.js";
	import * as common from "../../utils/common.js";
	//import xyDialog from '@/components/xy-dialog/xy-dialog.vue';
	import popupLayer from '@/components/popup-layer/popup-layer.vue';
	
	import EvanForm from '@/components/evan-form/evan-form.vue'
	import EvanFormItem from '@/components/evan-form/evan-form-item.vue'
	
	//import  PubSub from "pubsub-js";
	
	let innerAudioContext = null;
	let playViewTop = ""
	
	export default {
		
		components: {
			popupLayer,
			EvanForm,
			EvanFormItem
		},
		
		data(){
			return{
				currentPage: 1,
				pageSize: 10,
				searchMap:{
					songName: "",
					typeId: []
				},
				musicList:[
					{
						
					}
				],
				user:null,
				iconfont: "iconfont",  // class样式
				iconlove:"iconlove",
				iconlove1:"iconlove1",
				
				iconbofang:"iconbofang",
				iconzanting:"iconzanting",
				playMusicState:"playMusicState",
				
				collectionSongList:[] ,  //所有已收藏的歌曲列表
				toCollectionSongIndex: 0,   //这个是要添加收藏歌曲的下标
				songListId: "", //这个是选择的收藏夹的ID
				isShowCollection: false,
				collectionList:[],  //这个是收藏夹列表
				isShowNewCollection: false    ,//是否显示新收藏夹弹出框
				newCollectionForm:{
					collectionName:"",
					introduce:"",
					songListStateId:0
				},
				
				newCollectionFormRules: {
					collectionName: {
						required: true,
						message: '收藏夹名称不能为空'
					},
					introduce: {
						required: true,
						message: '收藏夹简介不能为空'
					},
					songListStateId: {
						required: true,
						message: '请选择是否公开'
					},
				},
				
				xx: 0,   
				playMusic:null,
				isPlay:false,
			
				//playViewTop:0  //playView的y坐标
			}
		},
		
		
		onReady(){
			uni.clearStorageSync("play-music");   
		},
		
		onLoad() {
			
			let audio = uni.createInnerAudioContext();
			audio.title = '致爱丽丝';
			audio.singer = '暂无';
			audio.coverImgUrl = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg';
			audio.src = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3';
			
			this.user = uni.getStorageSync("pb-music-user");
			that = this;
			
			//获取当前用户的所有已收藏歌曲列表
			this.fetchDataCollectionSongList();
			this.fetchData();
			
			
			
			
			// 这里必须放在$nextTick中，不然h5会找不到this.$refs.form
			this.$nextTick(() => {
				this.$refs.newCollectionFormRef.setRules(that.newCollectionFormRules);
			})
			
	// 		if(!innerAudioContext){
	// 			innerAudioContext = uni.createInnerAudioContext();
	// 			//innerAudioContext = uni.getBackgroundAudioManager();
	// 		}else{
	
	// 		}
	
			//获取屏幕的宽高
			 uni.getSystemInfo({
				 success(res){
					playViewTop = res.windowHeight -50 +"px";
					// that.windowWidth = res.windowWidth;
				 }
				// success(res){
				// 	console.log("getSystemInfo",res);
				// 	that.windowHeight = res.windowHeight;
				// 	that.windowWidth = res.windowWidth;
				// 	that.playViewTop = res.windowHeight - 
				// }
			});
			
		},
		
		onShow() {
			this.user = uni.getStorageSync("pb-music-user");  // 每次页面刷新时就获取用户信息
			this.collection = uni.getStorageSync("pb-music-collection");
			this.playMusic = uni.getStorageSync("play-music");
		
		},
		
		onPullDownRefresh() {
			if(this.currentPage > 0){
				this.currentPage --;
				this.fetchData();
			}
				
		},
		onReachBottom() {
			this.currentPage ++;
			this.fetchData();	
		},
		
		methods:{
			
			
			//刷新页面
			refreshPage(){
				console.log("刷新页面");
				// uni.redirectTo({
				// 	url:"pages/index/null"
				// })
				//that.onLoad();
			//	location.reload();
			   that.xx ++ ;
			   console.log("that.xx",that.xx);
			  // this.fetchDataCollectionSongList();
			  // this.fetchData();
			  uni.navigateBack();  
			},
			
			fetchData(){
				
				musicApi.getMusicSearch(this.currentPage,this.pageSize,this.searchMap,function(response){
					let resp = response.data;
					if(resp.code == 200){
						that.musicList = resp.data;
						uni.stopPullDownRefresh();   //结束下拉刷新
						//let date1 = new Date();
						for(let i=0;i<that.musicList.length;i++){
							that.musicList[i].isCollection = false;
							for(let j=0; j< that.collectionSongList.length;j++){
								if(that.musicList[i].songId == that.collectionSongList[j].songId ){
									that.musicList[i].isCollection = true;
									break;
								}
							}
						}
					}
					
				})
			},
			
			//获取当前用户的所有已收藏歌曲列表
			fetchDataCollectionSongList(){
				musicApi.getCollectionSongByUserId(that.user.userId,function(response){
					let resp = response.data;
					if(resp.code == 200){
						that.collectionSongList = resp.data;
					}
				});
			},
			
			//收藏音乐
			collectionMusic(e){
				if(!this.user){
					uni.showModal({
						title: '提示',
						content: '登录成功后，才可以收藏音乐',
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
					this.songListId == ""; //收藏夹ID重置
				}
				let id = e.currentTarget.id; 
				that.toCollectionSongIndex = id.substring(id.lastIndexOf("-")+1);  //去歌曲的下标
				console.log("that.toCollectionSongIndex",that.toCollectionSongIndex)
				if(!that.musicList[that.toCollectionSongIndex].isCollection){  // 如果该歌曲没有收藏的话
					//进入收藏夹列表页面
					//that.isShowCollection = true;
					that.$refs.collectionRef.show();
					musicApi.getgetSongListsByUserId(that.user.userId,function(response){
						let resp = response.data;
						if(resp.code == 200){
							that.collectionList = resp.data;
						}
					});
					that.refreshPage();
				}else{
					musicApi.deleteSongListWithSong(that.collection.songListId ,that.musicList[that.toCollectionSongIndex],function(response){
						let resp = response.data;
						if(resp.code == 200){
							//刷新页面
							that.refreshPage();
						}
					});
				}
				
			},
			
			cancelCollection(){
				that.isShowCollection = false;
			},
			
			//把这首歌添加到收藏夹里面
			addSongToCollection(index){
				let songListId  = that.collectionList[index].songListId;
				let music = that.musicList[that.toCollectionSongIndex];
				musicApi.addSongListWithSong(songListId,music,function(response){
					let resp = response.data;
					if(resp.code == 200){
						that.$refs.collectionRef.close();
						let pbMusicCollection ={};
						pbMusicCollection.songListId = songListId;
						pbMusicCollection.songId = music.songId;
						uni.setStorageSync("pb-music-collection",pbMusicCollection);
					}
				});
			},
			
			//打开新建收藏夹弹出框
			openNewCollection(){  
				that.$refs.collectionRef.close();
				that.$refs.newCollectionRef.show();
				
			},
			
			
			//保存新添加的收藏夹
			saveNewCollectionForm(){
				that.$refs.newCollectionFormRef.validate((vali)=>{
					if(vali){
						musicApi.addUserWithSongList(that.newCollectionForm,that.user.userId,function(response){
							let resp = response.data;
							if(resp.code == 200){
								that.$refs.newCollectionRef.close();
								that.$refs.collectionRef.show();
								that.newCollectionForm.songListId = resp.data;
								that.newCollectionForm.userId = that.user.userId
								uni.setStorageSync("pb-music-collection",that.newCollectionForm);
							}
						})
					}else{
						uni.showToast({
							title: '请填写完整',
							icon:"none"
						})
					}
				})
			},
			
			goTOMusic(){
				console.log("goTOMusic",that.playMusic.isPlay);
				uni.navigateTo({
					url: '../../pages/index/musicDetails?songId='+that.playMusic.songId+'&isPlay='+ !that.playMusic.isPlay
				});
			}
		}
	}
</script>


<style lang="scss">
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
		height: 76px;
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
	
	.addCollection{
		margin-top: 50px;
	}
	
	.uni-form-item view{
		/* display: flex; */
	}
	.uni-input{
		border: 1px solid #8F8F94;
	}
	
	 .uni-form-item .title {
	        padding: 20rpx 0;
	    }
		
	.evan-form-show {
			padding: 0 30rpx;
			.form-input {
				font-size: 28rpx;
				color: #333;
				text-align: right;
			}
			.form-input-placeholder {
				font-size: 28rpx;
				color: #999
			}
			&__button {
				width: 100%;
				height: 88rpx;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0;
				font-size: 36rpx;
				color: #fff;
				margin-top: 20rpx;
				background-color: #2D87D5;
				&::before,
				&::after {
					border: none;
				}
			}
		}
		.collectionList{
			border-bottom: 1px solid black;
		}
		
		.collectionList view {
			display: block;
		}
		.collectionName {
			margin-left: 10px;
			margin-top: 8px;
		}
		
		.collectionButtion{
			width: 60px;
			height: 30px;
			font-size: 12px;
			margin-bottom: 5px;
		}
		
		.playView{
			position: fixed;
			width: 100%;
			height: 50px;
			top: 406px;
			//top: $playViewTop ;
			background-color:#50B7EA;
			border-radius: 34px;
			
			.playMusicImgage{
				position: fixed;
				width: 48px;
				height: 48px;
				left: 0px;
				top: 410px;	
				border-radius: 30px;
			}
			
			.playMusicName{
				position: fixed;
				left: 78px;
				top: 421px;
				max-width:172px ;
				white-space: nowrap;
				//word-wrap: break-word;
				overflow:hidden;
				text-overflow: ellipsis;
			
			}
			
			.playMusicState{
				position: fixed;
				left: 262px;
				top: 415px;
			}
			
		}
</style>
