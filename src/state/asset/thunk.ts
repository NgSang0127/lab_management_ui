// import {createAsyncThunk} from "@reduxjs/toolkit";
// import {api} from "../../config/api.ts";
// import axios from "axios";
// import {PageResponse} from "../page/types.ts";
// import {AssetHistoryResponse, AssetRequest, AssetResponse} from "./types.ts";
//
// export const getAssets=createAsyncThunk(
//     'asset/getAssets',
//     async(params:{page:number ,size:number},{rejectWithValue})=>{
//         try{
//             const response=await api.get<PageResponse<AssetResponse>>('/admin/assets',{
//                 params:{
//                     page:params.page,
//                     size:params.size
//                 }
//             });
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error) && error.response && error.response.data) {
//                 return rejectWithValue(error.response.data);
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const getAssetByAssetId=createAsyncThunk(
//     'asset/getAssetByAssetId',
//     async(id:number,{rejectWithValue})=>{
//         try{
//             const response=await api.get(`/admin/assets/${id}`);
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error) && error.response && error.response.data) {
//                 return rejectWithValue(error.response.data);
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const createAsset=createAsyncThunk(
//     'asset/createAsset',
//     async(request:AssetRequest,{rejectWithValue})=>{
//         try{
//             const response=await api.post(`/admin/assets`,request);
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error) && error.response && error.response.data) {
//                 return rejectWithValue(error.response.data);
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const updateAssetById=createAsyncThunk(
//     'asset/updateAssetById',
//     async({id,request}:{id:number,request:AssetRequest},{rejectWithValue})=>{
//         try{
//             const response=await api.put(`/admin/assets/${id}`,request);
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error)) {
//                 if (error.response && error.response.data) {
//                     const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
//                     return rejectWithValue(backendError);
//                 }
//                 return rejectWithValue('No response from server');
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const deleteAsset=createAsyncThunk(
//     'asset/deleteAsset',
//     async(id:number,{rejectWithValue})=>{
//         try{
//             const response=await api.delete(`/admin/assets/${id}`);
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error)) {
//                 if (error.response && error.response.data) {
//                     const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
//                     return rejectWithValue(backendError);
//                 }
//                 return rejectWithValue('No response from server');
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const assignAssetToUser=createAsyncThunk(
//     'asset/assignAssetToUser',
//     async({assetId,userId}:{assetId:number,userId:number},{rejectWithValue})=>{
//         try{
//             const response=await api.post(`/admin/assets/${assetId}/assign/${userId}`);
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error)) {
//                 if (error.response && error.response.data) {
//                     const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
//                     return rejectWithValue(backendError);
//                 }
//                 return rejectWithValue('No response from server');
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const unassignAsset=createAsyncThunk(
//     'asset/unassignAsset',
//     async(assetId:number,{rejectWithValue})=>{
//         try{
//             const response=await api.post(`/admin/assets/${assetId}/unassign`);
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error)) {
//                 if (error.response && error.response.data) {
//                     const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
//                     return rejectWithValue(backendError);
//                 }
//                 return rejectWithValue('No response from server');
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const getAssetsByUserId=createAsyncThunk(
//     'asset/getAssetsByUserId',
//     async(params:{userId:number,page:number,size:number},{rejectWithValue})=>{
//         try{
//             const response=await api.get<PageResponse<AssetResponse>>(`/admin/assets/user/${params.userId}`,{
//                 params:{
//                     page:params.page,
//                     size:params.size
//                 }
//             });
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error)) {
//                 if (error.response && error.response.data) {
//                     const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
//                     return rejectWithValue(backendError);
//                 }
//                 return rejectWithValue('No response from server');
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
//
// export const getAssetHistoriesByAssetId=createAsyncThunk(
//     'asset/getAssetHistoriesByAssetId',
//     async(params:{assetId:number,page:number,size:number},{rejectWithValue})=>{
//         try{
//             const response=await api.get<PageResponse<AssetHistoryResponse>>(`/admin/assets/${params.assetId}/history`,{
//                 params:{
//                     page:params.page,
//                     size:params.size
//                 }
//             });
//             return response.data;
//         }catch(error){
//             if (axios.isAxiosError(error)) {
//                 if (error.response && error.response.data) {
//                     const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
//                     return rejectWithValue(backendError);
//                 }
//                 return rejectWithValue('No response from server');
//             }
//             return rejectWithValue('Unknown error');
//         }
//     }
// )
