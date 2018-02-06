<template>
	<div id="merchantDetail">
		<div class="title-menu">
			<div class="clearfix">
				<div class="fl" style="padding: 30px 0 19px 15px;">
					<div class="fl font-20 color-3">{{info.storeName}}</div>
				</div>
			</div>
			<el-tabs v-model='activeTab'>
				<el-tab-pane label="基本资料" name="1"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="info" v-loading="listLoading">
			<div class="mb-50"><span class="labelInfo tar">商品信息:</span>
				<div class="dib">
					<div class="fl">
						<img v-if="info.defaultPicture" class="icon-60 mr-5" :src="info.defaultPicture" />
						<img v-else src="../../assets/goods.png" alt="" />
					</div>
					<div class="fl ml-10">
						<div>{{info.spuName}}</div>
						<div class="color-9" v-if="info.msrp">建议零售价：{{info.msrp}}</div>
					</div>
				</div>
			</div>
			<div class="mb-50"><span class="labelInfo tar">申请店铺:</span>{{info.storeName}}<span class="ml-30">{{info.loginName}}</span></div>
			<div class="mb-50 clearfix"><span class="labelInfo tar fl">销售资质:</span>
				<div class="width-640 fl">
					<span class="tp mr-10" v-for="item in info.certRelationVOs">
						<img class="infoImg mb-10" :src="item.certImg" />
						<p class="st" v-if="item.state == 1">待审核</p>
						<p class="st" v-if="item.state == 3">未通过</p>
					</span>
				</div>
			</div>
			<div class="mb-50"><span class="labelInfo tar">商品分类:</span><span class="w200 dib">{{info.classifyName}}</span><span class="labelInfo tar">商品品牌:</span>{{info.brandName}}</div>
			<div class="mb-50"><span class="labelInfo tar">授权方:</span><span class="w200 dib">{{info.authorizeName}}</span></div>
			<div class="mt-50" v-if="info.status == 1"><span class="labelInfo tar"></span>
				<span>
                    <el-button type="primary" @click = "checkPass">审核通过</el-button>
                    <el-button @click = "handleFail">审核驳回</el-button>
                </span>
			</div>
		</div>
		<el-dialog title='填写理由' v-model='failDialogVisible' @close="handleReset('ruleForm')">
			<el-form class='ml-30 mr-30' :model='ruleForm' label-position='top' :rules='rules' ref='ruleForm'>
				<el-form-item label='审核不通过理由:' prop='reason'>
					<el-input type="textarea" :autosize="{ minRows: 4,maxRows:10}" v-model.trim="ruleForm.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleCommit('ruleForm')">确 定</el-button>
				<el-button @click="handleReset('ruleForm')">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	import { MessageBox } from 'element-ui';
	export default {
		data() {
			return {
				listLoading: true,
				activeTab: "1",
				info: {},
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
				ruleForm: {
					reason: ''
				}
			}
		},
		mounted() {
			//			console.log(this.$route.params.id)
			this.loading();
		},
		methods: {
			loading() {
				const api = "/goods/spuAuthorizationInfo/select";
				const body = {
					id: this.$route.params.id
				};
				axiosApi(api, body, res => {
					this.info = res.data.data;
					this.listLoading = false;
				}, 1, 10, res => {
					this.listLoading = false;
					MessageBox.alert(res.data.message, '提示信息', {
						confirmButtonText: '确定'
					});
				});
			},
			checkPass() {
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', null, '是否确认审核通过？'),
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							done();
							this.$router.push(`${basePath}/merchant/supplierSaleArea/supplierDetail/${this.info.id}`)
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
			handleCommit(formName) { // 弹出框 审核不通过 处理函数（确定按钮）
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.spuAuthorizationRefuse(this.ruleForm.reason)
						this.failDialogVisible = false
						localStorage.setItem('activeTab', '2')
						this.$router.push(basePath + '/merchant/supplierApply')
					} else {
						return false
					}
				})
			},
			handleReset(formName) { //再次点击弹出框 清空 内容
				this.failDialogVisible = false
				this.$refs[formName].resetFields();
			},
			spuAuthorizationRefuse(reason) {
				axiosApi("/goods/spuAuthorizationRefuse/refuse", {
					id: this.$route.params.id,
					rejectionReason: reason
				}, (res) => {
					this.$message({
						type: "success",
						message: "操作成功",
						duration: 1000
					})
				})
			}
		}
	}
</script>

<style lang="less">
	#merchantDetail {
		.info {
			margin: 50px 0 0 150px;
			font-size: 14px;
			.w200 {
				width: 200px;
			}
			.labelInfo {
				width: 90px;
				display: inline-block;
				vertical-align: top;
				margin-right: 30px;
			}
			.infoImg {
				width: 240px;
				height: 180px;
			}
			.tp {
				display: inline-block;
				width: 240px;
				position: relative;
				.st {
					position: absolute;
					top: 0;
					right: 0;
					width: 50px;
					height: 30px;
					line-height: 30px; 
					color: #fff;
					background: rgba(0, 0, 0, 0.4);
					text-align: center;
				}
			}
		}
		.el-dialog__body {
			margin-bottom: 50px;
		}
		.el-textarea__inner {
			resize: none;
		}
	}
</style>