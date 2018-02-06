<template>
	<div id="account-cash-apply-audit">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item :to="path">提现申请单</el-breadcrumb-item>
					<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
					<el-breadcrumb-item>提现申请审核</el-breadcrumb-item>
					<!--<el-breadcrumb-item v-if="applyCashDetail.state == 2">提现申请详情</el-breadcrumb-item>-->
				</el-breadcrumb>
			</div>
		</div>
		<div class="content">
			<el-row>
				<el-col :span="3">
					<div>单据号:</div>
				</el-col>
				<el-col :span="16">
					<div>{{applyCashDetail.cashOrderNo}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>申请时间:</div>
				</el-col>
				<el-col :span="16">
					<div>{{applyCashDetail.applyTime||0 | time}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>商户名称:</div>
				</el-col>
				<el-col :span="16">
					<div>{{applyCashDetail.storeName}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>用户名称:</div>
				</el-col>
				<el-col :span="16">
					<div>{{applyCashDetail.accountUserName}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>银行卡号:</div>
				</el-col>
				<el-col :span="16">
					<div>{{applyCashDetail.accountNo}} {{applyCashDetail.bankName}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>提现金额:</div>
				</el-col>
				<el-col :span="16">
					<div>¥{{applyCashDetail.applyMoney||0 | fmoney}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>手续费:</div>
				</el-col>
				<el-col :span="16">
					<div>¥{{applyCashDetail.commision||0 | fmoney}}</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">
					<div>最终到账:</div>
				</el-col>
				<el-col :span="16">
					<div>¥{{applyCashDetail.dealMoney||0 | fmoney}}</div>
				</el-col>
			</el-row>
			<el-row type="flex" align="middle" v-if="applyCashDetail.state == 2">
				<el-col :span="3">
					<div>不通过理由:</div>
				</el-col>
				<el-col :span="16">
					<div>{{applyCashDetail.remark}}</div>
				</el-col>
			</el-row>
			<el-row v-if="applyCashDetail.state == 1">
				<el-col :span="3">
					<div style="height: 32px;"></div>
				</el-col>
				<el-col :span="16">
					<div>
						<el-button type="primary" class="mr-10" @click="agreeAudit">同 意</el-button>
						<el-button type="default" @click="disagreeAudit">不同意</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<el-dialog class="rDialog" title="不同意理由" :visible.sync="dialogVisible" @close="reset">
			<el-form :model="form" ref="form" :rules="rules"> 
				<el-form-item label="" prop="reason">
					<el-input type="textarea" :rows="2" :maxlength="20" placeholder="请输入不同意的理由..." v-model.trim="form.reason">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="confirm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { basePath, axiosApi } from "../../api/api";
	export default {
		data() {
			return {
				path: {
					path: basePath + '/cashRequisition'
				},
				remark: null, //审核意见
				applyCashDetail: {}, //提现信息
				type: null, //审核类型
				dialogVisible: false,
				form:{
					reason:null, //理由	
				},
				rules:{
					reason:[{required:true, message:'请输入不同意理由'}]
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.applyCashDetail = JSON.parse(sessionStorage.applyCashDetail)
			})
		},
		methods: {
			//同意
			agreeAudit() {
				this.$confirm('确定审核通过吗？',"提示信息",{
					confirmButtonText: '确定',
          			cancelButtonText: '取消',
				}).then(()=>{
					this.applyCashAudit({
						'cashOrderNo': this.applyCashDetail.cashOrderNo,
						remark: this.remark,
						'auditState': 1
					})
				}).catch(()=>{
					 this.$message({
			            type: 'info',
			            message: '已取消操作'
			          })    
				})
				
			},
			//不同意
			disagreeAudit() {
				this.dialogVisible = true
			},
			confirm(){ //dialog确定
				this.$refs.form.validate((valid)=>{
					if (valid) {
						this.applyCashAudit({
							'cashOrderNo': this.applyCashDetail.cashOrderNo,
							remark: this.form.reason,
							'auditState': 2
						})
					}else{
						return false
					}
				})
			},
			cancel(){ //取消
				this.$refs.form.resetFields()
				this.dialogVisible = false
			},
			reset(){ //清空表单
				this.$refs.form.resetFields()
			},
			//1.17提现单审核
			applyCashAudit(body) {
				axiosApi('/anon/cbs/pay/applyCashAudit', body, (res) => {
					this.$message({type:'success',message:"操作成功", duration:1000})
					this.$router.push(basePath + '/cashRequisition')
				}, null, null, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
				})
			}
		}
	}
</script>

<style lang="less">
	#account-cash-apply-audit {
		.content {
			padding: 50px 0 0 100px;
			.el-row {
				margin-bottom: 20px;
				.el-col-3 {
					text-align: right;
					margin-right: 30px;
				}
			}
		}
		.rDialog{
			.el-dialog--small{
				min-height: auto;
				.el-dialog__body{
					padding: 20px 30px 80px 30px!important;
				}
				.el-dialog__footer{
					bottom: 40px;
				}
			}
		}
		.el-textarea__inner{
			resize: none;
		}
	}
</style>