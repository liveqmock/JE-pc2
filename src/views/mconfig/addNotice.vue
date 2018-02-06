<template>
	<div id="addNotice">
		<div class="title-top">{{titleText}}</div>
		<div class="mr-30 ml-30 mt-30">
			<el-form :model='notice' label-width='130px'>
				<el-form-item label="标题:" required>
					<el-input v-model.trim="notice.newsTitle" auto-complete="off" placeholder="请输入通知标题"></el-input>
				</el-form-item>
				<el-form-item label="类型:" required>
					<el-select v-model="notice.newsTypeId" placeholder="请选择类型">
						<el-option v-for="item in newsTypeList" :label="item.newsTypeName" :value="item.id" key="$index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="内容:" required>
					<!--<el-input type="textarea" style="height:100px;" v-model="notice.newsContext" auto-complete="off" placeholder="请输入通知内容"></el-input>-->
					<UEeditor ref="ueeditor" v-model="notice.newsContext"></UEeditor>
				</el-form-item>
				<el-form-item>
					<el-button @click="saveNotice()" type="primary">确定</el-button>
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
			return{
				titleText: "新增通知",
				newsTypeList: [],
				notice:{newsTitle:'',newsTypeId:null,newsContext:'',districtId:''}
			}
		},
		methods:{
			loadNewsTypeList() {
				axiosApi("/foundation/newstype/selectAll", null, (res)=>{
					this.newsTypeList = res.data.data;
				});
			},
			loadNoticeInfo(){
				axiosApi("/foundation/news/selectInfo", {"id":this.noticeId}, (res)=>{
					this.notice = res.data.data;
				});
			},
			
			handleAdd(){
//				console.log(sessionStorage.districtId)
				this.notice.districtId = sessionStorage.districtId;
				axiosApi("/foundation/news/insert", this.notice, (res)=>{
					this.$message({
						type: 'success',
						message: '添加成功'
					});
					this.$router.push(basePath+'/noticePro?newsTypeId=' + this.notice.newsTypeId);
				});
			},
			handleEdit(){
				axiosApi("/foundation/news/update", this.notice, (res)=>{
					this.$message({
						type: 'success',
						message: '编辑成功'
					});
					this.$router.push(basePath+'/noticePro?newsTypeId=' + this.notice.newsTypeId);
				});
			},
			saveNotice(){
				if (null == this.notice.newsTitle || this.notice.newsTitle.length < 3) {
					this.$message({
						type: 'info',
						message: '新闻标题长度至少为3'
					});
					return;
				}
				if (null != this.notice.newsTitle && this.notice.newsTitle.length > 15) {
					this.$message({
						type: 'info',
						message: '新闻标题长度应小于等于15'
					});
					return;
				}
				
				if (null == this.notice.newsTypeId) {
					this.$message({
						type: 'info',
						message: '请选择新闻类型'
					});
					return;
				}
				this.notice.newsContext = this.$refs.ueeditor.getContent();
				setTimeout(() => {
					if (null == this.notice.newsContext || this.notice.newsContext.length <= 0) {
						this.$message({
							type: 'info',
							message: '请输入新闻内容'
						});
						return;
					}
					
//					if (null != this.notice.newsContext && this.notice.newsContext.length > 8000) {
//						this.$message({
//							type: 'info',
//							message: '新闻内容不得大于800个字符'
//						});
//						return;
//					} 
					
					if (null != this.noticeId) {
						this.notice.id = this.noticeId;
						this.handleEdit();
					} else {
						
						this.handleAdd();
					}
				}, 0)
			},
			
			cancel(){
				this.$router.push(basePath+'/noticePro?newsTypeId=' + this.notice.newsTypeId);
			}
		},
		mounted(){
			this.loadNewsTypeList();
			
			this.noticeId = this.$route.params.noticeId;
			if (null != this.noticeId) {
				this.loadNoticeInfo();
			} else {
				this.notice.newsTypeId = parseInt(getUrlParam("newsTypeId"));
			}
			
			if (null != this.noticeId)
				this.titleText = "编辑通知";
			else
				this.titleText = "新增通知";
			
			if (this.notExistWangMin) {
				this.wangmin = '作者王敏, QQ591593903';
			}
		}
	}
</script>

<style lang="less">
	
</style>