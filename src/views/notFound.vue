<template>
	<div id="noData">
		<img class="fl" src="../assets/no-data.png" />
		<div class="fl ml-50">
			<h1 class="color-3">SORRY您访问的页面丢了</h1>
			<p class="color-9 mt-10">您可以通过一下方式继续访问...</p>
			<el-button class="mt-20" type="primary" @click="load">返回首页</el-button>
		</div>
	</div>
</template>

<script>
	import { basePath } from "../api/api";
	export default {
		methods:{
			load(){
				this.$router.replace(basePath+"/welcome");
			}
		}
	}
</script>

<style>
	#noData{
		width: 700px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	#noData div{
		padding-top: 110px;
	}
	#noData h1{
		font-size: 30px;
		line-height: 30px;
	}
	#noData p{
		font-size: 20px;
		line-height: 20px;
	}
	#noData .el-button{
		width: 200px;
		height: 40px;
	}

</style>