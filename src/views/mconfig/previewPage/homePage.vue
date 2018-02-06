<template>
	<div id="homepage" v-loading.fullscreen.lock="fullscreenLoading">
		<div class="top clearfix mb-20">
			<!--轮播图-->
			<div class="fl banaer mt-10">
				<el-carousel :indicator-position="advertisementList.length > 1 ? '' : 'none'">
					<el-carousel-item v-for='item in advertisementList' key="$index">
						<img class="cursor" :src="item.imgUrl" :alt="item.advertisementName" />
					</el-carousel-item>
				</el-carousel>
			</div>
			<div class="right fr mt-10">
				<div class="right-top bg-f">
					<!-- <keep-alive> -->
						<div class="clearfix">
							<el-tabs class="fl mt-10" v-model="newsId" @tab-click="news">
								<el-tab-pane label="公告" name="1"></el-tab-pane>
								<el-tab-pane label="促销" name="2"></el-tab-pane>
							</el-tabs>
						</div>
						<div class="ml-10 mt-10">
							<p class="text-hidden cursor mb-10 font-12 color-6" v-for='item in newsList' key="$index">{{item.newsTitle}}</p>
						</div>
					<!-- </keep-alive> -->
				</div>
				<div class="right-bottom mt-10">
					<img class="cursor" v-for='item in specialadvertisementList' key="$index" :src="item.imgUrl" :alt="item.advertisementName" />
				</div>
			</div>
		</div>
		<div class="new bg-f mb-20" v-for="(n,key) in goodsElementsList" key="$index" v-if="n.sub.length>0">
			<div class="listTitle font-30 clearfix bg-f">
				<span class="line fl"></span>
				<h3 class="fl">{{ n.title }}</h3>
				<span class="line fl"></span>
			</div>
			<ul class="clearfix">
				<li class="fl ml-20 mb-20 mr-5 cursor" v-for='(item,index) in n.sub' key='$index'>
					<div class='imgBor'>
						<img v-if="!item.skuVO.fileUrl" src="../../../assets/goods.png" alt="">
						<img v-else :src="item.skuVO.fileUrl" />
					</div>
					<div class="newList pl-10">
						<p class="color-danger font-14 pt-20">查看批发价请登录</p>
						<p class="one pt-10 dp font-14 color-6 text-tow-overflow">{{item.skuVO.skuName}}</p>
					</div>
					<p class="color-9 pt-10 font-14 store-name text-overflow" :title="item.storeName">
						<i class="iconfont icon-store color-blue"></i>
						<span>{{item.storeName}}</span>
					</p>
				</li>

			</ul>
		</div>
		<div class="adv mt-30 mb-50">
			<img v-for='item in bottomAdvertisementList' key="$index" class="cursor" :src="item.imgUrl" :alt="item.advertisementName" />
		</div>
	</div>
</template>

<script>
import axios from 'axios';
    import { axiosApi } from "../../../api/api";
	export default {
		name: 'homePage',
		data() {
			return {
				nava: false,
				classifyList:[],
				classifyName:'白酒',
				brandList:[],
				advertisementList: [],//轮播广告
				specialadvertisementList: [],//专题广告
				bottomAdvertisementList: [],//底部广告
				newsId: '1',
				newsList: [],
				classifyId: null,
				goodsElementsList: [
					{ title: '促销商品',sub: [] },
					{ title: '新品推荐',sub: [] }
				],
				fullscreenLoading: false,
				activeIndex: "",//当前购物车抖动
			}
		},
		computed: {
			shoppingCarNum() {
				return this.$store.state.homeSearch.shoppingCarNum
			}
		},
		watch:{
			fullscreenLoading(val, oldVal){
				// alert(val)
				this.fullscreenLoading = val;
			}
		},
		methods: {
	        advertisement(){//广告
				this.fullscreenLoading = true;
				let api = "/unlogin/foundation/advertisement/selectAll";
				let body = { districtId: this.$route.query.id };
	        	axiosApi(api, body, (res) => {
					this.advertisementList = res.data.data.adver0 ? res.data.data.adver0 : [];//轮播图核心广告
					this.specialadvertisementList = res.data.data.adver1 ? res.data.data.adver1.slice(0,1) : [];//右侧专题广告
					this.bottomAdvertisementList = res.data.data.adver2 ? res.data.data.adver2.slice(0,1) : [];//底部通栏广告
					this.fullscreenLoading = false;
				}, 1, 10)
	        },
	        news(){//公告
	        	// console.log(this.newsId,"11")
	        	this.newsList=[];
	        	let api = "/unlogin/foundation/news/selectAll";
	        	let body = { newsTypeId: this.newsId, districtId: sessionStorage.siteId }
	        	axiosApi(api, body, (res) => {
					this.newsList = res.data.data.elements ? res.data.data.elements.splice(0,5) : [];					
				}, 1, 10)
	        },
			//加载商品列表
			goodsList() {
				this.fullscreenLoading = true;
				let api = "/unlogin/goods/goodsRecommendIndex/select";
	        	let districtId = this.$route.query.id;
	        	if (null == districtId)
	        	    districtId = 12;

	        	let body = { "districtId": districtId }
	        	// console.log(body)
				axiosApi(api, body, (res) => {
					if(res.data.data.promotionVo.length > 0) this.goodsElementsList[0].sub = res.data.data.promotionVo.splice(0,10);
					if(res.data.data.recommentVo.length > 0) this.goodsElementsList[1].sub = res.data.data.recommentVo.splice(0,10);
					this.fullscreenLoading = false;
				}, 1, 10)
			},
		},
		mounted() {
				this.$nextTick(()=> {
					
					this.advertisement();
					this.news();
					this.goodsList();

					if(document.documentElement.scrollTop){
						document.documentElement.scrollTop = 0;
					}else{
						document.body.scrollTop = 0
					}
				})
		}

	}
