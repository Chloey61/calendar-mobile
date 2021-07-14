import { Commit } from 'vuex';
import { IParamsUserSettings, IUserInfo, IUserState, IParamsSaveSettings } from './interface';
import * as Types from './type';
import * as API from './api';

const state: IUserState = {
    userInfo: {} as IUserInfo,
    userSettings: {} as any,
    saveUserSettingBol: Boolean,
};

const actions = {
    [Types.USER_INFO](context: { commit: Commit; state: IUserState }) {
        const userInfo: IUserInfo = JSON.parse(localStorage.getItem('loginUser') as string);
        context.commit(Types.USER_INFO, userInfo);
    },
    async [Types.USER_SETTINGS](context: { commit: Commit; state: IUserState }, params: IParamsUserSettings) {
        const result = await API.getUserSettings(params);
        context.commit(Types.USER_SETTINGS, result);
    },
    async [Types.SAVE_USER_SETTING](context: { commit: Commit; state: IUserState }, params: IParamsSaveSettings) {
        const result = await API.saveUserSetting(params);
        context.commit(Types.SAVE_USER_SETTING, result);
    },
};

const mutations = {
    [Types.USER_INFO](state: IUserState, userInfo: IUserInfo) {
        state.userInfo = userInfo;
    },
    [Types.USER_SETTINGS](state: IUserState, userSettings: any) {
        state.userSettings = userSettings;
    },
    [Types.SAVE_USER_SETTING](state: IUserState, saveUserSettingBol: any) {
        state.saveUserSettingBol = saveUserSettingBol;
    },
};

export default { namespaced: true, state, actions, mutations };
