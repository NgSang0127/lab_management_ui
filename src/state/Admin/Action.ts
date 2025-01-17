import {User} from "../Authentication/Action.ts";
import {createSlice} from "@reduxjs/toolkit";
import {createUser, deleteUser, getUsers, updateUser} from "./Reducer.ts";

export interface CreateUserRequestByAdmin{
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    enabled: boolean;
    role:string;
    accountLocked: boolean;

}

interface AdminState{
    user:User[],
    isLoading:boolean,
    success:string | null,
    error:string | null,
    page: number;
    size: number;
    first:boolean,
    last:boolean,
    totalElements: number;
    totalPages: number;
}
const initialState:AdminState={
    user:[],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first:true,
    last:false,
    isLoading:false,
    success:null,
    error:null
}
export const adminSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{},
    extraReducers:(builder=>{
        builder
            //getUsers
            .addCase(getUsers.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(getUsers.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.user=action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.first=action.payload.first;
                state.last=action.payload.last;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getUsers.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //updateUser
            .addCase(updateUser.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(updateUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.success=action.payload;
            })
            .addCase(updateUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //createUser
            .addCase(createUser.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(createUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.success=action.payload;
            })
            .addCase(createUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //deleteUser
            .addCase(deleteUser.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(deleteUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.success=action.payload;
            })
            .addCase(deleteUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
    })
})
export default adminSlice;