</script>

<style lang='less'>
	#homepage {
		.guide{
			width: 555px;
			height: 295px;
			margin-right: 156px;
			background-image:url(../../../assets/32x.png);
			background-size:cover;
			background-repeat:no-repeat;
			.text{
				margin: 180px 0 0 70px;
			}
			.ml-100{
				margin-left: 100px;
			}
		}
		.dp {
			display: block;
		}
		/*左侧菜单*/
		.top .left {
			width: 190px;
			height: 420px;
			position: relative;
		}
		/*菜单展开*/
		.navMain {
			width: 750px;
			height: 420px;
			position: absolute;
			left: 190px;
			top: 0;
			z-index: 999;
			.w-100 {
				width: 100px;
			}
		}
		.item li:hover {
			color: #FF4100;
		}
		/*轮播图*/
		.banaer{
			margin-left: 200px;
		}
		.el-carousel__container {
			height: 410px;
			width: 790px;
			img{
				width:100%;
				height: 100%;
			}
		}
		.el-carousel__indicators li .el-carousel__button {
			width: 12px;
			height: 12px;
			border-radius: 6px;
			background: #FFFFFF;
			opacity: 1;
		}
		.el-carousel__indicator.is-active button {
			background: #FF4201 !important;
		}
		/*右侧公告*/
		.top .right {
			.right-top {
				width: 190px;
				height: 194px;
				.el-tabs__nav {
					width: 190px !important;
				}
				.el-tabs__item {
					width: 80px !important;
					text-align: center;
				}
				.el-tabs__header {
					padding-left: 10px;
				}
				.el-tabs__item.is-active {
					color: #FF4201;
				}
				.el-tabs__active-bar {
					background: #FF4201;
					width: 80px !important;
					height: 2px;
				}
				.text-hidden {
					width: 168px;
					text-overflow:ellipsis;
					white-space: nowrap; 
					overflow: hidden;
				}
				.text-hidden:hover {
					color: #FF4201;
				}
			}
			.right-bottom img {
				width: 190px;
				height: 206px;
			}
		}
		/*新品上市*/
		.new {
			.line {
				margin-top: 45px;
				display: inherit-block;
				width: 200px;
				height: 2px;
				background: #ff4201;
				border: 0
			}
			.listTitle {
				vertical-align: middle;
				width: 580px;
				margin: 0 auto;
				line-height: 90px;
				h3{
					width: 180px;
					text-align: center;
					display: inline-block;
				}
			}
			ul li {
				height:330px;
				position: relative;
				background: #F6F6F6;
				.imgBor{
					width: 208px;
					height: 209px;
					border: 1px solid #f6f6f6;
					border-bottom: 0;
				}
				img {
					width: 208px;
					height: 209px;
				}
				.newList {
					width: 210px;
					height: 80px;
					padding:0 10px;
					box-sizing: border-box;
					.one {
						width: 197px;
						height: 32px;
						line-height: 16px;
					}
				}
				.store-name{
					width: 210px;
					background: #F6F6F6;
					padding:0 10px;
					box-sizing: border-box;
					span:hover{
						color: #ff4201;
					}
				}
			}
		}
		/*广告位*/
		.adv {
			img {
				width: 1190px;
				height: 240px;
			}
		}
	}
</style>