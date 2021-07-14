import { createStore } from 'vuex';

// 后台接口返回参数类
export interface IAxiosResponseData {
    status: number;
    message: string;
    data: any;
}

export default createStore({
    // modules: {
    // },
});
