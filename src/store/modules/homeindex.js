import { axiosApi, basePath } from '../../api/api.js'
import m from '../../main.js';

const homeSearch = {
    state: {
        classfilShow: null,
        collectStoreBtn: false,
        currentPage: 1,
        showRaceCondition: false,
        sellerId: null,
        isCollection: false,
        shoppingCarNum: 0,
        mloginDialogState: false,
    },
    mutations: {
        setloginDialog(state, data) {
            state.mloginDialogState = data;
        },
        mouseShow(state) {
            state.classfilShow = true;
        },
        mouseHide(state){
            state.classfilShow = false;
        },
        collectStoreShow(state){
            state.collectStoreBtn = true;
        },
        collectStoreHide(state){
            state.collectStoreBtn = false;
        }
    },
    actions: {
        getUserId({state},payload) {
            state.sellerId = payload.sellerId;
            state.isCollection = payload.isCollection;
        },
        setShoppingCarNum({state},payload) {
            if(!payload){
                axiosApi("/anon/order/cart/count", {operatorType:1,buyerId:sessionStorage.traderId}, (res) => {
                    state.shoppingCarNum = res.data.data < 100 ? res.data.data : '99+';
                }, 1, 10)
            }else{
                state.shoppingCarNum = payload < 100 ? payload : '99+';
            }
        }
    },
    getters: {
        
    }
}

export default homeSearch