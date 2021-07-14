import { IAxiosResponseData } from '@/store';
import { axios } from '@/nmb/request';

const api = `api/Mysoft.Calendar.Common.AppServices.FollowAppService/`;

export const GetFollowedUserInfo = async (params: any): Promise<IAxiosResponseData> => await axios.post(`${api}GetFollowedUserInfo`, params);

export const RefuseSomeoneFollowedMe = async (params: any): Promise<IAxiosResponseData> => await axios.post(`${api}RefuseSomeoneFollowedMe`, params);

export const AgreeSomeoneFollowedMe = async (params: any): Promise<IAxiosResponseData> => await axios.post(`${api}AgreeSomeoneFollowedMe`, params);
