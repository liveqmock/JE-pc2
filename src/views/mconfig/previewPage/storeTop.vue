<template>
	<div id="storeTop">
		<div class="header">
			<div class="width-1280 flex p45">
				<div>
					<span>{{cityName}}</span>
					<span class="cursor ml-30 mr-30 f4 a" >
						<i class="iconfont a icon-message color-b"></i>
						<span class="ml3 lh12">消息</span>
					</span>
					<div class="dib top">
						<span class="cursor f4">admin</span>
						<span class="ml-10 cursor f4" >退出</span>
					</div>
				</div>
				<div class="flex">
					<ul>
						<li><span class="lh12">首页</span></li>
						<li><i class="iconfont icon-shopping-car color-b"></i><span class="ml-5 lh12">购物车</span></li>
						<li><i class="iconfont icon-collect color-b"></i><span class="ml-5 lh12">收藏夹</span></li>
						<li><i class="iconfont icon-order color-b"></i><span class="ml-5 lh12">我的订单</span></li>
						<li><span class="ml-10 lh12">我的账户</span></li>
					</ul>
					<div class="ml-30 color-danger">服务电话：<span>{{tel}}</span></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tel: "400-888-9979",
				cityName: "", //站点名称
				siteId:''
			}
		},
		mounted() {
			this.cityName = this.$route.query.name
			this.siteId = this.$route.query.id
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
	#storeTop {
		margin-top: 36px;
		border-bottom: 1px solid #ddd;
		#hi {
			position: absolute;
			top: -50px;
		}
		.header {
			background-color: #f5f5f5;
			height: 36px;
			line-height: 36px;
			color: #666;
			font-size: 12px;
			.ml3{
				margin-left: 3px;
			}
			.f4:hover{
				color: #ff4201;
			}
			.f4.a:hover{
				.iconfont.a{
					color: #ff4201;
				}
			}
			.el-select.s:hover{
				.el-input__icon{
					color: #ff4201;
				}
			}
			.el-badge__content {
				height: 15px;
				line-height: 15px;
				padding: 0 4px;
				position: absolute;
				top: -18px;
				left: -5px;
			}
			.flex {
				display: flex;
				justify-content: space-between;
				li {
					cursor: pointer;
				}
				.lh12 {
					display: inline-block;
					height: 12px;
					line-height: 12px;
				}
				ul li {
					margin-left: 30px;
					float: left;
					cursor: pointer;
					&:hover {
						span,
						.iconfont {
							color: #ff4201;
						}
					}
				}
				.el-input__inner {
					border: 0;
					background: #f5f5f5;
				}
				.el-select.mini .el-input {
					width: 135px;
				}
				.el-select.small .el-input {
					width: 190px;
				}
				.el-select.mid .el-input {
					width: 135px;
				}
				.el-select.large .el-input {
					width: 135px;
				}
			}
		}
	}
</style>