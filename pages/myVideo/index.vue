<template>
	<view  >
		<!-- 查询条件 -->
		<view class="videoParamForm" >
			<evan-form  ref="videoFormRef" :model="videoParamForm">
						<evan-form-item label="评论:" prop="videoName">
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="videoParamForm.videoName" placeholder="请输入视频名称" />
						</evan-form-item>
					</evan-form>
					<button @click="searchVideoForm" class="evan-form-show__button">查找</button>
		</view>
		
		
		<!-- 分页 -->
		<view class="fenye">
			<button class="allPlayBtn" @click="allPlay"><text class="iconfont  iconbofang" ></text>全部播放</button>
			<text class="span"></text>
			<text class="iconfont  sortIcon" :class="iconxiayi" @click="changSort" ></text>
			<text class="allEpisode" @click="showTotalPage">共{{total}}集</text>
			<text class="iconfont  allEpisodeIcon" :class="iconxia"></text>
		</view>
		<view class="totalPage" v-show="isShowTotalPage">
			<view v-for="i in maxPage" :key="i"  >
				
				
				<!-- #ifdef MP-WEIXIN -->
					<view v-if="i< maxPage-1" class="totalPageItem">
						<button :class="[currentPage-1 === i ? 'isSelect' : '']"  @click="selectPage(i+1)">{{i*pageSize+1}}~{{(i+1)*pageSize}}</button>
					</view>
					
					<view v-else class="totalPageItem">
						<button :class="[currentPage-1 === i ? 'isSelect' : '']"  @click="selectPage(i+1)">{{i*pageSize+1}}~{{total}}</button>
					</view>
				<!-- #endif -->
				
				<!-- #ifdef APP-PLUS -->
					<view v-if="i-1 < maxPage-1" class="totalPageItem">
						<button :class="[currentPage-1 === i-1 ? 'isSelect' : '']"  @click="selectPage(i+1)">{{(i-3)*pageSize+1}}~{{(i+1)*pageSize}}</button>
					</view>
					
					<view v-else class="totalPageItem">
						<button :class="[currentPage-1 === i-1 ? 'isSelect' : '']"  @click="selectPage(i+1)">{{(i-3)*pageSize+1}}~{{total}}</button>
					</view>
				<!-- #endif -->
				
				
				
				<!-- <view v-else-if="i == 30" class="totalPageItem">
					<button :class="[currentPage-1 === i ? 'isSelect' : '']"  @click="selectPage(i+1)">...{{maxPage}}</button>
				</view> -->
				
				
				<!-- <view v-if="i> 30">
					<view v-if="i> maxPage-8 && i<maxPage-1" class="totalPageItem">
						<button :class="[currentPage-1 === i ? 'isSelect' : '']"  @click="selectPage(i+1)">{{i*pageSize+1}}~{{(i+1)*pageSize}}</button>
					</view>
					
					<view v-else-if="i== maxPage-1" class="totalPageItem">
						<button :class="[currentPage-1 === i ? 'isSelect' : '']"  @click="selectPage(i+1)">-{{i*pageSize+1}}~{{total}}</button>
					</view>
				</view> -->
				
			</view>
		</view>
		
		<!-- 视频列表 -->
		
		<navigator :url="'./videoDetails?id='+video.id" class="musicList clear" v-for="(video,index) in  videoList" :key="index">
			<text class="videoIndex">{{((currentPage-1) * pageSize)+index+1}}</text>
			<image class="musicImg" :src="video.videoImageUrl" ></image>
			<view class="musicName">{{video.videoName}}</view>
		</navigator>
	</view>
</template>

