<template>
	<view class=""> 
		<view class="videoName">
			{{video.videoName}}
		</view>
		
		
		<view class="video" :style="{width: windowWidth}" v-if="isWebView">
			<web-view :webview-styles="webviewStyles" :src="videoUrl"></web-view>
		</view>
		<view class="video"  v-else>
			<video :src="video.videoUrl" controls></video>
		</view>
		<view class="">
		  {{video.videoIntroduce}}
		</view>
	</view>
</template>



<script type="text/javascript" >
	
	import videoApi from "../../api/video.js";
	
	const { windowWidth, windowHeight } = uni.getSystemInfoSync();
	let that;
	
	
	export default{
		data(){
			return{
				videoParam:{
					id:0
				},
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				id:0,
				video: null ,
				isWebView: false,
				windowWidth: windowWidth +"px"
			}
		},
		
		onLoad(e) {
			console.log("e",e);
			that = this;
			this.videoParam.id = e.id;
			this.init();
			this.fetchData();
		},
		
		methods:{
			init(){
				console.log(windowWidth);
			},
			
			fetchData(){
				videoApi.getVideosBy(this.videoParam,(response)=>{
				let resp = response.data;
				console.log("resp",resp);
				if(resp.code == 200){
					that.video = resp.data[0];
					let videoUrl = that.video.videoUrl;
					videoUrl = videoUrl.substring(videoUrl.lastIndexOf(".")) ;

					if(videoUrl == ".html"){
						that.isWebView = true;
					}else{
						that.isWebView = false
					}
					
				}
			});
			}
		}
	}
	
</script>

<style>
	
	.videoName{
		text-align: center;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	
	.video{
		text-align: center;
	}
	
	
</style>
