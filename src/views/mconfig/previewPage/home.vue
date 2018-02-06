<template>
	<div class="bg-f6">
		<header>
			<div id="pre-site-title">
				<div class="pre-site-title-content">
					<span>[{{siteName}}] 站点预览效果图</span>
					<el-button @click="closeWin">关闭预览</el-button>
				</div>
			</div>
			<storeTop></storeTop>
		</header>
		<div id="body" class="bg-f6">
			<shopSearch></shopSearch>
			<searchLR></searchLR>	
			<div class="bg-f6 width-1280 plr-45">
				<homePage></homePage>
			</div>
		</div>
		<!--尾部-->
		<footer>
			<foot></foot>
		</footer>
	</div>
</template>

<script>
	import searchLR from "./searchLR.vue";
	import shopSearch from "./shop.vue";
	import homePage from "./homePage.vue";
	export default {
		components: {
			searchLR,shopSearch,homePage
		},
		data(){
			return {
				siteName: '', //站点名称
				siteId: '' //站点id
			}
		},
		mounted() {
			var height = document.documentElement.clientHeight;
			document.getElementById("body").style.minHeight = height - 120 + "px";
			console.log(this.$route.query)
			this.siteName = this.$route.query.name
			this.siteId = this.$route.query.id
		},
		methods:{
			closeWin(){
				window.close()
			}
		}
	}
</script>

<style lang="less">
	#pre-site-title{
		width: 100%;
		position: fixed;
		top: 0px;
		background-color: #d7d7d7;
		z-index: 10000;
		height: 36px;
		.pre-site-title-content{
			width: 1280px;
			display: flex;
			margin: 0 auto;
			height: 36px;
			box-sizing: border-box;
			padding: 0 40px;
			align-items: center;
			justify-content: space-between;
		}
	}
	#body{
		padding: 0!important;
	}
	
	footer{
		background-color: #333;
		color: #fff;
	}

</style>