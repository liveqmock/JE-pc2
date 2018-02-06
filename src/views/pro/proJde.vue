<template>
	<div id="proJde">
		<div class="title-top">
			<el-breadcrumb separator="  ">
				<el-breadcrumb-item :to="path">商品库管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>{{title}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main mt-50 ml-20 ">
			<el-form :model="form" class='mb-50 clearfix' :rules="rules" ref="form" v-loading="loading">
				<el-form-item class='fl' label="商品编码:" prop='litm'>
					<el-input class='fl' :disabled="show" v-model.number='form.litm'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="商品名称:" prop='dsc1'>
					<el-input class='fl' v-model.trim='form.dsc1'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="包装规格:" prop='srtx'>
					<el-input class='fl' placeholder="请输入参数" v-model.trim='form.srtx'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="商品系列:" prop='srp1'>
					<el-select clearable v-model='form.srp1' filterable>
						<el-option v-for='(item,index) in data.srp1s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="酒类型：" prop='srp2'>
					<el-select clearable v-model='form.srp2' filterable>
						<el-option v-for='(item,index) in data.srp2s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="商品大类：" prop='srp3'>
					<el-select placeholder="请选择参数" clearable v-model='form.srp3' filterable>
						<el-option v-for='(item,index) in data.srp3s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="商品子类：" prop='srp4'>
					<el-select placeholder="请选择参数" clearable v-model='form.srp4' filterable>
						<el-option v-for='(item,index) in data.srp4s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="商品等级：">
					<el-select placeholder="请选择参数" clearable v-model='form.srp5' filterable>
						<el-option v-for='(item,index) in data.srp5s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="酒精度：">
					<el-select placeholder="请选择参数" clearable v-model='form.srp6' filterable>
						<el-option v-for='(item,index) in data.srp6s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="产地：" prop='srp7'>
					<el-select placeholder="请选择参数" clearable v-model='form.srp7' filterable>
						<el-option v-for='(item,index) in data.srp7s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="包装含量：">
					<el-select placeholder="请选择参数" clearable v-model='form.srp8' filterable>
						<el-option v-for='(item,index) in data.srp8s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="会员折扣价：" prop='srp9'>
					<el-select placeholder="请选择参数" clearable v-model='form.srp9' filterable>
						<el-option v-for='(item,index) in data.srp9s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="包装形态：">
					<el-select placeholder="请选择参数" clearable v-model='form.srp0' filterable>
						<el-option v-for='(item,index) in data.srp0s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="紧缺商品分类：">
					<el-select placeholder="请选择参数" clearable v-model='form.prp1' filterable>
						<el-option v-for='(item,index) in data.prp1s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="配货/补货：">
					<el-select placeholder="请选择参数" clearable v-model='form.prp2' filterable>
						<el-option v-for='(item,index) in data.prp2s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="是否进口：">
					<el-select placeholder="请选择参数" clearable v-model='form.prp5' filterable>
						<el-option v-for='(item,index) in data.prp5s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="采购人号：">
					<!--<el-select placeholder="请选择参数" clearable v-model='form.buyr' filterable>
						<el-option v-for='(item,index) in data.operationUserList' key='$index' :label="item.name" :value="item.aban8"></el-option>
					</el-select>-->
					<el-autocomplete v-model="name" :fetch-suggestions="querySearchAsync" placeholder="请选择参数" @select="handleSelect"></el-autocomplete>
				</el-form-item>
				<el-form-item class='fl' label="发运条件码：">
					<el-select placeholder="请选择参数" clearable v-model='form.shcn' filterable>
						<el-option v-for='(item,index) in data.shcns' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="商品品牌大类：" prop='prp6'>
					<el-select placeholder="请选择参数" clearable v-model='form.prp6' filterable>
						<el-option v-for='(item,index) in data.prp6s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="商品品牌：" prop='shcm'>
					<el-select placeholder="请选择参数" clearable v-model='form.shcm' filterable>
						<el-option v-for='(item,index) in data.shcms' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="计量单位(EA)：">
					<el-select placeholder="请选择参数" clearable v-model='form.uom1' filterable>
						<el-option v-for='(item,index) in data.uom1s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="采购计量单位(EA/CA)：">
					<el-select placeholder="请选择参数" clearable v-model='form.uom3' filterable>
						<el-option v-for='(item,index) in data.uom3s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="定价计量单位：">
					<el-select placeholder="请选择参数" clearable v-model='form.uom4' filterable>
						<el-option v-for='(item,index) in data.uom4s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="重量：">
					<el-select placeholder="请选择参数" clearable v-model='form.uwum' filterable>
						<el-option v-for='(item,index) in data.uwums' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="体积(CC)：">
					<el-select placeholder="请选择参数" clearable v-model='form.uvm1' filterable>
						<el-option v-for='(item,index) in data.uvm1s' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="总账分类码：" prop='glpt'>
					<el-select placeholder="请选择参数" clearable v-model='form.glpt' filterable>
						<el-option v-for='(item,index) in data.glpts' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="散装/包装标志：">
					<el-select placeholder="请选择参数" clearable v-model='form.bpfg' filterable>
						<el-option v-for='(item,index) in data.bpfgs' key='$index' :label="item.drdL01" :value="item.drky"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='fl' label="保质期(天)：">
					<el-input class='fl' placeholder="请输入参数" v-model.trim='form.sld'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="分布场所(仓库)：" prop='mcu'>
					<el-input class='fl' placeholder="请输入参数" v-model.trim='form.mcu'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="瓶条形码：">
					<el-input class='fl' placeholder="请输入参数" v-model.trim='form.citm'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="箱条形码：">
					<el-input class='fl' placeholder="请输入参数" v-model.trim='form.citm1'></el-input>
				</el-form-item>
				<el-form-item class='fl' label="转换系数：">
					<el-input class='fl' placeholder="请输入参数" v-model.trim='form.conv' disabled></el-input>
				</el-form-item>
			</el-form>
			<div class="ml-100">
				<el-button class=" ml-10 mr-50" type="primary" @click.native='addJde("form")'>提交</el-button>
				<el-button @click="handReset">重置</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { MessageBox } from 'element-ui';
	import { axiosApi, basePath } from '../../api/api'
	export default {
		data() {
			return {
				title: '同步JDE',
				loading: false,
				data: {},
				show: false,
				arr: [],
				name: '',
				timeout:  null,
				form: {
					spuNo: this.$route.params.spuNo,
					dsc1: null,
					srp0: null,
					srp1: null,
					srp2: null,
					srp3: null,
					srp4: null,
					srp5: null,
					srp4: null,
					srp6: null,
					srp7: null,
					srp8: null,
					srp9: null,
					prp1: null,
					prp2: null,
					shcn: null,
					prp6: null,
					shcm: null,
					uom1: null,
					uom3: null,
					uom4: null,
					uwum: null,
					uvm1: null,
					bpfg: null,
					glpt: null,
					srtx: null,
					sld: null,
					mcu: null,
					litm: null,
					buyr: null,
					prp5: null,
					conv:null,
					citm:null,
					citm1:null,
				},
				str1: null,
				str2: null,
				path: { path: basePath + "/proManagement" },
				rules: {
					litm:[
						{ required: true, message: '必填项' },
						{ type: 'number', message: '编码必须为数字值' },
					],
					dsc1: { required: true, message: '必填项' },
					srtx: { required: true, message: '必填项' },
					srp1: { required: true, message: '必填项' },
					srp2: { required: true, message: '必填项' },
					srp3: { required: true, message: '必填项' },
					srp4: { required: true, message: '必填项' },
					//prp6: { required: true, message: '必填项' },
					srp7: { required: true, message: '必填项' },
					srp9: { required: true, message: '必填项' },
					shcm: { required: true, message: '必填项' },
					glpt: { required: true, message: '必填项' },
					mcu:  [{ pattern: /^[0-9,]+$/, message: '请输入正确的仓库编码'},
						{ max:80, message: '长度最大80位'}]
//					citm: { pattern: /^[0-9]\d{12}$/, message: '请正确填写13位条形码'}
				},
			};
		},
		methods: {
			achieve() {//初始进入
				this.loading = true;
				axiosApi("/goods/getUdcByJde/select", {}, (res)=>{
					this.loading = false;
					if(this.$route.params.jdeGoodsNo) this.getJDEinfo();
					this.data = res.data.data;
//					console.log(this.data,'数据源')
					this.data.operationUserList.forEach((item)=>{//封装采购人号数据源
						item.value = item.name+'('+item.aban8+')';
					})
					this.arr = this.data.operationUserList;
				}, this.currentPage, 10)
			},
			//获取基础信息
			getJDEinfo(){
				axiosApi("/goods/getJdeGoods/select", {litm: this.$route.params.jdeGoodsNo}, (res)=>{
//					console.log(res,'JDE基础信息')
					if(res.data.data){
						this.str1 = JSON.stringify(res.data.data);//仅作对比数据使用
						this.form.srtx = res.data.data.srtx;//包装规格
						this.form.srp1 = res.data.data.srp1;
						this.form.srp2 = res.data.data.srp2;
						this.form.srp3 = res.data.data.srp3;
						this.form.srp4 = res.data.data.srp4;
						this.form.srp5 = res.data.data.srp5;
						this.form.srp6 = res.data.data.srp6;
						this.form.srp7 = res.data.data.srp7;
						this.form.srp8 = res.data.data.srp8;
						this.form.srp9 = res.data.data.srp9;
						this.form.srp0 = res.data.data.srp0;
						this.form.prp1 = res.data.data.prp1;
						this.form.prp2 = res.data.data.prp2;
						this.form.prp5 = res.data.data.prp5;
						this.form.buyr = res.data.data.buyr;
						this.form.shcn = res.data.data.shcn;
						this.form.prp6 = res.data.data.prp6;
						this.form.shcm = res.data.data.shcm;
						this.form.uom1 = res.data.data.uom1;
						this.form.uom3 = res.data.data.uom3;
						this.form.uom4 = res.data.data.uom4;
						this.form.uwum = res.data.data.uwum;
						this.form.uvm1 = res.data.data.uvm1;
						this.form.glpt = res.data.data.glpt;
						this.form.bpfg = res.data.data.bpfg;
						this.form.sld = res.data.data.sld;
						this.form.mcu = res.data.data.mcu;
						this.form.citm1 = res.data.data.citm1;
						this.arr.forEach((item)=>{//渲染采购人号数据
							if(this.form.buyr==item.aban8){
								this.name = item.name;
							}
						})
					}
				}, 1, 10)
			},
			//采购人号数据处理
			querySearchAsync(queryString, callback) {
			    var restaurants = this.arr;
			    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
			    clearTimeout(this.timeout);
			    this.timeout = setTimeout(() => {
			      callback(results);
			    }, 3000 * Math.random());
			},
			createStateFilter(queryString) {
			    return (state) => {
			      return (state.value.indexOf(queryString.toLowerCase()) === 0);
			    };
			},
			handleSelect(item) {
//			    console.log(item);
			    this.form.buyr = item.aban8;
			    this.name = item.name;
			},
			//保存信息
			addJde(form) {
				this.$refs[form].validate((valid) => {
					if(valid) {
						let that = this;
						this.$confirm('是否提交信息并同步至JDE？', '提示信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'info'
						}).then(() => {
							this.loading=true;
							if(this.$route.params.jdeGoodsNo){
								//console.log('23.更新JDE')
								axiosApi("/goods/addProductMcu/insert", this.form, (res) => {
									let num = 5;
									let timeout=setInterval(()=>{
										num--
										axiosApi("/goods/getJdeGoods/select", { litm:this.form.litm }, (res)=>{
											//console.log(this.str1,'字符串1')
											if(res.data.data){
												this.str2 = JSON.stringify(res.data.data);
												if(this.str1!=this.str2){
													this.loading=false;
													clearTimeout(timeout)
													this.$message({
														type: 'success',
														message: '更新JDE成功!',
														duration: 3000
													});
													that.$router.push(basePath + '/proManagement')
												}
											}
										},1,10)
										if(num==0){
											if(this.str1==this.str2){
												this.loading=false;
												clearTimeout(timeout)
												this.$message({
													type: 'info',
													message: '调取JDE信息失败,请至JDE系统确认!',
													duration: 3000
												});
											that.$router.push(basePath + '/proManagement')
										}
									}
								},1000)
							}, this.currentPage, 10, (res) => {
								this.loading=false;
									this.$message({
										type: 'info',
										message: res.data.message,
										duration: 3000
									});
								});
						}else{
							axiosApi("/goods/addProductUdc/insert", this.form, (res) => {
								let num = 5;
								let timeout=setInterval(()=>{
									num--
									axiosApi("/goods/getJdeGoods/select", { litm:this.form.litm }, (res)=>{
//										console.log(res,'成功回调')
										if(res.data.data){
											this.loading=false;
											clearTimeout(timeout)
											this.$message({
												type: 'success',
												message: '同步至JDE成功!',
												duration: 3000
											});
											that.$router.push(basePath + '/proManagement')
										}
									},1,10)
									if(num==0){
										this.loading=false;
										clearTimeout(timeout)
										that.$router.push(basePath + '/proManagement')
									}
								},1000)
							}, this.currentPage, 10, (res) => {
								this.$message({
									type: 'info',
									message: res.data.message,
									duration: 3000
								});
							});
						}
					}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消操作'
							});
						})
					} else {
						this.$confirm('请正确填写信息！', '提示信息', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								showCancelButton:false,
								type: 'warning'
							})
						return false;
					}
				});

			},
			handReset() {
				this.$confirm('确定要重置?', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.$message({
					// 	type: 'success',
					// 	message: '重置成功！'
					// });
					// history.go(0)

					this.form.litm = null;
					this.load();
				}).catch(() => {});
			},
			load(){
				this.form.dsc1 = this.$route.params.skuName;
				// if(this.$route.params.jdeGoodsNo) this.form.litm = parseInt(this.$route.params.jdeGoodsNo);
				this.form.conv = this.$route.params.specInfoNum === 'null' || this.$route.params.specInfoNum === "undefined" ? '' : this.$route.params.specInfoNum;
				this.form.citm = this.$route.params.citm === 'null'|| this.$route.params.citm === "undefined" ? '' : this.$route.params.citm;
				// console.log(this.$route.params)
				this.achieve();
				if(this.$route.params.jdeGoodsNo && !this.$route.query.iscopy){
					this.form.litm = this.$route.params.jdeGoodsNo!== 'null' && this.$route.params.jdeGoodsNo!=='undefined' ? parseInt(this.$route.params.jdeGoodsNo) : "";
					this.show = true;
					this.title = '更新JDE'
				}
			}
		},
		//进入加载
		mounted() {
			this.$nextTick(() => {
				this.load();
			})
		}
	}
</script>

<style>
	#proJde .el-form-item {
		width: 425px;
	}
	
	#proJde .main .el-form-item{
			height: 32px;
		}
	#proJde .el-form-item__error {
		margin-left: 185px;
	}
</style>