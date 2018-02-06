<template>
	<div id="homeNew">
		<header>
			<top></top>
		</header>
		<main>
			<div class="clearfix width-1200 bg-f">
				<div class="main-right fl">
					<router-view></router-view>
				</div>
			</div>
		</main>
		<!--尾部-->
		<footer>
			<foot></foot>
		</footer>
	</div>
</template>

<script>
	import Top from "../components/top.vue";
	import Foot from "../components/foot.vue";
	export default {
		components: {
			Top,
			Foot
		},
		mounted() {
			this.change()
		},
		methods: {
			change() {
				var height = document.documentElement.clientHeight;
				document.getElementsByClassName("main-right")[0].style.minHeight = height - 190 + "px";

			}
		}
	}
</script>

<style lang="less">
	#homeNew {
		main {
			padding: 30px 40px 50px;
			// background-color: #eee;
		}
		.main-left {
			border-right: 1px solid #ddd;
		}
		.main-left .el-menu.el-menu-vertical-demo {
			padding-bottom: 50px;
		}
		.main-right {
			width: 1200px;
			padding-bottom: 50px;
			margin-left: -1px;
			border-left: 1px solid #ddd;
			box-sizing: border-box;
		}
		footer {
			background-color: #333;
		}
	}
</style>