import {AssetHistoryResponse, AssetResponse} from "./ActionType.ts";
import {createSlice} from "@reduxjs/toolkit";
import {
    createAsset,
    deleteAsset,
    getAssetByAssetId, getAssetHistoriesByAssetId,
    getAssets, getAssetsByUserId,
    updateAssetById
} from "./Reducer.ts";

interface AssetState{
    assets:AssetResponse[],
    assetHistory:AssetHistoryResponse[],
    selectedAsset:AssetResponse | null,
    assetsOfUser:AssetResponse[],
    isLoading:boolean,
    success:string| null,
    error:string| null,
    page:number,
    size:number,
    first:boolean,
    last:boolean,
    totalElements:number,
    totalPages:number,
}
const initialState:AssetState={
    assets:[],
    assetsOfUser:[],
    selectedAsset:null,
    assetHistory:[],
    isLoading:false,
    success:'',
    error:'',
    page:0,
    size:10,
    first:true,
    last:false,
    totalElements:0,
    totalPages:0,
}
export const assetSlice=createSlice({
    name:'asset',
    initialState,
    reducers:{
        resetStatus: (state) => {
            state.success = null;
            state.error = null;
        }
    },
    extraReducers:(builder=>{
        builder
            //getAssets
            .addCase(getAssets.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(getAssets.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.assets=action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.first=action.payload.first;
                state.last=action.payload.last;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getAssets.rejected,(state, action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //getAssetByAssetId
            .addCase(getAssetByAssetId.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(getAssetByAssetId.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.selectedAsset=action.payload;
            })
            .addCase(getAssetByAssetId.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //create asset
            .addCase(createAsset.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(createAsset.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.success = 'Asset created successfully';
                state.assets.push(action.payload);
            })
            .addCase(createAsset.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //updateAsset
            .addCase(updateAssetById.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(updateAssetById.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.success = 'Asset updated successfully';
                const index = state.assets.findIndex(asset => asset.id === action.payload.id);
                if (index !== -1) {
                    state.assets[index] = action.payload; // Cập nhật tài sản trong danh sách
                }
            })
            .addCase(updateAssetById.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //deleteAsset
            .addCase(deleteAsset.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(deleteAsset.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.success=action.payload;
            })
            .addCase(deleteAsset.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })

            //getAssetsByUserId
            .addCase(getAssetsByUserId.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(getAssetsByUserId.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.assetsOfUser=action.payload.content;
                state.size = action.payload.size;
                state.page = action.payload.number;
                state.first=action.payload.first;
                state.last=action.payload.last;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getAssetsByUserId.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //getAssetHistoriesByAssetId
            .addCase(getAssetHistoriesByAssetId.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(getAssetHistoriesByAssetId.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.assetHistory=action.payload.content;
                state.first=action.payload.first;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.last=action.payload.last;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getAssetHistoriesByAssetId.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
    })
})

export const { resetStatus } = assetSlice.actions;
export default assetSlice.reducer;