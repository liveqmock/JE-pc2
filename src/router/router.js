import Vue from 'vue';
import Router from 'vue-router';
import App from '../App.vue'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import NotFound from '../views/notFound.vue'
import Department from '../views/sys/department.vue'
import AddPartment from '../views/sys/addPartment.vue' //新增编辑部门
import Limits from '../views/sys/limits.vue'
import AddRole from '../views/sys/addRole.vue'
import EditRole from '../views/sys/editRole.vue'
import CheckRole from '../views/sys/checkRole.vue'
import People from '../views/sys/people.vue'
import AddPeople from '../views/sys/addPeople.vue'
import EditPeople from '../views/sys/editPeople.vue'
import MyAccount from '../views/sys/myAccount.vue'
import ProManagement from '../views/pro/proManagement.vue'
import ProDetails from '../views/pro/proDetails.vue'
import ProJde from '../views/pro/proJde.vue'
import ProBrand from '../views/pro/proBrand.vue'
import ProOrigin from '../views/pro/proOrigin.vue'
import ProCategory from '../views/pro/proCategory.vue'
import ProCation from '../views/pro/proCation.vue'
import ProRelation from '../views/pro/proRelation.vue'
import Welcome from '../views/welcome.vue'

import AllMerchantList from '../views/merchant/allMerchantList.vue' //商家管理
import Recycle from '../views/merchant/recycle.vue' //商家管理 回收站
import MerchantEdit from '../views/merchant/merchantEdit.vue' //商家管理 编辑
import MerchantDetail from '../views/merchant/merchantDetail.vue' //商家管理 详情  ，审核
import AddLicenseGood from '../views/merchant/addLicenseGood.vue' //商家管理   编辑 添加授权商品
import LookAgreement from '../views/merchant/lookAgreement.vue' //选择销售资质
import BranderList from '../views/merchant/branderList.vue' //商家管理 品牌商管理
import SupplierApply from '../views/merchant/supplierApply.vue' //品牌商品申请
import SupplierDetail from '../views/merchant/supplierDetail.vue' //品牌商品审核详情
import BrandDetail from '../views/merchant/brandDetail.vue' //品牌商  未通过 详情
import BrandCheck from '../views/merchant/brandCheck.vue' //品牌商  待审核 详情 编辑
import CertHistory from '../views/merchant/certHistory.vue' //品牌商  待审核 详情 编辑
import SupplierSaleArea from '../views/merchant/supplierSaleArea.vue' //设置区域时效
import Resource from '../views/resource/resource.vue' //菜单/资源列表
import ResourceAdd from '../views/resource/resourceAdd.vue' //添加菜单
import Authority from '../views/resource/authority.vue' //权限管理
import Site from '../views/mconfig/site.vue' //站点管理
import Screen from '../views/mconfig/screen.vue' //分类筛选项
import NoticePro from '../views/mconfig/noticePro.vue' //公告促销
import AddNotice from '../views/mconfig/addNotice.vue' //新增通知
import AdManage from '../views/mconfig/adManage.vue' //广告管理
import EditAd from '../views/mconfig/editAd.vue' //新增编辑广告
import Recommend from '../views/mconfig/recommend.vue' //商品首页推荐
import OrderList from '../views/order/allOrderList.vue' //订单列表
import OrderDetail from '../views/order/orderDetail.vue' //订单详情
import AddScreen from '../views/mconfig/addScreen.vue' //添加分类筛选项
//新加
import HomeNew from '../views/homeNew.vue'
//超团
import SuperCustomer from '../views/super/supercustomer.vue'
import FreightPrice from '../views/super/freightPrice.vue'
import GroupOrder from '../views/super/groupOrder.vue'//超团订单
import GroupOrderDetails from '../views/super/groupOrderDetails.vue'//超团订单详情
import GroupStatement from '../views/super/groupStatement.vue'//超团报表

/*新增支付账户中心*/
import AtCenter from '~/views/account/atCenter.vue' //账户中心
import CashRequisition from '~/views/account/cashRequisition.vue' //提现申请单
import CashAppAudit from '~/views/account/cashAppAudit.vue' //提现申请审核
import Recharge from '~/views/account/recharge.vue' //充值单

// 消息管理
// 系统消息
import systemMessage from '~/views/message/systemMessage.vue';
// 短信通知
import smsNotification from '~/views/message/smsNotification.vue';

//新增站点
import AddSite from '../views/mconfig/addSite.vue' //站点管理

