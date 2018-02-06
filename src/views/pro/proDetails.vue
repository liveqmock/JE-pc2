<template>
	<div id="proDetails">
		<div class="title-top">
			<el-breadcrumb separator="  ">
				<el-breadcrumb-item :to="path">商品库管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>{{title}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main mt-50 ml-50 pl-50">
			<div class="clearfix">
				<label class="fl ml-30 mr-20">商品图片:</label>
				<el-upload :class="isAd?'dis':''" action="/sunrise-gateway/oss/ossUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleAvatarPhotoScucess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :file-list='form.pictureList'>
				</el-upload>
				<el-dialog v-model="dialogVisible" size="tiny">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
			<div class="clearfix font-14 form">
				<el-form ref="form" :model="form" class="mt-20 fl pr-50 mr-30" :rules="rules">
					<el-form-item label="商品名称:" prop='spuName'>
						<el-input class='big' size="small" placeholder="请输入参数" v-model.trim='form.spuName' :disabled='ddd'></el-input>
					</el-form-item>
					<el-form-item v-if="!isHave" class='fl' label="商品编码:">
						<el-input size="small" placeholder="请输入参数" v-model='form.spuNo' readonly></el-input>
					</el-form-item>
					<el-form-item class='fl' label="条形码:" prop='citm'>
						<el-input size="small" placeholder="请输入参数" v-model.trim='form.citm' :disabled='ddd'></el-input>
					</el-form-item>
					<el-form-item class='fl' label="分类:">
						<el-input size="small" placeholder="请输入参数" v-model='form.classifyName' readonly></el-input>
					</el-form-item>
					<el-form-item class='fl' label="产地:" prop='productAreaId'>
						<el-select size="small" placeholder="请输入关键词" clearable v-model='form.productAreaId' :disabled='ddd' filterable>
							<el-option v-for="item in productAreaList" :label="item.productAreaName" :value="item.id" key='$index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class='fl' label="品牌:" prop='brandId'>
						<el-select size="small" placeholder="请输入关键词" clearable v-model='form.brandId' :disabled='ddd' filterable>
							<el-option v-for="item in brand" :label="item.brandName" :value="item.id" key='$index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class='fl' label="包装:" prop='specInfo'>
						<el-select size="small" placeholder="请选择参数" clearable v-model='form.specInfo'>
							<el-option v-for="item in dict" :label="item.dictValue" :value="item.dictKey" key='$index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class='fl' label="包装规格:" prop='specInfoNum'>
						<el-input size="small" placeholder="请输入参数" v-model.trim='form.specInfoNum'></el-input>
					</el-form-item>
					<el-form-item class='fl' label="建议零售价:" prop="msrp">
						<el-input size="small" placeholder="请输入参数" v-model.trim='form.msrp'></el-input>
					</el-form-item>
					<el-form-item class='fl' label="计量单位:" prop='units'>
						<el-select size="small" placeholder="请选择参数" clearable v-model='form.units'>
							<el-option v-for="item in count" :label="item.dictValue" :value="item.dictKey" key='$index'></el-option>
						</el-select>
					</el-form-item>
					<!--以上是固定参数-->
					<!--以下是动态参数-->
					<el-form-item v-for="(item,index) in form.parameterList" :key="item.key" v-if="item.inputType == 1" class='fl' :label="item.spuParameterName +　':'" :rules="spuProp(item.characterType)" :prop="'parameterList.' + index + '.spuParameterValue'">
						<el-input size="small" placeholder="请输入参数" v-model.trim="item.spuParameterValue"></el-input>
					</el-form-item>
					<el-form-item v-else-if="item.inputType==3" class='fl' :label="item.spuParameterName +　':'">
						<el-select size="small" placeholder="请选择参数" clearable v-model="item.spuParameterOptionId">
							<el-option v-for="v in item.optionList" :label="v.optionName" :value="v.id" key="$index"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div>
					<label class="fl pr-10">图文详情:</label>
					<UEeditor ref="ueeditor" v-model="form.illustrationContent"></UEeditor>
				</div>
			</div>
			<div class="mt-50 ml-100">
				<el-button class="ml-10 mr-50" :loading="saveLoading" @click="proSave('form')" type="primary">保存</el-button>
				<el-button class="ml-10 mr-50" :loading="saveLoading1" @click="proSave('form',true)" type="primary">保存并同步至JDE</el-button>
				<el-button v-if="!isHave" @click="handReset">重置</el-button>
			</div>
		</div>

	</div>
</template>

<script>
	import { MessageBox } from 'element-ui';
	import { axiosApi, basePath } from '../../api/api';
	export default {
		data() {
			return {
				isAd: false,
				isHave: false,
				title: '',
				pictureList: [], //照片Url
				dialogImageUrl: '',
				dialogVisible: false,
				saveLoading: false,
				saveLoading1: false,
				checkedAreas: [],
				data: {},
				ddd: true,
				form: { //固定参数双向绑定
					pictureList: [],
					classificationId: 1,
					classifyId: null,
					classifyName: null,
					classifyId: 1,
					classifyName: '白酒',
					id: null,
					spuName: null,
					spuNo: null,
					classifyName: null,
					citm: null,
					msrp: null,
					productAreaName: null,
					brandName: null,
					productAreaId: null,
					brandId: null,
					specInfo: null,
					specInfoNum: null,
					units: null, //计量单位
					checkedAreas: [], //动态绑定
					specInfoNum: null,
					parameterList: [],
					illustrationContent: ""
				},
				rules: {
					citm: [
						{ pattern: /^[0-9]\d{12}$/, message: '请正确填写13位条形码', trigger: 'blur' }
					],
					msrp: [
						{ required: true, message: '建议零售价为必填项' },
						{ pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '仅支持小数点前10位，小数点后2位数字', trigger: 'blur' }
					],
					specInfoNum: [
						{ pattern: /^[1-9]\d{0,5}$/, message: '最大支持6位数字,且不能以0开头', trigger: 'blur' }
					],
					productAreaId: [{
						required: true,
						type: "number",
						message: '不能为空',
						trigger: 'blur'
					}],
					brandId: [{
						required: true,
						type: "number",
						message: '不能为空',
						trigger: 'blur'
					}],
					specInfo: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
					units: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
					spuName: [{
							required: true,
							message: '不能为空',
							trigger: 'blur'
						},
						{
							max: 30,
							message: '长度不能超过30',
							trigger: 'blur'
						}
					],
					case1: [{
						pattern: /^.{0,16}$/,
						message: '请输入最多16个字符'
					}],
					case2: [{
						pattern: /^([\u4E00-\u9FA5]){0,16}$/,
						message: '请输入最多16个字符，可为汉字'
					}],
					case4: [{
						pattern: /^\d+(\.\d+)?$/,
						message: '请输入数字值'
					}],
					case5: [{
						pattern: /^([0-9]|[1-9]\d{0,16}\.\d{0,15}|0\.\d{0,14}[1-9]\d?|[\u4E00-\u9FA5]){0,16}$/,
						message: '请输入最多16个字符，可为汉字或数字'
					}],
					case6: [{
						pattern: /^[^0-9a-zA-Z]{0,16}$/,
						message: '不能为数字或英文，并且不能多余16位'
					}],
					case7: [
						{ pattern: /^[^\u4e00-\u9fa5]{0,16}$/, message: '不能为汉字或字母' },
						{ pattern: /^[^a-zA-Z]{0,16}$/, message: '不能为汉字或字母' }
					]

				},
				brand: null,
				productAreaList: null,
				dict: null,
				count: null,
				path: { path: basePath + "/proManagement" },
				jdeGoodsNo: null
			}
		},
		methods: {
			spuProp(type) {
				let isSpuProp;
				switch(type) {
					case 1:
						isSpuProp = this.rules.case1;
						break;
					case 2: //
						isSpuProp = this.rules.case2;
						break;
					case 3: //
						isSpuProp = { max: 16, message: '长度不能超过16位' }
						break;
					case 4: //
						isSpuProp = this.rules.case4;
						break;
					case 5: //
						isSpuProp = this.rules.case5;
						break;
					case 6: //
						isSpuProp = this.rules.case6;
						break;
					default:
						isSpuProp = this.rules.case7;
						break;
				}
				return isSpuProp;
			},
			//			获取品牌,地区名
			getTwo() {
				let _this = this
				this.brand.forEach(function(item, index) {
					if(_this.form.brandId == item.id) {
						_this.form.brandName = _this.brand[index].brandName
					}
				})
				this.productAreaList.forEach(function(item1, index1) {
					if(_this.form.productAreaId == item1.id) {
						_this.form.productAreaName = _this.productAreaList[index1].productAreaName
					}
				})
			},
			addProduct() {
				if(this.$route.params.id) {
					this.ddd = false
					this.isHave = true
					this.title = '新增商品'
					axiosApi("/goods/spuInfoInit/select", { classifyId: this.$route.params.id }, (res) => {
						this.form = res.data.data;
						this.form.classifyId = this.$route.params.id;
						this.form.classifyName = this.$route.params.classifyName;
						this.form.classificationId = 1;
						/*动态参数*/
						this.form.parameterList = res.data.data.parameterList?res.data.data.parameterList:[];
						if (this.form.pictureList === null) {//如果res.data.data返回的pictureList位null,就会报错
							this.form.pictureList = [] 
						}
						
					});
				} else {
					this.title = '编辑商品'
					this.achieve();
					this.rules.citm = [];
					if(this.$route.query.iscopy) {
						this.ddd = false;
						this.isHave = true;
						this.title = '新增商品';
					}
				}
			},
			achieve() {
				axiosApi("/goods/spuInfo/select", { spuNo: this.$route.query.id }, (res) => {
					//商品详情转化
					this.form = res.data.data;
					/*动态参数*/
					this.form.parameterList = res.data.data.parameterList ? res.data.data.parameterList : [];
					if(!this.$route.query.iscopy){/*编辑*/
						/*图文详情*/
						this.form.illustrationContent = res.data.data.illustrationContent + '';
						if(this.form.pictureList) {
							for(let i = 0; i < this.form.pictureList.length; i++) { //遍历显示图片
								this.form.pictureList[i].url = this.form.pictureList[i].fileUrl
							}
							if(this.form.pictureList.length > 5) {
								this.isAd = true
							} else {
								this.isAd = false
							}
						}else {
							this.form.pictureList = []
						}
					}else{/*复制并新增*/
						this.form.illustrationContent = "";
						this.form.defaultPicture = null;
						this.form.pictureList = [];
						this.jdeGoodsNo = this.form.jdeGoodsNo;
						delete this.form.spuNo;
						delete this.form.jdeGoodsNo;
						delete this.form.id;
					}
				})
			},
			handReset() {
				this.$confirm('确定要重置?', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.$message({
					// 	type: 'success',
					// 	message: '重置成功！'
					// });
					this.achieve();
				}).catch(() => {});
			},
			//查询品牌/产地/包装规格
			search() {
				axiosApi("/goods/classifyBrandListQuery/select", {classifyId:this.$route.params.id}, (res) => {
					this.brand = res.data.data.elements; //品牌
				},1,10000);
				axiosApi("/goods/productAreaList/select", {}, (res) => {
					this.productAreaList = res.data.data.elements; //产地
				});
				axiosApi("/foundation/dict/getListByType", { dictType: 'goodsPackage' }, (res) => {
					this.dict = res.data.data; //包装
				});
				axiosApi("/foundation/dict/getListByType", { dictType: 'goodsUnits' }, (res) => {
					this.count = res.data.data; //计算单位
				});
			},
			handleRemove(file, fileList) { //图片删除处理函数
				let _this = this
				this.form.pictureList = []
				this.form.pictureList = fileList;
				if(this.form.pictureList.length > 5) {
					this.isAd = true
				} else {
					this.isAd = false
				}
			},

			handleAvatarPhotoScucess(res, file) { //上传图片（增加）
				this.form.pictureList.push({ fileUrl: res.data[0], url: res.data[0] })
				this.loading = false
				if(this.form.pictureList.length > 5) {
					this.isAd = true
				} else {
					this.isAd = false
				}
			},

			beforeAvatarUpload(file) { //上传之前图片的判断
				this.loading = true;
				const isImage = (file.type.indexOf('jpg') != -1 || file.type.indexOf('jpeg') != -1 || file.type.indexOf('png') != -1 || file.type.indexOf('bmp') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4 && file.size / 1024 / 1024 > 0;
				if(!isImage) {
					this.loading = false;
					this.$message.error('上传图片只能是jpg、jpeg、png、bmp格式');
				}
				if(!isLt4M) {
					this.loading = false;
					this.$message.error('上传图片大小不能大于 4MB或小于 0MB!');
				}
				return isImage && isLt4M;
			},
			handlePictureCardPreview(file, fileList) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			proSave(form, isJde) {
				this.getTwo();
				this.form.illustrationContent = this.$refs.ueeditor.getContent();
				this.$refs[form].validate((valid) => {
					if(valid) {
						if(isJde){
							this.saveLoading1 = true;
						}else{
							this.saveLoading = true;
						}
						//console.log(this.form.parameterList)
						this.form.parameterList = this.form.parameterList.map(n=>{
							return {
								"spuParameterName": n.spuParameterName,
								"spuParameterOptionId": n.spuParameterOptionId,
            					"spuParameterValue": n.spuParameterValue,
            					'spuParameterId': n.spuParameterId
							}
						})
						setTimeout(() => {
							axiosApi("/goods/spuInfo/insert", this.form, (res) => {
								this.$message({
									title: '成功',
									message: '恭喜你，保存成功！',
									type: 'success'
								});
								this.saveLoading = false;
								this.saveLoading1 = false;
								if(isJde){
									if(this.jdeGoodsNo){
										this.$router.push(`${basePath}/proJde/${this.form.spuName}/${res.data.data.spuNo}/${this.form.citm}/${this.form.specInfoNum}/${this.jdeGoodsNo}?iscopy=1`)
									}else{
										this.$router.push(`${basePath}/proJde/${this.form.spuName}/${res.data.data.spuNo}/${this.form.citm}/${this.form.specInfoNum}?iscopy=1`)
									}
									
								}else{
									this.$router.push(basePath + '/proManagement')
								}
							}, this.currentPage, 10, (res) => {
								this.$message({
									type: 'info',
									message: res.data.message,
									duration: 1000
								});
								this.saveLoading = false;
								this.saveLoading1 = false;
							})
						}, 0)
					} else {
							this.$confirm('请正确填写信息！', '提示信息', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								showCancelButton: false,
								type: 'warning'
							})
							return false;
						}
				});
			},

		},
		mounted() {
			this.$nextTick(function() {
				this.search();
				this.addProduct();
			})

		}
	}
</script>

<style lang="less">
	#proDetails {
		.form label {
			width: 110px;
			text-align: right;
			display: inline-block;
			margin-right: 5px;
			box-sizing: border-box;
		}
		.form .el-form-item{
			height: 32px;
		}
		.pr-10{
			padding-right: 10px;
		}
		.title .el-input {
			width: 400px;
		}
		.check {
			.el-checkbox {
				display: inline-block;
				width: 150px;
			}
			i {
				font-size: 10px;
			}
			.el-input {
				width: 92px;
				.el-input__inner {
					height: 26px !important;
				}
			}
		}
		.el-upload-list__item {
			width: 90px;
			height: 90px;
		}
		.el-upload--picture-card {
			width: 90px;
			height: 90px;
			line-height: 90px;
			background-size: 50px 50px;
		}
		.big {
			.el-form-item__content {
				width: 400px !important;
			}
			.el-input__inner {
				width: 400px !important;
			}
		}
		.el-form-item__content {
			width: 340px;
		}
		.el-form-item__error {
			left: 31%;
		}
		.dis .el-upload--picture-card {
			display: none;
		}
		.dd {
			display: none;
		}
	}
</style>