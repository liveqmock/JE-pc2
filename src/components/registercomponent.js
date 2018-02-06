import Vue from 'vue'
import Ueditor from './ueditor.vue'
import AddCustomer from './super/addcustomer.vue'
import FreightEdit from './super/freightEdit.vue'
//站点管理，站点预览
import storeTop from '../views/mconfig/previewPage/storeTop.vue' 
import foot from '../views/mconfig/previewPage/foot.vue' 
import imgview from './imgview.vue' //图片预览
import ysDaterangePicker from './ys-daterange-picker.vue';//时间区间组件
export default {
  init() {
    Vue.component('UEeditor', Ueditor)
    Vue.component('AddCustomer', AddCustomer)
    Vue.component('FreightEdit', FreightEdit)
    Vue.component('storeTop', storeTop)
    Vue.component('foot', foot)
    Vue.component('imgview', imgview)
    Vue.component('ysDaterangePicker', ysDaterangePicker)
  }
}
