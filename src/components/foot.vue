<template>
	<div class="width-1280">
		<p>浙江久加久食品饮料连锁有限公司 旗下网站  网站备案号：浙ICP备07504847号-1</p>
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

<style scoped>
	div{
		height: 150px;
		padding-top: 47px;
		font-size: 12px;
		box-sizing: border-box;
	}
	div p{
		text-align: center;
		margin-bottom: 10px;
		line-height: 12px;
		color: #fff;
	}
</style>