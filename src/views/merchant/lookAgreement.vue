<template>
	<!--查看销售资质-->
	<div id="supplier-look-agreement">
		<div class="title-top">
			<div class='clearfix'>
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>选择已有销售许可</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="body mt-50 clearfix">
			<div class="clearfix">
				<p class="fl">品牌：<span class="ml-30">{{obj.brandName}}</span></p>
				<p class="fl ml-50">分类：<span class="ml-30">{{obj.classifyName}}</span></p>
			</div>
			<p class="mt-30">已有凭证：</p>
			<div class="clearfix mt-20">
				<div class="item fl tac mr-10 mb-30" v-if="item.state == 2" v-for="item in certRelationVOs" key="$index">
					<img class="cursor icon-100" @click="preview(item)" :src="item.certImg" />
					<el-checkbox v-model="item.checked"></el-checkbox>
				</div>
				<el-dialog v-model="imgDialogVisible" size="tiny">
						<img width="100%" :src="imgUrl" alt="协议">
					</el-dialog>
			</div>
			<el-button @click="submit" type="primary" class="mt-50">提交</el-button>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "../../api/api"
	import { MessageBox } from 'element-ui';
	export default {
		data() {
			return {
				obj: {},
				dialogVisible: false,
				imgDialogVisible: false,
				certRelationVOs: [],
				contractImages: "", //选择图片的id
				certId: "" ,//销售资质id
				imgUrl:""//放大预览，仅作为展示用
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.obj = JSON.parse(sessionStorage.getItem("obj"));
//				console.log(this.obj)
				this.loading()
			})
		},
		methods: {
			preview(item){//图片放大预览
				this.imgDialogVisible=true;
				this.imgUrl=item.certImg;
			},
			loading() {
				axiosApi("/trader/findTraderCertList/select", {
					traderId: this.obj.sellerId,
					brandId: this.obj.brandId,
					classifyId: this.obj.classifyId
				}, (res) => {
					if(res.data.data) {
						this.certRelationVOs = res.data.data.certRelationVOs;
						this.certRelationVOs.forEach((item) => {
							if(typeof item.checked == "undefined") {
								this.$set(item, "checked", false)
							}
						})
					}
				})
			},
			submit() { //提交
				this.certRelationVOs.forEach((item) => {
					if(item.checked) {
						this.contractImages += item.id+",";
						this.certId = item.certId;
					}
				})
				if(this.contractImages.length > 0) {
//					console.log(this.contractImages.substr(0,this.contractImages.length-1))
					let obj = Object.assign(JSON.parse(sessionStorage.obj), {
						certId: this.certId,
						contractImages: this.contractImages.substr(0,this.contractImages.length-1),
						certId: this.certId
					})
					sessionStorage.setItem("obj", JSON.stringify(obj));
					this.$router.push(`${basePath}/merchant/supplierSaleArea/lookAgreement`)
				} else {
					MessageBox.alert("请勾选相应销售资质图片!", '提示信息', {
						confirmButtonText: '确定'
					});
				}

			}
		}
	}
</script>

<style>
	#supplier-look-agreement .body {
		padding-left: 100px;
	}
	
	#supplier-look-agreement .body .item {
		width: 120px;
		position: relative;
	}
	
	#supplier-look-agreement .body .remark .el-dialog__body {
		padding: 30px;
	}
	
	#supplier-look-agreement .imgOperator {
		background-color: #000000;
		opacity: 0.5;
		width: 50px;
		height: 38px;
		line-height: 38px;
		position: absolute;
		top: 0;
		right: 0;
	}
	
	#supplier-look-agreement .icon-300 {
		width: 300px;
		height: 300px;
	}
</style>