<script>
	import videoApi from "../../api/video.js";
	
	let that;
	export default{
		data(){
			return{
				currentPage: 1,
				pageSize: 20,
				total: 0,
				maxPage: 0,   //列表能先是的最大的页数
				
				isShowTotalPage:false,
				firstVideoId:0 , //第一个视频ID
				
				iconxiayi:"icon-xiayi",
				iconxia:"iconxia",
				
				videoParamForm:{
					videoName:""
				},
				videoParamFormRules: {
					videoName: {
						required: true,
						message: '视频名称不能为空'
					},
				},
				videoList:[]
			}
		},
		
		onLoad() {
			that = this;
			this.fetchData();
			
			// 这里必须放在$nextTick中，不然h5会找不到this.$refs.form
			this.$nextTick(() => {
				this.$refs.videoFormRef.setRules(that.videoParamFormRules);
			})
		},
		
		methods:{
			allPlay(){
				uni.navigateTo({
					url: '../../pages/myVideo/videoDetails?id='+that.firstVideoId
				});
			},
			
			//修改查询顺讯
			changSort(){
				if(this.iconxiayi === "icon-xiayi"){
					this.iconxiayi= "icon-shangyi";
					that.videoParamForm.isSort = 0;
				}else{
					this.iconxiayi= "icon-xiayi";
					that.videoParamForm.isSort = 1;
				}
				that.fetchData();
			},
			
			//显示分页信息
			showTotalPage(){;
				this.isShowTotalPage = !this.isShowTotalPage;
				if(this.iconxia==="iconxia"){
					this.iconxia = "iconshang1";
				}else{
					this.iconxia= "iconxia";
				}
			},
			
			
			selectPage(i){
				that.currentPage =  i;
				that.isShowTotalPage = false;
				that.fetchData();
			},
			
			
			
			fetchData(){
				videoApi.queryListPage(that.currentPage, that.pageSize, that.videoParamForm,(response)=>{
					let resp = response.data;
					console.log("resp",resp);
						that.videoList = resp.data;
						that.total = resp.page.totalCount;
						that.firstVideoId = that.videoList[5].id;
						if(that.total % that.pageSize  ==0){
							that.maxPage = that.total / that.pageSize
						}else{
							that.maxPage = Math.floor(that.total / that.pageSize) +1 
						}
						 
				});
				
				
			},
			
			//查询操作
			searchVideoForm(){
				that.fetchData();
				//that.$refs.newMessageFormRef.validate((vali)=>{
				//	console.log("that.$refs.videoFormRef",that.$refs.videoFormRef);
			// 	that.$refs.newMessageFormRef.validate((vali)=>{
			// 	that.$refs.videoFormRef.validate((vali)=>{
			// 		if(vali){
			// 			that.fetchData();
			// 		}
			// 	});
			// }
		},
		onPullDownRefresh() {
			if(this.currentPage > 1){
				this.currentPage --;
				this.fetchData();
			}
			
				
		},
		onReachBottom() {
			if(this.currentPage < this.maxPage){
				this.currentPage ++;
				this.fetchData();	
			}
			
		},
		
		}
	}
	
</script>

<style lang="less">
	.clear:after{
		content:"";
		clear: both;
		display: block;
	}
	
	
	.videoParamForm{
		position: fixed;
		background-color: white;
		z-index: 99;
		width: 100%;
		height: 35px;
		top:0;

		
		.form-input{
			width: 60%;
			height: 30px;
			float: left;
			position: relative;
			left: 10px;
		}
		
		.evan-form-show__button{
			width: 60px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			position: relative;
			right: -28px;
			background-color: #686de0;
			color: white;
			font-size: 16px;
		}
	}
	
	
	.fenye{
		position: fixed;
		top:35px;
		display: flex;
		height: 30px;
		line-height: 30px;
		margin: 0 auto;
		padding: 10px auto;
		width: 100%;
		background-color: rgba(255,255,255,1);
		z-index: 99;
		
		.allPlayBtn{
			height: 30px;
			line-height: 30px;
			text-align: center;
			background-color: #ecf0f1;
			flex: 1.5;
			font-size: 16px;
			
			.iconbofang{
				font-size: 18px;
				margin-left: -8px;
				margin-right: 9px;
			
			}
		}
		
		.span{
			flex: 1;
		}
		
		.sortIcon{
			flex: 1;
		}
		
		.allEpisode{
			flex: 1.5;
			height: 30px;
			line-height: 30px;
			font-size: 18px;
		}
		
		.allEpisodeIcon{
			font-size: 12px;
		}
	}
	
	
	.totalPage{
		position: fixed;
		top:30px;
		padding-top: 8px;
		width: 100%;
		margin-top: 30px;
		display: flex;
		flex-wrap: wrap;
		background-color: white;
		max-height: 383px;
		overflow-y: scroll;

		z-index: 99;
		
		.totalPageItem{
			background-color: #ecf0f1;
			width: 23vw;;
			height: 30px;
			line-height: 30px;
			text-align: center;
			margin-left: 5px;
			margin-top: 5px;
			button{
				font-size: 12px;
				padding: 0;
			}
		}
		
		.isSelect{
			background-color: #eb4d4b;
		}
	}
		
	.totalPage>view{
		display: inline;
	}
	
	
	.musicList:first-of-type{
		margin-top: 79px;
	}
	
	.musicList{
		// display: flex;
		// flex-wrap: nowrap;
		// /*  三个view ,左边左对齐，右边右对齐 */
		// flex-flow: row nowrap;
		// /* justify-content: space-between; */
		// align-content: flex-start;
		// margin-top: 35px;
		
		.videoIndex{
			float: left;
			margin: 20px auto;
			width: 47px;
			text-align: center;
			position: relative;
			left: 0px;
		}
		
		.musicImg{
			width: 100px;
			height: 76px;
			position: relative;
			left: 0px;
			float: left;
		}
		
		.musicName{
			font-size: 14px;
			margin-top: 19px;
			margin-left: 35px;
			text-align: center;
			max-width: 284px;
			text-overflow: ellipsis;
			height: 76px;
			line-height: 76px;
		}
	}
	
	
	
</style>
