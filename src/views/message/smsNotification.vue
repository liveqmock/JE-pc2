<template>
	<div class="pb-20 MessageAppoint3">
		<div class="title-top bg-f">
			短信通知
		</div>
		<div class="bg-f mt-5 pb-50 pt-30 pl-20">
			<el-form :model="form" :rules="rules" ref="form" label-width="80px">
				<el-dialog title="选择站点" :visible.sync="siteDialogVisible" @close="handleClose">
					<div class="site-dialog-box">
						<el-checkbox-group v-model="form.checkSiteList">
							<el-checkbox class="m-checkbox" :label="item" :key="item.id" v-for="(item,index) in siteList">{{item.name}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button class="mr-10" type="primary" @click="handleOk">确 定</el-button>
						<el-button @click="handleClose">取 消</el-button>
					</div>
				</el-dialog>
				<el-form-item class="hide" label="业务类型：" prop="MOywlx">
					<el-checkbox-group v-model="form.MOywlx">
						<el-checkbox label="全部平台" name="1"></el-checkbox>
						<el-checkbox label="云商B2B" name="2"></el-checkbox>
						<el-checkbox label="超C" name="3"></el-checkbox>
						<el-checkbox label="超团" name="4"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="客户选择：" prop="MOkhxz">
					<el-radio-group @change="handleKeHu" v-model="form.MOkhxz">
						<el-radio :label="1">全部客户</el-radio>
						<el-radio :label="2">指定客户</el-radio>
						<el-radio :label="3">指定站点</el-radio>
						<el-button v-if="form.MOkhxz === 3" @click="handleSiteEdit" type="text">	
							重新选择
						</el-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.MOkhxz === 2" label="" prop="MOkhText">
					<el-input :style="{width : '420px'}" v-model.trim="form.MOkhText"></el-input>
					<span class="color-9">直接输入客户手机号，多个手机号用小写逗号“ , ”隔开</span>
				</el-form-item>
				<div v-if="checkSiteList2.length && form.MOkhxz === 3" :style="{
					marginLeft : '80px',
					width : '408px',
					border : '1px solid #ccc',
					paddingTop : '10px',
					paddingLeft : '10px',
					marginBottom : '10px',
				}">
					<el-tag v-for="(item,index) in checkSiteList2" :key="item.id" 
					type="gray"
					class="mr-10 mb-10"
					>
						{{item.name}}
					</el-tag>
				</div>
				<div v-if="form.MOkhxz === 3 && checkSiteList2.length === 0" :style="{
					color : '#ff4949',
					paddingLeft : '80px',
					marginTop : '-20px',
				}">请选择站点</div>
				<el-form-item label="短信内容：" prop="MOdxnr">
					<el-input :style="{width : '420px'}" :autosize="{ minRows: 6, maxRows: 12}" type="textarea" v-model.trim="form.MOdxnr"></el-input>
				</el-form-item>
				<el-form-item class="fl" label="">
					<el-radio-group v-model="form.MOtype">
						<el-radio :label="1">立即</el-radio>
						<el-radio :label="2">定时</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item class="mLclear fl" label="" v-if="form.MOtype === 2" prop="MOtime">
					<el-date-picker
						v-model.trim="form.MOtime"
						type="datetime"
						placeholder="选择日期"
						:picker-options="pickerOptions0">
					</el-date-picker>
				</el-form-item>

				<el-form-item :style="{marginTop:'150px',clear:'both'}" label="">
					<el-button :loading="loading" @click="submit" type="primary">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 浮层 -->
		<el-dialog
		title="提示"
		v-model="dialogVisible"
		size="small"
		>
		<div>
			<div class="messageBox">
				<div v-if="errorMessage">
					<span>发送失败：</span>
					<ul>
						<li>{{errorMessage}}</li>
					</ul>
				</div>
				<div v-if="successMessage">
					<span>发送成功：</span>
					<ul>
						<li>{{successMessage}}</li>
					</ul>
				</div>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>
