<template>
	<view>
		<view v-show="zShow" class="an-layer" @click="close()">
			
		</view>
		<view ref="popRef" class="an-message" v-show="msgShow" :style="_location">
			<view v-if="an_direction == 'left' || an_direction == 'right'" style="width: 540upx; height: 60upx; background-color: #0081FF; line-height: 60upx; text-align: center; color: #FFFFFF;">
				<text>{{an_title}}</text>
			</view>
			<view class="scoll">
				<slot v-if="line == 0"></slot>
				<text v-if="line == 1">{{an_message}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'an-layer',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			showPop:{
				type: Boolean,
				default: false,  //是否显示遮盖层
			},
			direction: {
				type: String,
				default: 'top' // 弹出方向  top，bottom，left，right 
			},
			autoClose: {
				type: Boolean,
				default: true   //是否自动关闭
			},
			time: {
				type: Number,
				default: 2  //如果为自动关闭，可以设置多少秒后自动关闭，秒数定义
			},
			type: {
				type: String,
				default: 'info'  //提示类型，对应着提示的颜色 info:#2d8cf0 success: #19be6b warn: #ff9900 error: #ed3f14
			},
			title: {
				type: String,
				default: 'Lucas Title'
			}
		},
		data() {
			return {
				zShow: false, // 是否展示,
				translateValue: -100, // 位移距离
				site: 0,
				bgColor: {
					info: '#2d8cf0',
					success: '#19be6b',
					warn: '#ff9900',
					error: '#ed3f14'
				},
				line: 0,
				opacity: 0,
				msgShow: false,
				an_message: '',
				an_showPop: this.showPop,
				an_direction: this.direction,
				an_autoClose: this.autoClose,
				an_time: this.time,
				an_type: this.type,
				an_title: this.title,
			};
		},
		computed: {
			_translate() {
				const transformObj = {
					'top': 'transform:translateY('+this.translateValue+'%)',
					'bottom': 'transform:translateY('+(0-this.translateValue)+'%)',
					'left': 'transform:translateX('+this.translateValue+'%)',
					'right': 'transform:translateX('+(0-this.translateValue)+'%)'
				};
				
				return transformObj[this.an_direction]
			},
			_location() {
				const positionValue = {
					'bottom': 'bottom:0px;width:100%;background-color:'+this.bgColor[this.an_type]+';opacity:'+this.opacity+';',
					'top': 'top:0px;width:100%;background-color:'+this.bgColor[this.an_type]+';opacity:'+this.opacity+';',
					'right': 'right:0px;top:0;height:100%;color:#000;padding: 20upx;opacity:'+this.opacity+';',
					'left': 'left:0px;top:0;height:100%;color:#000;padding: 20upx;opacity:'+this.opacity+';'
				};
				return positionValue[this.an_direction]+ this._translate;
			}
		},
		mounted() {
			this.msgShow = true;
		},
		methods: {
			show(message, option) {
				console.log(this.an_message)
				if(typeof(message) != "undefined"){
					this.line = 1;
					this.an_message = message;
				}
				if(typeof(option) != "undefined"){
					if(typeof(option.showPop) != "undefined"){
						this.an_showPop = option.showPop;
					}
					if(typeof(option.direction) != "undefined"){
						this.an_direction = option.direction;
					}
					if(typeof(option.autoClose) != "undefined"){
						this.an_autoClose = option.autoClose;
					}
					if(typeof(option.time) != "undefined"){
						this.an_time = option.time;
					}
					if(typeof(option.type) != "undefined"){
						this.an_type = option.type;
					}
					if(typeof(option.title) != "undefined"){
						this.an_title = option.title;
					}
				}
				this.opacity = 1;
				this.translateValue = 0;
				if(this.an_showPop){
					this.zShow = true;
				}
				let that = this;
				
				if(this.an_autoClose){
					setTimeout(function(){
						that.opacity = 0;
						that.translateValue = -100;
						if(that.an_showPop){
							that.zShow = false;
						}
					}, that.an_time*1000)
				}
			},
			close() {
				this.opacity = 0;
				this.translateValue = -100;
				this.zShow = false;
			}
		}
	}
</script>

<style lang="scss">
	.an-layer {
		position: fixed;
		z-index: 999999;
		background: rgba(0, 0, 0, .3);
		height: 100%;
		width: 100%;
		top: 0px;
		left: 0px;
		overflow: hidden;
	}

	.an-message {
		position: fixed;
		z-index: 1000000;
		background: #FFFFFF;
		transition: all .4s ease-in-out;
		overflow: hidden;
		font-size: 14px;
		text-align: center;
		color: #FFFFFF;
		height: 60upx;
		line-height: 60upx;
	}
	.scoll{
		overflow-y: auto;
		height: 95%;
	}
</style>
