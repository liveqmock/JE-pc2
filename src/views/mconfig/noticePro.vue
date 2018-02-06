<template>
	<div id="notice">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>公告促销</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button v-if='showButton("ADD",100021)' class="edit-btn mr-30" @click="addNotice()">新增通知</el-button>
				<span class="fr mr-30 font-12 site">
					<template>
						<el-select size="mini" v-model="selSite" placeholder="请选择站点" @change="checkSite">
						    <el-option v-for="item in siteList" key="$index" :label="item.name" :value="item.id">{{item.name}}
						    </el-option>
						</el-select>
					</template>
				</span>
			</div>
			<el-tabs v-model="selNewsTypeIdx" class='clearfix' @tab-click="selNewsTypeChanged()">
				<el-tab-pane v-for="item in newsTypeList" key="$index" :label="item.newsTypeName"></el-tab-pane>
			</el-tabs>
		</div>

		<div class="mr-30 ml-30">
			<div class="mt-30 tab">
				<el-table :data="newsList" border style="width: 100%">
					<el-table-column label="标题">
						<template scope="scope">
							<span>{{scope.row.newsTitle}}</span>
						</template>
					</el-table-column>
					<el-table-column label="发布时间" width="200">
						<template scope="scope">
							<span>{{scope.row.gmtCreate | time}}</span>
						</template>
					</el-table-column>
					<el-table-column label="上次修改时间" width="200">
						<template scope="scope">
							<span>{{scope.row.gmtModified | time}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="196">
						<template scope="scope">
							<el-button type="text" v-if="scope.$index!=0 && showButton('TOP',100021)" @click.native="handleTop(scope)">置顶</el-button>
							<router-link :to="`${basePath}/addNotice/${scope.row.id}`">
								<el-button type="text" v-if='showButton("EDIT",100021)'>编辑</el-button>
							</router-link>
							<el-button type="text" v-if='showButton("DEL",100021)' @click.native="handleDelete(scope)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination class="tar" v-if="totalCount>0" :current-page="currentPage" :page-size='10' :total='totalCount' layout="prev , pager, next, jumper" @current-change='handlePageChange'>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import { axiosApi, getUrlParam, basePath } from '../../api/api';

	export default {
		data() {
			return {
				siteList: [],
				selSite: '',
				newsTypeList: [],
				selNewsTypeIdx: '0',
				newsList: [],
				totalCount: 0,
				currentPage: 1
			}
		},
		methods: {
			deleteNews(newsId) {
				axiosApi("/foundation/news/delete", {
					"ids": [newsId]
				}, (res) => {
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					});

					this.handlePageChange(this.currentPage);
				});
			},

			getNewsTypeId() {
				let selNewsTypeIdxInt = parseInt(this.selNewsTypeIdx);
				if(selNewsTypeIdxInt >= 0 && selNewsTypeIdxInt < this.newsTypeList.length)
					return this.newsTypeList[selNewsTypeIdxInt].id;
				else
					return null;
			},

			//分页
			handlePageChange(val) {
				this.loadNewsList(val, 10);
				this.currentPage = val;
			},
			selNewsTypeChanged() {
				this.handlePageChange(1);
			},
			addNotice() {
				this.$router.push(basePath + '/addNotice?newsTypeId=' + this.getNewsTypeId());
			},
			handleDelete(scope) {
				let newsId = scope.row.id;
				this.$confirm('此操作将删除通知, 是否继续?', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteNews(newsId);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			loadSiteList() {
				axiosApi("/unlogin/foundation/site/selectAll", null, (res) => {
					if(res.data.data.length > 0) {
						this.siteList = res.data.data;
						this.selSite = this.siteList[0].id;
					} else {
						this.siteList = []
					}
				});
			},
			loadNewsTypeList() {
				axiosApi("/foundation/newstype/selectAll", null, (res) => {
					this.newsTypeList = res.data.data;
					let newsTypeIdParam = getUrlParam("newsTypeId");
					if(null != newsTypeIdParam && newsTypeIdParam.length > 0) {
						let newsTypeId = parseInt(newsTypeIdParam);
						for(let i = 0; i < this.newsTypeList.length; ++i) {
							if(this.newsTypeList[i].id == newsTypeId) {
								this.selNewsTypeIdx = i + '';
								break;
							}
						}
					}

					this.loadNewsList(1, 10);
				});
			},
			loadNewsList(pageIndex, pageSize) {
				axiosApi("/foundation/news/selectAll", {
					"newsTypeId": this.getNewsTypeId(),
					districtId: this.selSite
				}, (res) => {
					if(res.data.data.elements) {
						this.newsList = res.data.data.elements;
						this.totalCount = res.data.data.totalCount;
					}
				}, pageIndex, pageSize, null);
			},
			//选择站点
			checkSite() {
				sessionStorage.districtId = this.selSite;
				this.loadNewsTypeList();
			},
			//置顶
			handleTop(scope) {
				//				console.log(scope)
				axiosApi("/foundation/news/setTop", {
					id: scope.row.id,
					newsTypeId: this.getNewsTypeId(),
					districtId: this.selSite
				}, (res) => {
					this.$message({
						type: 'success',
						message: '置顶成功'
					});
				});
				this.loadNewsTypeList();
			}
		},
		activated() {
			this.$nextTick(function() {
				this.loadSiteList();
				//this.loadNewsTypeList();
			});

			if(this.notExistWangMin) {
				this.wangmin = '作者王敏, QQ591593903';
			}
		}

	}
</script>

<style lang="less">
	#notice {
		/*.el-tabs__header {
			padding-left: 0;
		}*/
		.site{
			 margin: 24px 30px 0 20px;
		}
		.tab {
			.cell {
				text-align: center;
			}
			.el-button {
				width: auto;
			}
		}
	}
</style>