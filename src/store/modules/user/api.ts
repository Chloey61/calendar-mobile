import { IAxiosResponseData } from '@/store';
import { axios } from '@/nmb/request';

const api = `api/Mysoft.Calendar.BaseSet.AppServices.UseSettingAppService/`;

// 获取用户设置
export const getUserSettings = async (params: any): Promise<IAxiosResponseData> => await axios.post(`${api}GeUserSetting`, params);

// 保存用户设置
export const saveUserSetting = async (params: any): Promise<IAxiosResponseData> => await axios.post(`${api}SaveUserSetting`, params);
