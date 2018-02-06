<template>
	<div class="bg-f">
		<!-- <header>
			<div class="width-1280">服务电话：<span>{{tel}}</span></div>
		</header> -->
		<div class="logo width-1280">
			<el-menu :default-active="activeIndex" mode="horizontal">
				<div class="fl">
					<img src="../assets/logo.png" />
				</div>
				<!-- <el-row type="flex" justify="space-between">
					<el-col :span="8">
						
					</el-col>
					<div class="user-info">
						<el-submenu index="2">
							<template slot="title">用户中心</template>
							<el-menu-item index="2-1" @click='goAccount'>账户</el-menu-item>
							<el-menu-item index="2-2">个人消息</el-menu-item>
						</el-submenu>
						<el-menu-item index="-1" class="lineLogo"><span></span></el-menu-item>
						<el-menu-item index="3" @click="logout">退出</el-menu-item>
					</div>
				</el-row> -->
					<div class="user-info fr">
						<el-submenu index="2">
							<template slot="title">用户中心</template>
							<el-menu-item index="2-1" @click='goAccount'>账户</el-menu-item>
							<el-menu-item index="2-2">个人消息</el-menu-item>
						</el-submenu>
						<el-menu-item index="-1" class="lineLogo"><span></span></el-menu-item>
						<el-menu-item index="3" @click="logout">退出</el-menu-item>
					</div>
			</el-menu>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "../api/api";
	export default {
		data() {
			return {
				tel: "400-8888-9979",
				activeIndex: '1',
				login: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				// if(sessionStorage.loginName) {
				// 	this.login = true;
				// }
			})
		},
		methods: {
			logout() {
				this.$confirm('您确定要退出么？', '提示信息', {
					confirmButtonText: '确定',
					type: 'warning'
				}).then(() => {
					axiosApi("/employee/logout", {}, res => {
						sessionStorage.clear();//清除全部缓存
						this.$router.push({path: basePath + "/login?isForce=true"});
					}, 1, 10);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
						duration: 1000
					})
				})
			},
			//进入我的账户
			goAccount(){
				this.$router.push(basePath + '/myAccount')
			}
		}
	}
</script>

<style scoped>
	/*header {
		text-align: right;
		background-color: #333;
		height: 30px;
		line-height: 30px;
		color: #fff;
		font-size: 16px;
	}*/
	
	.logo {
		height: 80px;
		line-height: 80px;
		box-sizing: border-box;
	}
	
	.logo .el-menu {
		height: 80px;
		box-sizing: border-box;
		background-color: #fff;
	}
	
	.logo img {
		width: 227px;
		height: 40px;
		margin-left: 7px;
		/*float: left;*/
		vertical-align: middle;
	}
	
	/*.logo .el-col-8>span {
		display: inline-block;
		width: 1px;
		height: 30px;
		background-color: #333;
		margin: 0px 10px 9px 15px;
	}
	
	.logo .platform {
		display: inline-block;
		width: 100px;
		line-height: 24px;
		font-size: 24px;
		vertical-align: middle;
	}
	
	.logo .platform span {
		font-size: 10px;
		color: #999;
	}*/
	.logo .user-info{
		padding-top: 18px;
	}
	.logo .user-info span {
		display: inline-block;
		width: 2px;
		height: 16px;
		background-color: #333;
		margin: -3px 0;
	}
	
	.logo .lineLogo {
		padding: 0;
		background-color: #fff;
	}
	.el-menu-item.is-active{
		color: #333;
	}
</style>