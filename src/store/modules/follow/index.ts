import { Commit } from 'vuex';
import * as Types from './types';
import * as API from './api';
import { IFollowState } from './interface';
import { Toast } from 'vant';

const state: IFollowState = {
    loadingUserInfo: false,
    followUserInfo: {},
    followState: '待审核',
};

const actions = {
    async [Types.GET_FOLLOWED_USER_INFO](context: { commit: Commit; state: IFollowState }, params: any) {
        let followUserInfo: any = {};
        context.commit(Types.GET_FOLLOWED_USER_INFO, { loading: true, followUserInfo });
        followUserInfo = await API.GetFollowedUserInfo(params);
        context.commit(Types.GET_FOLLOWED_USER_INFO, { loading: false, followUserInfo });
    },
    async [Types.AGREE_FOLLOWED](context: { commit: Commit; state: IFollowState }, params: any) {
        const result = await API.AgreeSomeoneFollowedMe(params);
        context.commit(Types.AGREE_FOLLOWED, result);
    },
    async [Types.REFUSE_FOLLOWED](context: { commit: Commit; state: IFollowState }, params: any) {
        const result = await API.RefuseSomeoneFollowedMe(params);
        context.commit(Types.REFUSE_FOLLOWED, result);
    },
};

const mutations = {
    [Types.GET_FOLLOWED_USER_INFO](state: IFollowState, payload: any) {
        state.loadingUserInfo = payload.loading;
        state.followUserInfo = payload.followUserInfo;
        state.followState = payload.followUserInfo.FollowState && payload.followUserInfo.FollowState !== '待审核' ? (payload.followUserInfo.FollowState === '已关注' ? payload.followUserInfo.FollowState : '已拒绝') : '待审核';
    },
    [Types.AGREE_FOLLOWED](state: IFollowState, payload: any) {
        if (payload.result) {
            state.followState = '已关注';
            Toast.success('同意成功');
        }
    },
    [Types.REFUSE_FOLLOWED](state: IFollowState, payload: any) {
        if (payload.result) {
            state.followState = '已拒绝';
            Toast.success('拒绝成功');
        }
    },
};

export default { namespaced: true, state, actions, mutations };
