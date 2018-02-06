<template>
	<div id="food" class="width-1280">
		<p>浙江商源供应链股份有限公司 浙江久加久食品饮料连锁有限公司 旗下网站  网站备案号：浙ICP备17019008号-1</p>
			<p>公司地址：<span>{{address}}</span></p>
			<p>客服电话：<span>{{tel}}</span></p>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				address:"杭州市江干区凤起东路137号中豪凤起广场A座11楼",
				tel:"400-888-9979"
			}
		}
	}
</script>

<style lang="less">
	#food{
		clear:both;
		height: 150px;
		font-size: 12px;
		box-sizing: border-box;
		padding-top: 47px;
		p{
			text-align: center;
			margin-bottom: 10px;
			line-height: 12px;
		}
	} 
</style>