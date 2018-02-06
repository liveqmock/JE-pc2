<template>
	<div>
		<el-menu mode="vertical" :default-active="$route.meta.active" router :default-openeds="openMenuList" @open="menuOpen" @close="menuClose" class="el-menu-vertical-demo pt-20">
			<el-submenu v-for="(data,index1) in datas" v-if="data.sub" :index='data.text' :key="index1">
				<template slot="title"><i class="iconfont mr-10" :class="data.icon"></i>{{data.text}}</template>
				<el-menu-item v-for="(item,index2) in data.sub" :index="basePath + item.url" :key="index1 +'-'+index2">
					&nbsp {{item.text}}
				</el-menu-item>
			</el-submenu>
			<el-menu-item v-else :index="basePath + data.url" class="bbd">{{data.text}}</el-menu-item>
		</el-menu>
	</div>
</template>
<script>
	import { axiosApi, basePath} from "../api/api";
	import { bus } from "../main";
	export default {
		name: 'nava',
		data() {
			return {
				datas: [],
				id: -1,
				isAdmin: -1,
				loginName: "",
				basePath:basePath,
				openMenuList: []
			}
		},
		mounted() {
			// this.$nextTick(() => {
				// this.loading(1);
				this.$on('resourceAdd',(type)=>{
//					console.log(type)
//					this.loading(type)
				})
			// });
			this.openMenuList.push(this.$route.meta.openMenu);
		},
		created () {
			this.loading(1);
		  bus.$on('naveTree', (data) => {
		    this.datas = data;
		  })
		},
		methods: {
			menuOpen(val){
				// console.log('open',val)
				this.openMenuList.push(val);
			},
			menuClose(val){
				let index = this.openMenuList.indexOf(val);
				if (index > -1) {
					this.openMenuList.splice(index, 1);
				}
			},
			selectOneByLoginName(res) {
				this.id = res.data.data.id;
				sessionStorage.traderId = res.data.data.traderId;
				this.isAdmin = res.data.data.isAdmin;
				sessionStorage.setItem("isAdmin",res.data.data.isAdmin)
				sessionStorage.setItem("loginName",res.data.data.loginName)
				this.loginName = res.data.data.loginName;
				this.loading(2);

			},
			loading(type) {
				if(type == 1) {
					let loginName = sessionStorage.getItem('loginName')
					const api1 = loginName ? "/foundation/employee/selectOneByLoginName" : "/employee/getLoginInfo";
					const body1 = {
						"loginName": sessionStorage.loginName1 || sessionStorage.loginName,
						 "appId": 1
					};
					axiosApi(api1, body1, this.selectOneByLoginName, 1, 10);
				}
				if(type == 2) {
					const api2 = "/foundation/resource/displaytree";
					const body2 = {
						"loginName": this.loginName,
						'appId': 1
					};
					axiosApi(api2, body2, res=>{
						this.datas = !res.data.data ? [] : res.data.data;
						if(!res.data.data){
							this.$alert('该账号没有任何操作权限！', '提示', {
			                    confirmButtonText: '确定'
			                });
						}
						var buttonList = [];//按钮列表
						// this.prototype.dataTree = this.datas;
						this.datas.forEach((item)=>{
							// console.log(item)
							if(!!item.sub) item.sub.forEach((item2)=>{
								//if(!!item2.sub) delete item2.sub;//如果有按钮则删除按钮
	
								if(!!item2.sub) {
									buttonList = buttonList.concat(item2.sub) 
									// console.log(item2.sub)
									item2.sub = null;
								}
							})
						})
						bus.$emit('buttonList',buttonList);
						sessionStorage.setItem("buttonList",JSON.stringify(buttonList))
					});
				}
				
			}
		}
	}
</script>
<style scoped>
	* {}
</style>