<template>
	<div id="cert-history">
		<div class="title-top">
			<div class="clearfix">
				<div class="fl">
					<div class="fl font-20 color-3">历史记录</div>
				</div>
			</div>
		</div>

		<el-form v-if="activeTab=='second'&&CertRecordArr.length>0" class='mt-50 cert' :inline='true' label-width='170px'>
			<div v-for='item in CertRecordArr' key="$index">
				<el-form-item label="商品分类:">
					<el-select palceholder='请选择' v-model='item.classifyId' disabled>
						<el-option v-for='i in classifyList' :label='i.classifyName' :value='i.id' key='$index'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品品牌:">
					<el-select palceholder='请选择' v-model='item.brandId' disabled>
						<el-option v-for="i2 in brandList2" :label='i2.brandName' :value='i2.id' key='$index'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="授权方:">
					<el-input v-model.trim='item.authorizeName' disabled></el-input>
				</el-form-item>
				<div>
					<el-upload class="mt-10 mb-10 ml-170" action="/sunrise-gateway/oss/ossUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :file-list="item.certRelationVOs" :before-upload="beforeAvatarUpload" :on-success="handleCertScucess">
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>

			</div>
			<div class="ml-170">
				<el-button @click='goBack'>返 回</el-button>
			</div>
		</el-form>
		<div  v-else>
			<div class="ml-170 mt-50 font-20 color-9 mb-20">
			暂无历史记录
			</div>
			<div class="ml-170">
				<el-button @click='goBack'>返 回</el-button>
			</div>
		</div>
		
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				activeTab: 'second',
				CertRecordArr: [],
				classifyList: [],
				brandList2: [],
				dialogImageUrl: '',
				dialogVisible: false

			}
		},
		mounted() {
			this.$nextTick(() => {
				this.classifyTopList()
				this.brandList()
				this.findTraderCertRecord()
			})
		},
		methods: {
			goBack() {
				let id = this.$route.params.id
				let certId = this.$route.params.certId
				this.$router.push(`${basePath}/merchant/brandCheck/${id}/${certId}`)
			},
			findTraderCertRecord() { // 编辑销售资质（或查看销售资质记录）
				const api = '/trader/findTraderCertRecord/select'
				axiosApi(api, {
					traderId: this.$route.params.id,
					state: '2'
				}, (res) => {
//					console.log(res, '销售资质--')
					if(res.data.data){
						this.CertRecordArr = res.data.data
						let temp = []
						this.CertRecordArr.forEach((item) => {
							item.certRelationVOs=item.certRelationVOs.filter((i)=>{
								if(i.state == 2){
									i.url = i.certImg
									i.brandId = item.brandId
									i.classifyId = item.classifyId
								}
								return i.state == 2
							})
						})
					}
					
				})
			},
			classifyTopList() { //根据品类，检索关联的一级分类 所有分类
				const api = '/goods/classifyTopList/select'
				let body = {
					classificationId: ''
				}
				axiosApi(api, body, (res) => {
//					console.log(res)
					this.classifyList = res.data.data
				})
			},
			brandList() { //检索所有的品牌接口 传值为空 查询所有
				const api = '/goods/brandList/select'
				axiosApi(api, {}, (res) => {
//					console.log(res, '检索所有的品牌接口')
					this.brandList2 = res.data.data.elements
				})
			},
			handlePictureCardPreview(file) {
				//console.log(file.url)
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			beforeAvatarUpload(file) { //上传之前图片的判断
				//				////console.log(file)
				const isImage = (file.type.indexOf('png') != -1 || file.type.indexOf('jpeg') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4;
				if(!isImage) {
					this.$message.error('请上传格式为png或jpg的图片文件!');
				}else if(!isLt4M) {
					this.$message.error('上传图片大小不能超过 4MB!');
				}
				return isImage && isLt4M;
			},
			handleCertScucess(res, file, fileList) { //Upload图片上传成功处理函数
				this.dialogImageUrl = res.data[0]
//				console.log(res, file.url, fileList)
				let certId = fileList[0].certId
//				console.log(certId)
				let urlArr = []
				urlArr.push(res.data[0])
				let body = {
					certId: certId,
					certImgs: urlArr
				}
				this.homeAddCertImg(body)
			}
		}

	}
</script>

<style>
	#cert-history {}
	
	#cert-history .el-upload-list--picture-card .el-upload-list__item-status-label {
		display: none;
	}
	
	#cert-history .cert .el-icon-delete2 {
		display: none;
	}
	
	.ml-170 {
		margin-left: 170px;
	}
	
	#cert-history .el-upload--picture-card {
		display: none;
	}
</style>