/*超C*/
import DistributorCheck from '~/views/superC/distributorCheck.vue' //分销商审核
import SupercOrder from '~/views/superC/orderList.vue' //订单列表
import SupercOrderDetail from '~/views/superC/orderDetail.vue' //订单详情

/*站点管理  预览*/
import PreHome from '~/views/mconfig/previewPage/home.vue'

/* 商家交易流水 */
import TradingWater from '~/views/account/tradingWater.vue'

/* 支付账户中心收支汇总 */
import ReSummary from '~/views/account/reSummary.vue' //收支汇总
import ChannelPayment from '~/views/account/channelPayment.vue' //支付渠道收支明细

import VControl from '~/views/versionControl/vControl.vue' //APP版本控制
import VSet from '~/views/versionControl/vSet.vue' //设置


Vue.use(Router)
import { basePath } from '../api/api'

export default new Router({
	mode: "history",
	scrollBehavior(to, from, savedPosition) {
		// console.log(savedPosition)
		if(savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},
	routes: [{
			path: basePath + '/login',
			component: Login
		},
		{
			path: basePath + '/404',
			component: NotFound
		},
		{
			path: "/new",
			component: HomeNew,
			children: [
                {
    				path: basePath + '/myAccount', //系统管理/我的账户
    				component: MyAccount
    			}
            ]
		},
		{
			path: basePath + '/sitepreview',
			component: PreHome
		},
		{
			path: basePath + '/',
			component: Home,
			children: [
                {
					path: basePath + '/welcome', //欢迎首页
					component: Welcome
				},
				{
					path: basePath + '/department', //部门人员管理
					component: Department,
					meta: {
						active: basePath + '/department',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/dep/addPartment/:id?/:sign?', //新增编辑部门
					component: AddPartment,
					meta: {
						active: basePath + '/department',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/limits', //系统管理/权限管理
					component: Limits,
					meta: {
						active: basePath + '/limits',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/addRole/:sign?', //系统管理/角色编辑
					component: AddRole,
					meta: {
						active: basePath + '/limits',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/editRole/:id?/:text?/:isDisplay?', //系统管理/角色编辑
					component: EditRole,
					meta: {
						active: basePath + '/limits',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/checkRole', //系统管理/角色编辑
					component: CheckRole
				},
				{
					path: basePath + '/people', //系统管理/人员管理新
					component: People,
					meta: {
						keepAlive: true,
						active: basePath + '/people',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/addPeople/:sign?', //系统管理/新增员工新
					component: AddPeople,
					meta: {
						active: basePath + '/people',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/editPeople/:sign?', //系统管理/编辑员工新
					component: EditPeople,
					meta: {
						active: basePath + '/people',
						openMenu: '人员管理'
					}
				},
				{
					path: basePath + '/proManagement', //商品管理/商品库管理
					component: ProManagement,
					meta: {
						keepAlive: true,
						active: basePath + '/proManagement',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proDetails/:id?/:classifyName?', //商品管理/商品详情
					component: ProDetails,
					meta: {
						active: basePath + '/proManagement',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proJde/:skuName?/:spuNo?/:citm?/:specInfoNum?/:jdeGoodsNo?', //商品管理/同步至Jde
					component: ProJde,
					meta: {
						active: basePath + '/proManagement',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proBrand', //商品管理/品牌管理
					component: ProBrand,
					meta: {
						active: basePath + '/proBrand',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proOrigin', //商品管理/产地管理
					component: ProOrigin,
					meta: {
						active: basePath + '/proOrigin',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proCategory', //商品管理/品类管理
					component: ProCategory,
					meta: {
						active: basePath + '/proCategory',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proCation', //商品管理/分类管理
					component: ProCation,
					meta: {
						active: basePath + '/proCation',
						openMenu: '商品库管理'
					}
				},
				{
					path: basePath + '/proRelation/:id?/:name', //商品管理/分类管理->设置关联参数
					component: ProRelation
				},
				{
					path: basePath + '/merchant/allMerchantList', //商家管理 全部列表
					component: AllMerchantList,
					meta: {
						keepAlive: true,
						active: basePath + '/merchant/allMerchantList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/recycle', //商家管理 回收站 全部列表
					component: Recycle
				},
				{
					path: basePath + '/merchant/merchantEdit/:id?/:state?', //商家管理 编辑
					component: MerchantEdit,
					meta: {
						active: basePath + '/merchant/allMerchantList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/merchantDetail/:id', //商家管理  详情 ，审核
					component: MerchantDetail,
					meta: {
						active: basePath + '/merchant/allMerchantList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/addGood', //商家管理   编辑 添加授权商品
					component: AddLicenseGood,
					meta: {
						active: basePath + '/merchant/branderList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/lookAgreement', //商家管理   编辑 添加授权商品
					component: LookAgreement
				},
				{
					path: basePath + '/merchant/branderList', //商家管理 品牌商管理
					component: BranderList,
					meta: {
						keepAlive: true,
						active: basePath + '/merchant/branderList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/branderList/merchantEdit/:id?/:state?', //商家管理 编辑
					component: MerchantEdit,
					meta: {
						active: basePath + '/merchant/branderList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/supplierApply', //品牌商品申请
					component: SupplierApply,
					meta: {
						keepAlive: true,
						active: basePath + '/merchant/supplierApply',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/supplierDetail/:id?', //品牌商品审核详情
					component: SupplierDetail,
					meta: {
						active: basePath + '/merchant/supplierApply',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/brandDetail/:id?/:certId?', //品牌商 未通过 详情
					component: BrandDetail,
					meta: {
						active: basePath + '/merchant/branderList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/brandCheck/:id?/:certId?', //品牌商 待审核 编辑页面
					component: BrandCheck,
					meta: {
						active: basePath + '/merchant/branderList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/merchant/certHistory/:id?/:certId?', // 品牌商 待审核 经销协议历史记录
					component: CertHistory
				},
				{
					path: basePath + '/merchant/supplierSaleArea/:path?/:id?/:isExpired?', // 设置区域时效
					component: SupplierSaleArea,
					meta: {
						active: basePath + '/merchant/branderList',
						openMenu: '商家管理'
					}
				},
				{
					path: basePath + '/resource', //在菜单/资源列表
					component: Resource,
					meta: {
						active: basePath + '/resource',
						openMenu: '资源管理'
					}
				}, 
				{
					path: basePath + '/resourceAdd/:id?', //添加菜单/资源
					component: ResourceAdd,
					meta: {
						active: basePath + '/resource',
						openMenu: '资源管理'
					}
				}, 
				{
					path: basePath + '/authority', //添加菜单/资源
					component: Authority,
					meta: {
						active: basePath + '/authority',
						openMenu: '资源管理'
					}
				},
				{
					path: basePath + '/site', //商城配置/站点管理
					component: Site,
					meta: {
						active: basePath + '/site',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/addSite', //商城配置/站点管理/新增站点
					name: 'addSite',
					component: AddSite,
					meta: {
						active: basePath + '/site',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/screen', //商城配置/分类筛选
					component: Screen,
					meta: {
						active: basePath + '/screen',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/addScreen/:id?', //商城配置/添加分类筛选
					component: AddScreen,
					meta: {
						active: basePath + '/screen',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/noticePro', //商城配置/公告促销
					component: NoticePro,
					meta: {
						keepAlive: true,
						active: basePath + '/noticePro',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/addNotice/:noticeId?', //商城配置/新增通知
					component: AddNotice,
					meta: {
						active: basePath + '/noticePro',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/adManage', //商城配置/广告管理
					component: AdManage,
					meta: {
						keepAlive: true,
						active: basePath + '/adManage',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/editAd/:adId?', //商城配置/新增编辑广告
					component: EditAd,
					meta: {
						active: basePath + '/adManage',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/recommend', //商城配置/商品首页推荐
					component: Recommend,
					meta: {
						active: basePath + '/recommend',
						openMenu: '商城管理'
					}
				},
				{
					path: basePath + '/order/allOrderList', //订单列表
					component: OrderList,
					meta: {
						keepAlive: true,
						active: basePath + '/order/allOrderList',
						openMenu: '订单查询'
					}
				},
				{
					path: basePath + '/order/orderDetail', //订单详情
					component: OrderDetail,
					meta: {
						active: basePath + '/order/allOrderList',
						openMenu: '订单查询'
					}
				},
				{
					path: basePath + '/account/orderDetail', //我的账户查看详情
					component: OrderDetail,
					meta: {
						active: basePath + '/accountCenter',
						openMenu: '我的账户'
					}
				},
				{
					path: basePath + '/accountCenter', //账户中心
					component: AtCenter,
					meta: {
						keepAlive: true,
						active: basePath + '/accountCenter',
						openMenu: '我的账户'
					}
				},
				{
					path: basePath + '/tradingWater', // 商家交易流水
					component: TradingWater,
					meta: {
						active: basePath + '/tradingWater',
						openMenu: '我的账户'
					}
				},
				{
					path: basePath + '/TradingWater/orderDetail', //商家交易流水查看详情
					component: OrderDetail,
					meta: {
						active: basePath + '/tradingWater',
						openMenu: '我的账户'
					}
				},
				{
					path: basePath + '/cashRequisition', //提现申请单
					component: CashRequisition,
					meta: {
						keepAlive: true,
						active: basePath + '/cashRequisition',
						openMenu: '我的账户'
					}
				},
				{
					path: basePath + '/cashAppAudit', //提现申请审核
					component: CashAppAudit,
					meta: {
						active: basePath + '/cashRequisition',
						openMenu: '我的账户'
					}
				},
				{
					path: basePath + '/recharge', //充值单
					component: Recharge,
					meta: {
						active: basePath + '/recharge',
						openMenu: '我的账户'
					}
				},
				/* 支付3期 */
				{
				   path: basePath + '/reSummary',// 收支汇总
                    component: ReSummary,
                    meta:{
                    	keepAlive:true,
						active: basePath + '/reSummary',
						openMenu: '我的账户'
                    }
                },
                {
                    path: basePath + '/channelPayment', //支付渠道收支明细
                    component: ChannelPayment,
                    meta:{
						active: basePath + '/reSummary',
						openMenu: '我的账户'
                    }
                },
                /* 支付3期 */
				{
					path: basePath + '/super/supercustomer', //团购商家
					component: SuperCustomer,
					meta: {
						active: basePath + '/super/supercustomer',
						openMenu: '超团管理'
					}
				},
				{
					path:basePath+ '/super/freightPrice',  //团购商家
					component: FreightPrice,
					meta: {
						active: basePath + '/super/freightPrice',
						openMenu: '超团管理'
					}
				},
				{
					path:basePath+ '/super/groupOrder',  //超团订单
					component: GroupOrder,
					meta: {
						active: basePath + '/super/groupOrder',
						openMenu: '超团管理'
					}
				},{
					path:basePath+ '/super/groupOrderDetails',  //超团订单详情
					component: GroupOrderDetails,
					meta: {
						active: basePath + '/super/groupOrderDetails',
						openMenu: '超团管理'
					}
				},{
					path:basePath+ '/super/groupStatement',  //超团报表
					component: GroupStatement,
					meta: {
						active: basePath + '/super/groupStatement',
						openMenu: '超团管理'
					}
				},
				{
					path: basePath + '/distributorCheck', //超级c分销商管理
					component: DistributorCheck,
					meta: {
						active: basePath + '/distributorCheck',
						openMenu: '久集管理'
					}
				},
				{
					path: basePath + '/superc/orderList', //订单列表
					component: SupercOrder,
					meta: {
						keepAlive: true,
						active: basePath + '/superc/orderList',
						openMenu: '订单查询'
					}
				},
				{
					path: basePath + '/superc/orderDetail', //订单详情
					component: SupercOrderDetail,
					meta: {
						active: basePath + '/superc/orderList',
						openMenu: '订单查询'
					}
				},
				{
					path: basePath + '/systemMessage', // 系统消息
					component: systemMessage,
					meta: {
						active: basePath + '/systemMessage',
						openMenu: '消息管理'
					}
				},
				{
					path: basePath + '/smsNotification', // 短信通知
					component: smsNotification,
					meta: {
						active: basePath + '/smsNotification',
						openMenu: '消息管理'
					}
				},
				{
					path: basePath + '/vControl', //APP版本控制
					component: VControl,
					meta: {
						active: basePath + '/vControl',
						openMenu: '运营平台'
					}
				},
				{
					path: basePath + '/vSet', //APP版本设置
					component: VSet,
					meta: {
						active: basePath + '/vControl',
						openMenu: '运营平台'
					}
				}
			]
		},
		{
			path: basePath,
			redirect: {
				path: basePath + '/login'
			}
		},
		{
			path: '/',
			redirect: {
				path: basePath + '/login'
			}
		},
		{
			path: basePath + '/',
			redirect: {
				path: basePath + '/login'
			}
		},
		{
			path: '*',
			redirect: {
				path: basePath + '/404'
			}
		}
	]
})