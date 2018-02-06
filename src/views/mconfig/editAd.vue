<template>
	<div id="editAd">
		<div class="title-top">{{titleText}}</div>
		<div class="mr-30 ml-30 mt-30">
			<el-form :model='ad' label-width='130px'>
				<el-form-item label="广告标题:" required>
					<el-input v-model.trim="ad.advertisementName" auto-complete="off" placeholder="请输入广告标题"></el-input>
				</el-form-item>
				<el-form-item label="链接地址:">
					<el-input v-model.trim="ad.targetUrl" auto-complete="off" placeholder="请设置广告链接地址"></el-input>
				</el-form-item>
				<!--<el-form-item class="tim" label="广告结束时间:">
					<el-date-picker v-model="adEndDateTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" auto-complete="off" placeholder="请设置广告结束时间"></el-date-picker>
				</el-form-item>-->
				<el-form-item label="广告图片:">
					<el-upload class="avatar-uploader" action="/sunrise-gateway/oss/ossUpload" v-loading="loading" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-error="errFun" >
						<img v-if="ad.imgUrl" :src="ad.imgUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button @click="saveAd()" type="primary">确定</el-button>
					<el-button @click="cancel()">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axiosApi, getUrlParam, basePath } from '../../api/api';
	
	export default{
		data(){
			let defaultTime = (new Date()).getTime() + 24*3600000;
			return{
				titleText: "新增广告",
				ad: {
					advertisementName: null,
					imgUrl: null,
					appType: this.$route.query.appType
				},
				adEndDateTime: defaultTime,
        		dialogVisible: false,
				loading: false
			}
		},
		methods:{
			loadAdInfo() {
				if (null != this.adId) {
					axiosApi("/foundation/advertisement/selectInfo", {"id":this.adId}, (res)=>{
						this.ad = res.data.data;
//						this.adEndDateTime = this.ad.gmtAdvertisementEnd;
					});
				} else {
					this.ad = {"advertisementPlanId":this.adPlanId};
				}
			},
			loadAdPlanInfo() {
				axiosApi("/foundation/advertisementplan/selectInfo", {"id":this.adPlanId}, (res)=>{
					if (null != this.adId)
						this.titleText = "编辑 " + res.data.data.planName;
					else
						this.titleText = "新增 " + res.data.data.planName;
				});
			},
			
			handleAdd(){
				//console.log(sessionStorage.districtId)
				this.ad.appType = this.$route.query.appType;
				this.ad.districtId = sessionStorage.districtId;
				console.log(this.appType)
				axiosApi("/foundation/advertisement/insert", this.ad, (res)=>{
					this.$message({
						type: 'info',
						message: '添加成功'
					});
					this.$router.push(basePath+'/adManage');
				});
			},
			handleEdit(){
				this.ad.appType = this.$route.query.appType;
				axiosApi("/foundation/advertisement/update", this.ad, (res)=>{
					this.$message({
						type: 'info',
						message: '编辑成功'
					});
					this.$router.push(basePath+'/adManage');
				});
			},
//			:disabled="!checkSave()"调用下面方法，但必须按照先后顺序来
			checkSave(){
				if (null == this.ad.advertisementName || 0 == this.ad.advertisementName.trim().length)
					return false;
				if (null == this.adEndDateTime || 0 == this.adEndDateTime.length)
					return false;
				if (null == this.ad.imgUrl || 0 == this.ad.imgUrl.length)
					return false;
					
				return true;
//				if(this.ad.advertisementName!=null && this.adEndDateTime!=null && this.ad.imgUrl!=null) return true;
			},
			saveAd(){
				if (null == this.ad.advertisementName || 0 == this.ad.advertisementName.trim().length) {
					this.$message.error('请输入标题');
					return;
				}
				if (15 < this.ad.advertisementName.trim().length) {
					this.$message.error('标题在15字以内');
					return;
				}
				
//				if (null == this.adEndDateTime || 0 == this.adEndDateTime) {
//					this.$message.error('请选择广告结束时间');
//					return;
//				}
//				if (this.adEndDateTime <= new Date().getTime()) {
//					this.$message.error('广告结束时间不得小于当前系统时间');
//					return;
//				}
//				this.ad.gmtAdvertisementEnd = this.adEndDateTime;
				
				if (null == this.ad.imgUrl || 0 == this.ad.imgUrl.length) {
					this.$message.error('请上传图片');
					return;
				}
				
				
				if (null != this.adId) {
					this.ad.id = this.adId;
					this.handleEdit();
				} else {
					this.handleAdd();
				}
			},
			
			
			//上传图片
			beforeAvatarUpload(file) {
				this.loading = true;
				const isImage = (file.type.indexOf('jpg') != -1 || file.type.indexOf('jpeg') != -1 || file.type.indexOf('png') != -1 || file.type.indexOf('bmp') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4;
				if(!isImage) {
					this.loading = false;
					this.$message.error('上传图片只能是jpg、jpeg、png、bmp格式');
				}
				if(!isLt4M) {
					this.loading = false;
					this.$message.error('上传图片大小不能超过 4MB');
				}
				return isImage && isLt4M;
			},
			handleAvatarSuccess(res) {
				this.loading = false;
				this.ad.imgUrl = res.data[0];
			},
			handlePictureCardPreview(file) {
				this.logoIcon = file.url;
				this.dialogVisible = true;
			},
			
			cancel(){
				this.$router.push(basePath+'/adManage');
			},
			
			errFun(err) {
//				console.log(err);
			}
		},
		mounted(){
			this.adId = this.$route.params.adId;
			this.adPlanId = parseInt(getUrlParam("adPlanId"));
			
			this.loadAdInfo();
			
			if (null != this.adId)
				this.titleText = "编辑广告";
			else
				this.titleText = "新增广告";
			this.loadAdPlanInfo();
		}
	}
</script>

<style lang="less">
	#editAd{
		.avatar{
			width: 500px;height: 300px;
			line-height: 300px;
		}
		.avatar-uploader-icon{
			border: 1px solid #ddd;
			width: 500px;height: 300px;
			line-height: 300px;
			font-size: 30px;
		}
		.el-loading-spinner{
			left: -18%;
		}
		
		
	}
	.el-input--small {
	    width: 148px !important;
	}
</style>