<script>
import { axiosApi, basePath } from "../../api/api";
export default {
	data() {
		let _this = this;

		// 校验客户
		let verifyKh = function(rule, value, callback){
			let val = value;
			if( (_this.form.MOkhxz === 2) && !val ){
				callback('请输入客户手机号');
			}else{
				callback();
			}
		};
		// 校验定时
		let verifyDs = function(rule, value, callback){
			let val = value;
			if( (_this.form.MOtype === 2) && !val ){
				callback('请选择定时时间');
			}else{
				callback();
			}
		};

		return {
			loading : false,
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			form: {
				MOywlx: '',
				MOkhxz: 1,
				MOkhText: '',
				receiveType: 1,
				MOdxnr: '',
				MOtype: 1,
				MOtime: '',
				checkSiteList : [], // 当前选中的 站点列表
			},
			rules: {
				MOywlx: [

				],
				MOkhxz: [
	
				],
				MOkhText: [
					{required: true,validator: verifyKh,trigger : 'blur'}
				],
				receiveType: [
				
				],
				MOdxnr: [
					{required: true,message:'请输入短信内容',trigger : 'blur'}
				],
				MOtype: [
					
				],
				MOtime: [
					{required: true,validator: verifyDs}
				],
			},
			dialogVisible : false,
			errorMessage : '',
			successMessage : '',
			siteDialogVisible : false, //站点 浮层开关
			siteList : [], // 站点列表
			checkSiteList2 : [], // 选中的 tags
		}
	},
	computed: {

	},
	mounted() {
		this.getSiteAjax();
	},
	methods: {
		// 客户选择change
		handleKeHu(val) {
			this.form.MOkhText = '';
			if(val === 3){
				this.siteDialogVisible = true;
			}
			// 清空 指定站点
			this.checkSiteList2 = [];
			this.form.checkSiteList = [];
		},
		// 提交数据
		submit() {
			// 校验 指定站点
			if(this.form.MOkhxz === 3 && this.checkSiteList2.length === 0){
				return;
			}
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.loading = true;
					let sendUrl = '/foundation/sms/diytemplatebatchsend';
					let sendObj = {
						diySendContent : this.form.MOdxnr,
						businessTypeList : [2],
					};
					if(this.form.MOkhxz === 2){
						sendObj.mobile = this.form.MOkhText;
					}
					if(this.form.MOtype === 2){
						sendObj.gmtTrigger = + new Date(this.form.MOtime);
					}
					if(this.form.MOkhxz === 3){
						sendObj.siteIds = this.checkSiteList2.map( v => v.id );
					}
					axiosApi(sendUrl,sendObj,(res) => {
						this.loading = false;
						let data = res.data;
						// 暂时不用 把发送列表结果 展示出来
						/* this.dialogVisible = true;
						this.errorMessage = data.data['invalidMobileList-2'].length > 0 ? 
											data.data['invalidMobileList-2'].join(' , ') : '';
						this.successMessage = data.data['valideMobileList-2'].length > 0 ? 
											data.data['valideMobileList-2'].join(' , ') : ''; */
					
						/* this.$alert('短信已发送', '提示', {
							confirmButtonText: '确定',
							callback: action => {
								// this.$refs.form.resetFields();
								location.reload();
							}
						}); */

						this.$message.success('短信已发送');
						// 重置数据
						this.form.MOkhText = '';
						this.form.MOdxnr = '';
						this.form.MOkhxz = 1;
						this.form.MOtype = 1;
						this.form.MOtime = '';

						// 清空 指定站点
						this.checkSiteList2 = [];
						this.form.checkSiteList = [];
					
					},1,10,(err) => {
						this.$message.warning(err.data.message);
						this.loading = false;
					});
				}
			});
		},
		// 浮层点击 取消
		handleClose() {
			this.siteDialogVisible = false;
			this.form.checkSiteList = this.checkSiteList2;
		},
		// 浮层点击 确定
		handleOk() {
			this.checkSiteList2 = this.form.checkSiteList;
			this.handleClose();
		},
		// 获取 站点
		getSiteAjax() {
			axiosApi("/unlogin/foundation/site/selectAll", null, (res)=>{
				let arr = [];
				this.siteList = res.data.data;
			});
		},
		// 点击编辑站点
		handleSiteEdit() {
			this.siteDialogVisible = true;
		},
	}
}
</script>
<style lang="less">
.MessageAppoint3 {
    position: relative;
    .hide{
        display: none;
    }
	.el-form-item__label {
		font-size: 12px;
	}
	.box {
		margin: 25px 70px;
		.el-transfer-panel__body {
			.el-input--small {
				width: 218px!important
			}
		}
	}
	.el-dialog--small {
		width: 400px!important;
		height: 230px!important;
		min-height: 300px!important;
		overflow-y: auto;
	}
	.el-dialog__body{
		padding: 30px 20px;
		color: #48576a;
		font-size: 14px;
	}
	.el-transfer-panel {
		width: 220px;
	}
	.el-transfer-panel__body {
		height: 340px;
	}
	.el-transfer-panel__list.is-filterable {
		height: 330px;
	}
	.mLclear{
		.el-form-item__content{
			margin-left: 20px!important;
		}
		.el-form-item__error{
			left: -137px;
		}
	}
	.el-dialog__footer .el-button--default{
		margin-left: 0;
	}
	.messageBox{
		max-height: 160px;
    	overflow-y: auto;
		>div{
			padding: 10px 0;
		}
		ul{
			overflow: hidden;
			li{
				float: left;
			}
		}
	}
	.site-dialog-box{
		height: 153px;
		overflow-y: auto;
		.m-checkbox{
			margin-left: 10px;
			margin-bottom: 10px;
		}
	}
}
</style>