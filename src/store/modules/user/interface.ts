export interface IUserInfo {
    UserCode: string;
    UserGUID: string;
    UserName: string;
    UserIcon: string;
    Email: string;
}
export interface IParamsSaveSettings {
    userGUID: string;
    userCode: string;
    ifEnableFollowedCheck: number;
    weeklyDisplayType: number;
    quarterlyPoints: string;
    monthlyPoints: string;
    weeklyTitleSetting: string;
    sendFrom: string;
    mailPwd: string;
    weeklyDesc: string;
    weeklyTemplateId: number;
    sendTo: string;
    carbonCopy: string;
}

export interface IUserState {
    userInfo: IUserInfo;
    userSettings: any;
    saveUserSettingBol: any;
}

export interface IParamsUserSettings {
    userId: string;
}
