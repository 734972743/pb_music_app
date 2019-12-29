### Dialog 弹出框

自定义 Dialog 弹出框组件

**使用方式：**

在 script 中引用组件

```javascript
import xyDialog from '@/components/xy-dialog/xy-dialog.vue';
export default {
    components: {xyDialog}
}
```

基础使用方式

```html
<xy-dialog 
    :show="show" 
    title="提示" 
    content="哈哈，还是被你看到了..."
    @cancel="clickCancel('cancel')" 
    @confirm="clickConfirm('confirm')">
</xy-dialog>
```

单个确认按钮+无标题

```html
<xy-dialog
    :show="show" 
    title="" 
    content="哈哈，还是被你看到了..."
	:isShowCancel="!show"
    @confirm="clickConfirm('confirm')">
</xy-dialog>
```

更多案例，请下载到本地进行体验...

**属性说明：**

|属性名	|类型		|默认值	|说明	|
|---	|----		|---	|---	|
|title|String||标题	|
|content|String||内容|
|align|String|left|内容对齐方式，值为：left（左对齐）、center（居中对齐）、right（右对齐）|
|show|Boolean|false|Dialog的显示状态	|
|isShowCancel|Boolean|true	|是否显示取消按钮|
|confirmColor|String|#409EFF|确认按钮的颜色	|
|confirmText|String|确定|确定按钮的文字	|
|cancelColor|String|#909399|取消按钮的颜色	|
|cancelText|String|取消|取消按钮的文字	|

**事件说明：**

|事件名	|说明	|
|---    |----	|
|close|组件关闭时触发事件|
|confirmButton|点击确认按钮时触发事件|
|cancelButton|点击取消按钮时触发事件|

**方法说明：**

|方法名	|说明	|
|---    |----	|
|show()|显示组件-this.$refs.xyDialog.show()|

**slot**

在 ``xy-dialog`` 节点下，可以通过插入节点实现自定义 content 的需求（只有 content 属性为空的时候才会加载 slot）

使用示例：

```html
<xy-dialog 
	title="提示"
	content=""
	:show="show"
	@cancelButton="clickCancel"
	@confirmButton="clickConfirm">
	<view style="padding: 0 30upx 30upx;">
		<view>锄禾日当午</view>
		<view>汗滴禾下土</view>
		<view>举头望明月</view>
		<view>低头思故乡</view>
	</view>
</xy-dialog>
```

**注意**

* 通过本页面下载按钮下载的zip为一个部分 ``components`` 单个组件工程，拖入 HBuilderX粘贴components 目录中即可运行体验效果；
* 使用过程出现问题或有新的需求可在评论区留言。
