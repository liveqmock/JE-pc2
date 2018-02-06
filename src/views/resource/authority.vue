<template>
	<div id="authority">
		<div class="title-top">
			<span>权限管理</span>
			<el-button @click="handAdd" class="edit-btn">添加权限</el-button>
			<el-dialog :title="tit" v-model="addAuthorityTip" @close="handClose">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item label="所属系统:">
						<el-select v-model="form.applicationType">
							<el-option v-for="item in applicationType" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="服务中心:">
						<el-select v-model="form.siteCode">
							<el-option v-for="item in siteCode" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="权限名称:" prop="title">
						<el-input v-model.trim="form.title" auto-complete="off" placeholder="请输入权限名称"></el-input>
					</el-form-item>
					<el-form-item label="权限路径:" prop="permissionPath">
						<el-input v-model.trim="form.permissionPath" auto-complete="off" placeholder="请输入权限路径"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleSave">确 定</el-button>
					<el-button @click="addAuthorityTip = false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="pt-30 pl-30 pr-30">
			<div class="search">
				<!-- <el-form-item label="关键词查询：">
					<el-input v-model="menuName" @keydown.enter.native="getAreaList" placeholder="请输入权限名称"></el-input>
					<el-button @click.native="getAreaList" type="info" class="ml-50">查询</el-button>
				</el-form-item> -->
				<label class="font-12">关键词查询：</label>
				<el-input v-model.trim="menuName" class="mid" @keydown.enter.native="getAreaList" placeholder="请输入权限名称"></el-input>
				<el-button @click.native="getAreaList" type="info" class="ml-50">查询</el-button>
			</div>
			<div class="clearfix bg-f mt-50">
				<el-table :data="menuList" style="width: 100%">
					<el-table-column prop="title" label="权限名称" width="700"></el-table-column>
					<el-table-column prop="address" label="操作" width="236" class-name="flex-around">
						<template scope="scope">
							<el-button @click.native.prevent="handlEdit(scope.$index)" type="text" size="mini">
								编辑
							</el-button>
							<el-button @click.native.prevent="handleRemove(scope.$index)" type="text" size="small">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-if="menuList.length > 0" class="tar" :current-page.sync="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change='handleCurrentChange'>
					<!-- 分页组件 -->
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import { axiosApi, basePath } from '../../api/api';
	export default {
		data() {
			return {
				addAuthorityTip: false,
				applicationType:[{ label:"商源平台系统", value:1 },{ label:"商源客户系统", value:2 },{ label:"商源云销系统", value:3 }],
				siteCode:[{ label:"基础服务中心",value:"foundation" },{ label:"商品服务中心",value:"goods" },{ label:"客户服务中心",value:"trader" },{ label:"订单服务中心",value:"order" },{ label:"营销服务中心",value:"marketing" }],
				form: { id: null, title: '', permissionPath: '', applicationType: 1, siteCode: "foundation" },
				rules: {
					title: [
						{ required: true, message: '请输入2-20位的字符',min: 2, max: 20, trigger: 'change' }
					],
					permissionPath: [{ required: true, pattern: /^\/[\w-/]+$/,message: '只能输入字母、数字、下划线、中划线、斜线'},{ min: 0,max: 100,message: '最大长度只能输100个字符'}
					]
				},
				menuName: '',
				tit:"添加权限",
				total: 0,
				currentPage: 1,
				menuList: [],
				api:''
			}
		},
		methods: {
			//分页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getAreaList();
			},
			//加载列表
			getAreaList() {
				axiosApi('/foundation/auth/selectAll', { 'loginName': sessionStorage.loginName ,title:this.menuName }, (res) => {
					this.menuList = res.data.data.elements;
					this.total = res.data.data.totalCount;
				}, this.currentPage, 10);
			},
			handAdd(){
				this.addAuthorityTip = true;
				this.save = 0;
				this.tit = "添加权限";
			},
			handlEdit(index){
				this.addAuthorityTip = true;
				this.save = 1;
				this.tit = "修改权限";
				this.form.id = this.menuList[index].id;
				this.form.title = this.menuList[index].title;
				this.form.permissionPath = this.menuList[index].permissionPath;
			},
			//保存（编辑、添加）
			handleSave() {
				this.$refs['form'].validate((valid) => {
		        	if (!valid) return false;
					this.addAuthorityTip = false;
					if(this.save == 0) {//添加
						this.api = "/foundation/auth/insert";
					} else{//编辑
						this.api = "/foundation/auth/update";
					}
					axiosApi(this.api, this.form, (res)=>{
						this.$message({
							type: 'success',
							message: '操作成功',
							duration:1000
						});
						this.getAreaList();
					})
				})
			},
			//删除
			handleRemove(index) {
//				console.log(index)
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = "/foundation/auth/deleteBatch";
					const body = { ids: this.menuList[index].id.toString() };
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration:1000
						});
						this.getAreaList();
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
						duration:1000
					});
				});
			},
			handClose(){
				this.form = { id: null, title: '', permissionPath: '', applicationType: 1, siteCode: "foundation" };
			},
			//查询
			handleSearch() {
				if(this.currentPage == 1) {
					this.getAreaList()
				} else {
					this.currentPage = 1
				}
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.getAreaList();
			})
		}
	}
</script>
<style lang='less'>
	#authority {
		.el-form-item__error{
			margin-left: 183px;
		}
		.flex-around {
			text-align: center;
			display: flex;
			justify-content: space-around;
		}
	}
</style>