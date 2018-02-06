<template>
	<div id="merchantDetail">
		<div class="title-menu">
			<div class="clearfix">
				<div class="fl" style="padding: 30px 0 19px 15px;">
					<div class="fl font-20 color-3">{{exportData.storeName}}</div>
				</div>
			</div>
			<el-tabs v-model='activeTab'>
				<el-tab-pane label="基本资料" name="first"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="info">
			<div v-if='exportData.reason' class="mb-20 color-danger"><span class="labelInfo2 tar">审核未通过理由:</span><span class="ml-30">{{exportData.reason}}</span></div>
			<div class="mb-20"><span class="labelInfo2 tar">商家编号:</span><span class="ml-30">{{exportData.traderNumber}}</span></div>
			<div class="mb-20"><span class="labelInfo2 tar">用户名:</span><span class="ml-30">{{exportData.loginName}}</span></div>
			<div class="mb-20">
				<span class="labelInfo2 tar">商家名称:</span><span class="ml-30">{{exportData.storeName}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">商户地址:</span>
				<span class="ml-30">
					<span class="mr-20">{{deliveryAddressVO.provinceName}}</span>
				<span class="mr-20">{{deliveryAddressVO.cityName}}</span>
				<span class="mr-20">{{deliveryAddressVO.regionName}}</span>
				</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">详细地址:</span><span class="ml-30">{{deliveryAddressVO.attr}}</span>
			</div>
			<div class="mt-20"><span class="labelInfo2 tar">营业执照编码:</span><span class="ml-30">{{exportData.licenseNum}}</span></div>
			<div class="mt-20 clearfix"><span class="labelInfo2 tar fl">营业执照照片:</span>
				<div class="width-640 ml-30 fl">
					<img class="infoImg" :src="exportData.licenseImg" />
				</div>
			</div>
			<div class="mt-20 clearfix"><span class="labelInfo2 tar fl">门头照片:</span>
				<div class="width-640 ml-30 fl">
					<img v-for='item in photos' class="infoImg mr-20" :src="item.photoUrl" />
				</div>
			</div>
			<div class="mb-20 mt-20">
				<span class="labelInfo2 tar">联系人姓名:</span><span class="ml-30">{{exportData.linkname}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">职位:</span><span class="ml-30">{{exportData.jobOffer}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">手机号:</span><span class="ml-30">{{exportData.tel}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">Email:</span><span class="ml-30">{{exportData.email}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">推荐人号码:</span><span class="ml-30">{{exportData.distManagerMobile}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">商家来源:</span>
				<span class="ml-30">{{exportData.accountSource == 1 ?'注册' : '录入'}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">{{exportData.accountSource == 1 ?'注册' : '录入'}}时间:</span>
				<span class="ml-30">{{exportData.gmtCreate | time}}</span>
			</div>
			<div class="mt-40" v-if="exportData.state=='1'">
				<span class="labelInfo2 tar"></span>
				<span class="ml-30">
                    <el-button type="primary" @click='handlePass'>审核通过</el-button>
                    <el-button class='ml-20' @click='handleFail'>审核驳回</el-button>
                </span>
				<el-dialog title='填写理由' v-model='failDialogVisible' @close="handleReset('ruleForm')">
					<el-form class='ml-30 mr-30' :model='ruleForm' label-position='top' :rules='rules' ref='ruleForm'>
						<el-form-item label='审核不通过理由:' prop='reason'>
							<el-input type="textarea"  :autosize="{ minRows: 4}" v-model.trim="ruleForm.reason"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="handleCommit('ruleForm')">确 定</el-button>
						<el-button @click="handleReset('ruleForm')">取 消</el-button>
					</div>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	import { axiosApi,basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				activeTab: 'first',
				exportData: {}, //  商户的基本信息
				deliveryAddressVO: {}, //营业地址信息
				photos: [], //门头照片信息
				failDialogVisible: false, //审核不通过弹出框
				reason: '', //审核不通过理由
				rules: {
					reason: [{
							required: true,
							message: '请输入理由',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 30,
							message: '长度在 1 到 30 个字符',
							trigger: 'blur'
						}
					],
				},
				ruleForm:{
					reason:''
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.findStoreInfo()
			})
		},
		methods: {
			findStoreInfo() { //进货商的店铺信息（回显） 显示商户的基本信息
				const api = '/trader/findStoreInfo/select'
				if(this.$route.params.id) {
					let body = {
						traderId: this.$route.params.id
					}
					axiosApi(api, body, (res) => {
						this.exportData = res.data.data
						this.deliveryAddressVO = this.exportData.deliveryAddressVO
						this.photos = this.exportData.photos
					})
				}
			},
			//			trader.updateTraderState.select
			updateTraderState(state,reason) { //平台：商家审核
				const api = '/trader/updateTraderState/select'
				let body = {
					id: this.$route.params.id,
					state: state,
					reason:reason
				}
				axiosApi(api, body, (res) => {
//					console.log(res)
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					})
					localStorage.setItem('activeTab', '2')
					this.$router.push(basePath+'/merchant/allMerchantList')
					
				})
			},
			handlePass() { //审核通过处理函数
				let that = this
				let h = this.$createElement;
				this.$msgbox({
						title: '提示信息',
						message: 
						h('p', null, [
							h('p', null, '确定审核通过吗？ '),
						]),
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						beforeClose: (action, instance, done) => {
							if(action === 'confirm') {
								that.updateTraderState('2','')
								setTimeout(()=>{done()},500)
							} else {
								done();
							}
							delete instance.$slots.default;
						}
					})
			},
			handleFail() { //审核不通过处理函数
				this.failDialogVisible = true
			},
			handleCommit(formName){   // 弹出框 审核不通过 处理函数（确定按钮）
				this.$refs[formName].validate((valid)=>{
					if(valid){
						this.failDialogVisible = false
						this.updateTraderState('3',this.ruleForm.reason)
						
					}else{
						return false
					}
				})
			},
			handleReset(formName){    //再次点击弹出框 清空 内容
				this.failDialogVisible = false
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style>
	#merchantDetail {
		/*详情页面id*/
	}
	
	#merchantDetail .info {
		margin: 50px 0 0 150px;
		font-size: 14px;
	}
	
	#merchantDetail .info .labelInfo2 {
		width: 102px;
		display: inline-block;
	}
	#merchantDetail .info .labelInfo2 {
		width: 102px;
		display: inline-block;
	}
	#merchantDetail .infoImg {
		width: 240px;
		height: 180px;
	}
</style>