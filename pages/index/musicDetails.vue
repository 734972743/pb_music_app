<template>
	<view class="musicDetails">
		<view class="musicTitle">{{song.songName|songNameFilter}}</view>
		<view>{{song.singerId||""}}</view>
		<image class="musicImg" :src="song.imgUrl|songImageFilter" ></image>
		<view class="musicProgress">
			<!-- <van-progress class="" :percentage="percentMusic" :inactive="false" :pivot-text="progressTimeStr"/> -->
			<!-- <van-slider v-model="percentMusic" active-color="#ee0a24" @change="onChangeProgress"> 
			</van-slider> -->
			<slider  @change="onChangeProgress" :value="percentMusic" activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9" block-size="20" />
			
			<view slot="button" class="progressTimeStr">
			  {{ progressTimeStr }}
			</view>
			
		</view>
		
		<view class="playOperationTop">
			<text class="iconfont icondingdan" @click="getMessageCount"></text>
			
			<text class="iconfont iconxiaoxi" @click="isShowClock = true"></text>
			
			<view class="messageCount" v-if="messageCount" @click="getMessageCount">
				{{messageCount}}
			</view>
			
			<!-- 定时器 -->
			<view class="clockTime" v-if="isShowClock">
			            <view class="uni-list-cell">
			                <view class="uni-list-cell-db">
			                    <picker @change="bindClockChange" :value="arrayClockIndex" :range="arrayClock">
									<view class="" v-if="clockTimeStr" >
										{{clockTimeStr}}
									</view>
			                        <view class="uni-input" v-else>
										{{arrayClock[arrayClockIndex]}}
										<!-- <view class="" v-if="arrayClockIndex">
											{{arrayClock[arrayClockIndex]}}
										</view> -->
									</view>
			                    </picker>
			                </view>
			            </view>
			        </view>
		</view>
		
		<view class="playOperation">
			
			<text class="iconfont iconpullleft" @click="previousMusic"></text>
			<text :class="[iconfont, isPlay ? iconzanting: iconbofang]" @click="playMusic"></text>
			<text class="iconfont iconpullright" @click="nextMusic"></text>
		</view>
		
		
		
	</view>
</template>

