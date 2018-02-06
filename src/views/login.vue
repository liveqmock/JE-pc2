<template>
	<div id="login">
		<header  class="bg-f">
			<div class="logo width-1280">
				<img src="../assets/logo.png" />
			</div>
		</header>
		<div class="clearfix wrap">
			<img class="bg-img" src="../assets/login-bg.png" />
			<div class="w1280">
				<div class="content">
					<div class="title">登录</div>
					<el-form>
						<el-form-item>
							<img src="../assets/user.png" />
							<el-input size="large" type="text" @change="change(1)" v-model.trim="form.loginName" @keyup.enter.native="login" placeholder="请输入账号/手机号" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item>
							<img src="../assets/password.png" />
							<el-input size="large" type="password" @change="change(2)" v-model="form.loginPass" @keyup.enter.native="login" placeholder="请输入密码" auto-complete="off"></el-input>
							<div class="mistake ml-50 mt-10">
								<p v-show="mistake">{{message}}</p>
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="login" :disabled="disabled">登录</el-button>
						</el-form-item>

					</el-form>
				</div>
			</div>
		</div>
		<div class="bg-f pt-30 font-12 footer">
			<div>
				<p class="tac">Copyright © 2017 浙江久加久食品饮料连锁有限公司 浙ICP备07504847号-1</p>
			</div>
		</div>
	</div>
</template>
<script>
	// import Top from "../components/top.vue";
	import { axiosApi, basePath } from "../api/api";
	import md5 from "md5"
	export default {
		// components: {
		// 	Top
		// },
		data() {
			return {
				form: {
					loginName: "",
					loginPass: ""
				},
				disabled: true,
				bool1: false,
				bool2: false,
				mistake: false,
				message: ""
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.change(1);
				this.change(2);
				document.getElementById("login").style.height = document.documentElement.clientHeight + "px";
				window.onresize = () => {
					if(!sessionStorage.getItem("loginName")) {
						document.getElementById("login").style.height = document.documentElement.clientHeight + "px";
					}
				}
			})
		},
		methods: {
			change(type) {
				this.mistake = false;
				let adreg = /^[A-Za-z0-9]{1,11}$/
				if(type == 1) {
					this.bool1 = adreg.test(this.form.loginName)
				}
				if(type == 2) {
					this.bool2 = this.form.loginPass.length > 0
				}
				this.disabled = !(this.bool1 && this.bool2)
			},
			login(form) {
				this.change(1);
				this.change(2);
				if(this.disabled) return false;//键盘事件检查
				const api = "/employee/login";
				const body = {
					"loginName": this.form.loginName,
					"loginPass": md5(this.form.loginPass),
					"appId": "1"
				};
				axiosApi(api, body, res => {
					sessionStorage.loginName1 = this.form.loginName;
					this.$router.push({
						path: basePath + "/welcome"
					})
				}, 1, 10, res => {
					if(res.data.code == "LOGIN_002" || res.data.code == "LOGIN_001" || res.data.code == "FOUNDATION0046") {
						this.mistake = true;
						this.message = res.data.message;
					}
				});
			}
		}
	}
</script>

<style scoped lang="less">
	#login {
		min-width: 1200px;
		position: relative;
		background-color: #fff;
		.logo {
			height: 80px;
			line-height: 80px;
			box-sizing: border-box;
			img {
				width: 227px;
				height: 40px;
				margin-left: 7px;
				/*float: left;*/
				vertical-align: middle;
			}
		}
		.wrap {
			position: relative;
			.bg-img {
				width: 100%;
				z-index: 0;
				display: block;
			}
			.w1280 {
				position: absolute;
				width: 1280px;
				left: 50%;
				margin-left: -640px;
				top: 0;
				.content {
					box-shadow: 0 0 10px rgba(0, 0, 0, .5);
					width: 350px;
					height: 350px;
					background-color: #fff;
					position: absolute;
					right: 150px;
					top: 75px;
					z-index: 100;
					.title {
						width: 100%;
						height: 50px;
						line-height: 50px;
						background-color: #f0f0f0;
						text-align: center;
					}
					.el-form {
						padding-top: 30px;
					}
					img {
						width: 36px;
						height: 36px;
						float: left;
						margin-left: 50px;
					}
					.el-button--primary {
						width: 250px;
						height: 36px;
						margin: 5px 50px 0;
					}
					.mistake {
						color: #d24c4c;
						height: 14px;
						line-height: 14px;
					}
				}
			}
		}
		.footer{
			height: 70px;
		}
	}
</style>