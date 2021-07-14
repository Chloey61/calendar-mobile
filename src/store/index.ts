import { createStore } from 'vuex';
import user from './modules/user';
import follow from './modules/follow';

// 后台接口返回参数类
export interface IAxiosResponseData {
    status: number;
    message: string;
    data: any;
}

export default createStore({
    modules: {
        user,
        follow,
    },
});
