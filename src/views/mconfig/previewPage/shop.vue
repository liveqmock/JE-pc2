<template>
	<div id="shop">
		<!--商城首页top-->
		<div class="bg-f font-16">
			<div class="width-1280 plr-45">
				<div class="logo">
					<el-row type="flex" justify="space-between">
						<el-col :span="8">
							<img class="cursor" src="../../../assets/logo-r.png" />
						</el-col>
						<el-col class="mt-30">
							<div class="clearfix">
								<el-input class="fl" v-model.trim="goodsName" placeholder="请输入关键词搜索"></el-input>
								<el-button class="fl" >搜 索</el-button>
							</div>
						</el-col>
						<el-col class="mt-30" :span="4">
							<el-button class="font-12 border-radius-no">
								<span><i class="iconfont icon-shopping-car color-danger"></i></span>
								<span class="color-danger ml-10">我的购物车</span>
							</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div>
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'shopSearch',
		data() {
			return {
				goodsName: "",
			}
		},
		computed: {
		},
		methods: {
		},
		mounted() {
			this.$nextTick(()=> {
			})
		}
	}
</script>
<style lang="less">
	#shop {
		.font-19{
			font-size: 19px;
		}
		font-size: 16px;
		.logo {
			height: 108px;
			background: #fff;
			.border-radius-no{
					border-radius: 0;
				}
			.el-col-8{
				width: 199px;
				img {
					width: 199px;
					height: 42px;
					margin-top: 24px;
				};
				// span {
				// 	display: inline-block;
				// 	width: 1px;
				// 	height: 30px;
				// 	background-color: #000;
				// 	margin: 0px 10px;
				// };
				.platform {
					display: inline-block;
					color: #FF4201;
					vertical-align: top;
					font-size: 24px;
				};
			};
			.el-col-24{
				width: 600px;
				.el-input{
					width: 500px;
				};
				.el-input__inner{
					border: 2px solid #FF4201;
					border-right: 0;
					height: 36px !important;
				};
				.el-button{
					width: 80px;
					height: 36px;
					color: #FFF;
					font-size: 16px;
					background: #FF4201;
					border: 2px solid #FF4201;
					border-radius: 0;
				};
			};
			.el-col-4{
				width: 190px;
				.el-button{
					width: 190px;
					height: 36px;
				};
				span{
					vertical-align: middle;
				};
				.sub{
					min-width: 12px;
					height: 16px;
					line-height: 16px;
					padding:0 2px;
					display: inline-block;
					background: #FF4201;
					border-radius: 8px;
					color: #fff;
					margin-left: 8px;
				}
			}
		}
	}
</style>