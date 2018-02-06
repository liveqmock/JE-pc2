<template>
	<div id="freight-price">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>运费价格表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix'>
				<el-tab-pane label='全部快递' name='1'></el-tab-pane>
			</el-tabs>
		</div>
		<div class="p30">
			<el-form :inline="true" :model="formInlineData" class="search clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="快递公司:">
						<el-select v-model="formInlineData.shipperId" placeholder="请选择">
							<el-option v-for="i in formInlineData.expressCompanyList" :label="i.companyName" :value="i.id" :key="i.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="始发城市:">
						<el-input placeholder="请输入始发城市" v-model="formInlineData.fromCity"></el-input>
					</el-form-item>
					<el-form-item label="目的城市:">
						<el-input placeholder="请输入目的城市" v-model="formInlineData.toCity"></el-input>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="fl ml-30">查询</el-button>
			</el-form>
			<div class="tar pr-20">
				<a style="color:#20a0ff;" href="http://sunrise-cbs.oss-cn-hangzhou.aliyuncs.com/template/%E7%89%A9%E6%B5%81%E4%BB%B7%E6%A0%BC%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls">
					<el-button type='text'>下载模板</el-button>
				</a>
				<el-upload class="dib" action="/sunrise-gateway/import/foundation/freightPrice/list?startRow=1&startCol=0" :show-file-list="false" :on-success="handUpSuccess" :before-upload="handUpBefore" :on-error="handUpError" accept="application/vnd.ms-excel">
					<el-button type='text'>批量导入</el-button>
				</el-upload>
				<el-button type="text" @click="handleDelete(null,1)">批量删除</el-button>
			</div>
			<el-table class="mt-10" :data="tableData" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column label="快递公司" prop="shipperName">
				</el-table-column>
				<el-table-column label="始发城市" prop='fromCity'>
				</el-table-column>
				<el-table-column label="目的城市" prop='toCity'>
				</el-table-column>
				<el-table-column label="首重（元/kg）" prop='firstWeight'>
				</el-table-column>
				<el-table-column label="续重（元/kg）" prop='addWeight'>
				</el-table-column>
				<el-table-column label="操作" width="150px" align="center">
					<template scope='scope'>
						<div>
							<el-button type='text' @click='handleEdit(scope.row)'>编辑</el-button>
							<el-button type='text' @click='handleDelete(scope.row,0)'>删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if='total>0' class="tar" :current-page.sync="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="freightPricePage">
				<!-- 分页组件 -->
			</el-pagination>
			<freight-edit :close.sync="freightEdit" :info="info" :expressCompanyList="formInlineData.expressCompanyList" v-on:change="handleSearch"></freight-edit>
		</div>
		<!-- 下载导入失败文件信息 -->
		<form ref="downClientErrForm" action='/sunrise-gateway/export/foundation/batchImport/failed' style="display: none">
			<input type="hidden" name="modelName" v-model="e">
			<input type="hidden" name="fileName" v-model="f">
			<input type="hidden" name="key" v-model="g">
		</form>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "~/api/api"
	import { MessageBox } from 'element-ui';

	export default {
		data() {
			return {
				e: 'importCustomer.failedRecord',
				f:  '物流价格导入失败记录及原因.xls',
				g: null,
				activeTab: "1",
				formInlineData: {
					shipperId: null
				},
				total: 0,
				currentPage: 1,
				tableData: [],
				freightEdit: false,
				info: {}, //编辑
				multipleSelection: [], //选中的商品
			}
		},
		created() {
			//查询快递公司
			axiosApi("/foundation/expressCompany/simpleList", {
				type: 1
			}, res => {
				let a = [{companyName:"请选择",id:null}].concat(res.data.data.expressCompanyList)
				this.$set(this.formInlineData, "expressCompanyList", a)
			}).then(res => {
				this.freightPricePage()
			})
		},
		methods: {
			handUpSuccess(res, file, fileList) {
				console.log(this)
				this.$loading().close()
				switch(res.code) {
					case "000000": //系统交易成功
						let h = this.$createElement;
						if(res.data.failedRows == 0) { //失败条数为0
							this.$msgbox({
								title: '提示信息',
								message: h('p', {
									style: 'text-align:center'
								}, [
									h('p', null, '导入已完成！'),
									h('p', null, `共导入信息${res.data.successedRows}条，全部成功！`)
								]),
								showCancelButton: false,
								confirmButtonText: '确定',
								beforeClose: (action, instance, done) => {
									if(action === 'confirm') {
										done()
										this.freightPricePage()
									} else {
										done()
									}
									delete instance.$slots.default;
								}
							})
						} else {
							this.g = res.data.failedRowsKey;
							console.log(this.g)
							this.$msgbox({
								title: '提示信息',
								message: h('p', {
									style: 'text-align:center'
								}, [
									h('p', null, '导入已完成！'),
									h('p', null, `共导入信息${res.data.successedRows}条，失败${res.data.failedRows}条，点击下载查看失败原因！`)
								]),
								showCancelButton: true,
								confirmButtonText: '下载失败文件',
								cancelButtonText: '我不想知道',
								beforeClose: (action, instance, done) => {
									if(action === 'confirm') {
										this.$refs.downClientErrForm.submit();
										done()
									} else {
										done()
									}
									delete instance.$slots.default;
								}
							})
						}
						break;
					case "999999": //系统异常
						this.$alert(res.message, '提示信息', {
							confirmButtonText: '确定'
						});
						break;
					case "AUTH_001": //用户未登陆
						sessionStorage.clear(); //清除全部缓存
						this.$router.push({
							path: basePath + "/shop/shopIndex?isForce=true"
						});
						break;
					case "AUTH_002": //用户无权限
						this.$alert(res.message, '提示信息', {
							confirmButtonText: '确定'
						});
						break;
					case "LOGIN_005": //用户已禁用
						this.$alert(res.message, '提示信息', {
							confirmButtonText: '确定'
						});
						break;
					case "LOGIN_006": //用户session失效
						if(localStorage.getItem('lastUrl')) return
						localStorage.setItem('lastUrl', this.$route.fullPath)
						sessionStorage.clear(); //清除全部缓存
						this.$router.push({
							path: basePath + "/login?isForce=true"
						});
						break;
					default:
						this.$alert(res.message, '提示信息', {
							confirmButtonText: '确定'
						});
						break;
				}

			},
			handUpError(err, file, fileList) {
				this.$loading().close()
				this.$message.error('导入失败！');
			},
			handUpBefore(file) {
				// console.log(file.type,'0')
				// const isExcel = file.type.indexOf('application/vnd.ms-excel') != -1;
				// if(!isExcel){
				// 	console.log(1)
				// 	this.$message.error('只能上传.xls格式!');
				// }else{console.log(2)
				this.$loading({
					fullscreen: true,
					lock: true,
					text: '正在导入运费...'
				})
				// }
				// console.log(3)
				// return isExcel
				return true
			},
			handleSearch() {
				this.currentPage = 1
				this.freightPricePage()
			},
			freightPricePage() {
				axiosApi("/foundation/freightPricePage/list", {
					shipperId: this.formInlineData.shipperId,
					fromCity: this.formInlineData.fromCity,
					toCity: this.formInlineData.toCity
				}, res => {
					this.tableData = res.data.data.elements || []
					this.total = res.data.data.totalCount
				}, this.currentPage, 10)
			},
			handleEdit(payload) {
				this.freightEdit = true
				this.info = payload
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleDelete(item, type) {
				let a, b
				if(type == 0) { //单个删除
					a = "确认删除该信息？"
					b = [item.id.toString()]
				} else if(type == 1) { //批量删除
					b = this.multipleSelection.map(i => i.id.toString())
					if(b.length > 0) {
						a = `确认删除选中的${b.length}条信息`
					} else {
						a = "您未选中任何信息"
					}
				}
				this.$confirm(a, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(b.length == 0) return false
					axiosApi("/foundation/freightPrice/batchDelete", {
						ids: b
					}, res => {
						this.$message({
							type: 'success',
							message: '操作成功!',
							duration: 1000
						});
						this.handleSearch()
					}, 1, 10, (res) => {
						MessageBox.alert(res.data.message, '提示', {
							confirmButtonText: '确定'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				})
			}
		}
	}
</script>

<style lang="less">
	#freight-price {
		.el-button--text {
			width: auto;
		}
	}
</style>