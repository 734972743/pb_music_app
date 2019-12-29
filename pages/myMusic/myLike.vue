
<!-- 这个页面是“我喜欢”页面 -->
<template>
	<view class="">
		<navigator :url="'../../pages/index/musicDetails?songId='+music.songId" class="musicList" v-for="(music,index) in  musicList" :key="music.songId">
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
	
</template>

<script>
	let that;
	import musicApi from "@/api/music.js";
	
	export default{
		name: 'myLikeSong',
		data(){
			return{
				musicList:[],
				user: null
			}
		},
		
		onLoad(){
			this.user = uni.getStorageSync("pb-music-user");  // 每次页面刷新时就获取用户信息
			that = this;
			console.log("myLike");
			this.fetchData();
		},
		onShow() {
			this.user = uni.getStorageSync("pb-music-user");  // 每次页面刷新时就获取用户信息
		},
		
		methods:{
			fetchData(){
				musicApi.getCollectionSongByUserId(this.user.userId,function(response){
					let resp = response.data;
					console.log("resp",resp);
					if(resp.code == 200){
						that.musicList = resp.data;
					}
				})
			}
		}
	}
</script>

<style>
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
</style>