<script>
	import musicApi from "../../api/music.js";
	import messageApi from "../../api/message.js";
	import * as common from "../../utils/common.js";
	
	//import uniPop from '../../components/uniPop/index.vue'
	//import  PubSub from "pubsub-js";
	
	
	let that;
	let innerAudioContext  ; 
	export default{
		components:{
	
		},
		
		data(){
			return{
				searchSong:{
				
				},
				song:{},
				isPlay : true,
				iconfont: "iconfont",
				iconbofang:"iconbofang",
				iconzanting:"iconzanting",
				currentTime:0,  //当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
				duration:0,   //当前音频的长度（单位：s），只有在当前有合法的 src 时返回
				progressTimeStr:"",    //进度条显示的时间文字.
				percentMusic:0, //音频进度百分比
				percentage: 0,  //进度条百分比
				messageCount: 0  , //该歌曲的总评论数
				show: true,
				user: null,
				isShowClock: false,
				arrayClock:["不开启","10分钟","20分钟","30分钟","40分钟","50分钟","60分钟"],
				arrayClockIndex: 0,
				clockDate: null,
				clockTimeStr: "定时关闭" //定时器显示的时间文字
				 // title: 'audio',
				 //            current: {
				 //                poster: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg',
				 //                name: '致爱丽丝',
				 //                author: '暂无',
				 //                src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
				 //            },
				 //            audioAction: {
				 //                method: 'pause'
				 //            }
				
			}
			
		},
		
		onReady(e){
	
		},
		
		onShow() {
			this.user = uni.getStorageSync("pb-music-user");  // 每次页面刷新时就获取用户信息
			//let isfirstGetCurrentTime = false ; 
			
			var timer = setInterval(()=>{
			   	if (this.clockDate) {
					
					let t_s = this.clockDate.getTime(); //转化为时间戳毫秒数
					let nt = this.clockDate; //定义一个新时间
					nt.setTime(t_s - 1000); //设置新时间比旧时间少一秒
					
					nt = new Date(nt);
					this.clockTimeStr = nt.getMinutes() + ":" + nt.getSeconds();
					if (
					  nt.getHours() != 0 ||
					  (nt.getMinutes() <= 0 && nt.getSeconds() <= 0)
					) {
					  //window.clearInterval(this.clockTimesInterval);
					  this.clockTimeStr = "";
					  this.clockDate = null;
					  this.arrayClockIndex = 0;
			
					  //暂停音乐
					  this.isPlay = true;
					  this.playMusic();
					}
				  };
				 
				 if(innerAudioContext){
					 innerAudioContext.onPlay(function(){
					 
					 	
					 })
					 
					 innerAudioContext.onPause(function(){
					 	//当停止播放时，就保存歌曲的当前进度
					 	// that.song.currentTime =  innerAudioContext.currentTime 
					 	// uni.setStorageSync("play-music",that.song);	
					 	
					 })
					 
					 //背景音频进入可以播放状态，但不保证后面可以流畅播放
					 innerAudioContext.onCanplay(function(e){
					 	
					 
					 })
					 
					 that.duration = innerAudioContext.duration;
					 that.currentTime = innerAudioContext.currentTime;
					 // if(!isfirstGetCurrentTime){
						//  isfirstGetCurrentTime = true;
						//  that.currentTime = innerAudioContext.currentTime;   //只获取一次当前的播放时间；
					 // }
					 
					 that.percentMusic =   that.currentTime/ that.duration * 100 ;
					
					 that.progressTimeStr = this.timeFormat(Math.round(that.currentTime)) + "/" + this.timeFormat(Math.round(that.duration));
						if(that.currentTime >= that.duration && that.currentTime > 3 ){   //当音乐播放完后，应播放下一首歌曲
							this.nextMusic();
						}
				 }
				 // if(that.isPlay){
					//  that.currentTime ++ ;	 
				 // }
				 
			},1000);
		},
		
		onLoad(e){

			that = this;
			this.searchSong.songId = e.songId;
			if(e.isPlay){
				this.isPlay = JSON.parse(e.isPlay);   //把字符串false变成布尔值
			}
		
			if(!innerAudioContext){
				innerAudioContext = uni.createInnerAudioContext();
				//innerAudioContext = uni.getBackgroundAudioManager();
			}else{
				
			}
			//console.log("that.isPlay",that.isPlay)
			that.song = uni.getStorageSync("play-music");
			this.fetchData();
		},
		
		
		
		methods:{
			fetchData(){
				musicApi.getSongsBy(this.searchSong,function(response){
					let resp = response.data;
					let data = resp.data;
					if(resp.code == 200){
						that.song = data[0];
						that.song.isPlay = that.isPlay;
						
						innerAudioContext.src = common.VUE_APP_MUSI_BASEURL + that.song.songName ;
						innerAudioContext.title = that.song.songName ;  
					//	that.isPlay = true;
						that.playMusic();
					}
					
				});
				
				//获取该歌曲的总评论数
				messageApi.getCountBySongId(that.searchSong.songId, function(response){
					let resp = response.data;
						that.messageCount = resp;
				});
			},
			
			playMusic(){
				console.log("playMusic--isPlay",this.isPlay);
				if(!this.isPlay){	
					console.log("playMusic--开始播放");
					innerAudioContext.play();
					//添加到收听历史中
					musicApi.addUserHistorySong(that.searchSong.songId,that.user.userId,function(response){
						let resp = response.data;
						if(resp.code == 200){
							
						}
					});
				}else{
					innerAudioContext.pause();
				}
			
				this.isPlay = !this.isPlay;
				console.log("this.isPlay",this.isPlay);
				that.song.isPlay = that.isPlay;
				uni.setStorageSync("play-music",that.song);	
			},
			
			//上一首歌曲
			previousMusic(){
				let songId = that.song.songId ;
				songId --;
				uni.redirectTo({
					url:"../../pages/index/musicDetails?songId="+songId+"&isPlay=false"
				});
			},
			
			//下一首歌曲
			nextMusic(){
				console.log("that.song",that.song)
				let songId = that.song.songId ;
				songId ++;
				uni.redirectTo({
					url:"../../pages/index/musicDetails?songId="+songId+"&isPlay=false"
				});
			},
			
			getMessageCount(){
				console.log("getMessageCount");
				uni.navigateTo({
					url:"./messageDetails?songId="+that.searchSong.songId
				})
			},
			
			clickCancel(){
				that.show = false;
			},
			
			clickConfirm(){
				
			},
			bindClockChange(e){
				this.arrayClockIndex = e.target.value;
				
				if(this.arrayClockIndex == 0){
					this.isShowClock = false;
				}
				this.clockDate = this.setClock(this.arrayClock[this.arrayClockIndex]);  //获取要定时的时间
			},
			
			//根据选择的时间来设置关闭的时间
			setClock(clockTimeStr) {
			  let date = new Date();
			  date.setHours(0);
			  date.setMinutes(0);
			  date.setSeconds(0);
			  switch (clockTimeStr) {
				case "不开启":
				  this.clockTimeStr = "";
				  this.clockDate = null;
				  break;
				case "10分钟":
				//date.setSeconds(10);
				  date.setMinutes(10);
				  break;
				case "20分钟":
				  date.setMinutes(20);
				  break;
				case "30分钟":
				  date.setMinutes(30);
				  break;
				case "40分钟":
				  date.setMinutes(40);
				  break;
				case "50分钟":
				  date.setMinutes(50);
				  break;
				case "60分钟":
				  date.setMinutes(60);
				  break;
			  }
			  return date;
			},
			
			timeFormat(number) {
			  var minute = parseInt(number / 60);
			  var second = parseInt(number % 60);
			  var hour = parseInt(number /3600) ;
			  hour =  hour >= 10 ? hour : "0" + hour;
			  minute = minute >= 10 ? minute : "0" + minute;
			  second = second >= 10 ? second : "0" + second;
			  if(hour>0){
				   return hour + ":" + minute + ":" + second;
			  }else{
				   return minute + ":" + second;
			  }
			 
			},
			
			onChangeProgress(e){
				console.log("onChangeProgress",e);
				that.currentTime = e.detail.value /100 * that.duration;
				innerAudioContext.seek(that.currentTime); //音乐提到指定的位置
			}
		},
		
		watch:{
			
		}
		
	}
</script>

<style>
	.musicDetails{
		text-align: center;
	}
	
	.musicTitle{
		margin-top: 15px;
	}
	
	.musicImg{
		margin-top: 15px;
		width: 184px;
		height: 134px;
	}
	
	.musicProgress{
		width: 243px;
		margin-left: 37px;
		margin-top: 20px;
	}
	
	.progressTimeStr{
		margin-top: 12px;
	}
	
	
	.playOperationTop{
		margin-top: 35px;
		margin-left: 53px;
	}
	
	.playOperationTop .iconfont {
		font-size: 35px;
		margin-right: 55px;
	}
	
	.playOperation{
		margin-top: 35px;
		margin-left: 20px;
	}
	
	.playOperation .iconfont {
		font-size: 45px;
		margin-right: 15px;
	}
	
	/* 鼠标悬浮效果 */
	.playOperation .iconfont:hover {
		color: #007AFF;
	}
	
	
	
	.palyIcon{
		color:#007AFF
	}
	
	.messageCount{
		color: #007AFF;
		margin-left: -126px;
		margin-top: -26px;	
		font-size:25px;
	},
	
	.clockTime{
		position: absolute;
		left: 190px;
		top: 322px;
		color: #007AFF;
		font-size: 23px;
	}
	

</style>
