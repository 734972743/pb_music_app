<template>
	<view class="demo">
		<view class="demo-item">
			<text>完整功能</text>
			<button type="primary" size="mini" @click="handleShow(1)">查看</button>			
			<xy-dialog 
				title="标题"
				content="操作成功,你懂得~"
				:show="showDialog_1"
				@cancelButton="clickCancel(1)"
				@confirmButton="clickConfirm(1)"
			></xy-dialog>
		</view>
		<view class="demo-item">
			<text>内容+按钮</text>
			<button type="primary" size="mini" @click="handleShow(2)">查看</button>
			<xy-dialog 
				title=""
				content="操作成功,你懂得~"
				:show="showDialog_2"
				@cancelButton="clickCancel(2)"
				@confirmButton="clickConfirm(2)"
			></xy-dialog>
		</view>	
		<view class="demo-item">
			<text>标题+内容+单个按钮</text>
			<button type="primary" size="mini" @click="handleShow(3)">查看</button>
			<xy-dialog 
				title="提示"
				content="操作成功,你懂得~"
				:show="showDialog_3"
				:isShowCancel="!showDialog_3"
				@confirmButton="clickConfirm(3)"
			></xy-dialog>
		</view>	
		<view class="demo-item">
			<text>改变按钮文字/颜色</text>
			<button type="primary" size="mini" @click="handleShow(4)">查看</button>
			<xy-dialog 
				title="标题"
				content="操作成功,你懂得~"
				:show="showDialog_4"
				cancelText="删除"
				cancelColor="#F56C6C"
				confirmText="保存"
				confirmColor="#67C23A"
				@cancelButton="clickCancel(4)"
				@confirmButton="clickConfirm(4)"
			></xy-dialog>
		</view>
		<view class="demo-item">
			<text>内容+单个按钮</text>
			<button type="primary" size="mini" @click="handleShow(5)">查看</button>
			<xy-dialog 
				title=""
				content="操作成功,你懂得~"
				:show="showDialog_5"
				:isShowCancel="!showDialog_5"
				@confirmButton="clickConfirm(5)"
			></xy-dialog>
		</view>	
		<view class="demo-item">
			<text>自定义slot插入内容</text>
			<button type="primary" size="mini" @click="handleShow(6)">查看</button>
			<xy-dialog 
				title="提示"
				content=""
				:show="showDialog_6"
				@cancelButton="clickCancel(6)"
				@confirmButton="clickConfirm(6)"
			>
				<view style="padding: 0 30upx 30upx;">
					<view>锄禾日当午</view>
					<view>汗滴禾下土</view>
					<view>举头望明月</view>
					<view>低头思故乡</view>
				</view>
			</xy-dialog>
		</view>	
		<view class="demo-item">
			<text>方法调用</text>
			<button type="primary" size="mini" @click="handleActionShow">查看</button>
			<xy-dialog 
				title="提示"
				content="操作成功,你懂得~"
				ref="xyDialog"
				@confirmButton="clickConfirm"
			></xy-dialog>
		</view>	
	</view>
</template>

<script>
	import xyDialog from '@/components/xy-dialog/xy-dialog.vue'
	export default {
		components: {
			xyDialog
		},
		data() {
			return {
				showDialog_1: false,
				showDialog_2: false,
				showDialog_3: false,
				showDialog_4: false,
				showDialog_5: false,
				showDialog_6: false
			}
		},
		onLoad() {

		},
		methods: {
			handleShow(type) {
				this[`showDialog_${type}`] = true;
			},
			clickCancel(type) {
				this[`showDialog_${type}`] = false;
			},
			clickConfirm(type) {
				this[`showDialog_${type}`] = false;
			},
			handleActionShow() {
				this.$refs.xyDialog.show()
			}
		}
	}
</script>

<style lang="scss">
	.demo {
		padding: 60upx;
		.demo-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 30upx 0;
			border-bottom: 1px solid #EBEEF5;
			text {
				flex: 1;
				font-size: 32upx;
			}
		}
	}
</style>
