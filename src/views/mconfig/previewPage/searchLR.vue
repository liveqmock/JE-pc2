<template>
	<div id="shopOther">
		<div class="table bg-f">
			<div class="width-1280 plr-45 tab clearfix">
				<ul class="nav-w">
					<li class="fl cursor bg-danger">
						<span>全部商品</span>
						<i class="el-icon-caret-bottom font-14"></i>
						<div class="leftClassify clearfix fl bg-danger">
							<ul class="nav mt-10 pb-10 cursor">
								<li class="pl-20 clearfix " v-for='(item,index) in classifyList' key='$index' @mouseover="classifyBrandOverOut(index,true)" @mouseout="classifyBrandOverOut(index,false)">
									<i class="iconfont font-16 color-white" :class="item.icon"></i>
									<span class="font-16 ml-10 color-white">{{item.classifyName}}</span>
									<i class="el-icon-arrow-right color-white font-12 color-9 fr mr-10 mt-20"></i>
								</li>
							</ul>
							<!--菜单展开-->
							<div class='navMain pl-50 bg-f' v-show="nava" @mouseover="nava = true" @mouseout.stop="nava = false">
								<p class="font-16 lh-16 mt-20" v-if="classifyName != '其他'">{{classifyName}}</p>
								<ul class="item">
									<li class="fl text-overflow pr-20 mt-20 color-6 font-14 lh-14 w-100 cursor hover-danger" v-for='n in brandList' :title="n.brandName" key='$index'>{{ n.brandName }}</li>
								</ul>
							</div>
						</div>
					</li>
					<li v-for="item in data" class="fl cursor" key="$index">{{item}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { axiosApi,basePath } from "../../../api/api";
	export	default{
		name: 'searchLR',
		data(){
			return{
				data:[],
				classifyList:[],
				nava:false,
				classifyList:[],
				classifyName:'白酒',
				classifyId: null,
				brandId: null,
				brandList:[]
			}
		},
		methods:{
			getClassifyList(){//获取左侧分类信息
	        	this.categoryLoading = true;
	        	let api = "/unlogin/goods/classifyBrandQuery/select"
				axiosApi(api, {},(res) => {
		        	//console.log(res)
		        	this.classifyList = res.data.data.slice(0,8);
	    			// this.categoryLoading = false
	    			
		        },1,10)
	    	},
	        classifyBrandOverOut(index,bool){
	        	this.nava = bool;
	        	if(!bool) return;
				this.classifyId = this.classifyList[index].id;
				this.classifyName = this.classifyList[index].classifyName;
				this.brandList = this.classifyList[index].brandList;
				// console.log(this.classifyId,this.classifyName)
	        }
		},
		mounted(){
			this.$nextTick(()=> {
				this.getClassifyList();
			})
		}
	}
</script>

<style lang="less">
	#shopOther .table{
		border-bottom: 2px solid #FF4201;
		.tab{
			height: 50px;
			line-height: 50px;
			text-align: center;
			.nav-w>li {
				width: 132px;
				color: #000;
			};
			.nav-w>li:nth-child(1) {
				width: 190px;
				color: #fff;
				position: relative;
				.leftClassify{
					position: absolute;
					width: 100%;
					height: 420px;
					left: 0;
					top: 50px;
					border-top: 2px solid #FF4201;
					z-index: 10;
					color: #333;
					text-align: left;
					/*菜单展开*/
					.navMain {
						width: 744px;
						height: 416px;
						position: absolute;
						border: 3px solid #e53a00;
						border-top: 1px solid #e53a00;
						left: 190px;
						top: 0;
						z-index: 999;
						cursor: default;
						.w-100 {
							width: 80px;
						}
					}
				}
				.nav li {
					width: 170px;
					height: 50px;
					line-height: 50px
				}
				.nav li:hover {
					background: #e53a00;
				}
			};
			.nav-w>li:hover{
				background: #FF4201;
				color: #fff;
			}
			
		}
		.bg-danger{
			background-color: #FF4201;
		}
	}
</style>