import {createAsyncThunk} from "@reduxjs/toolkit";
import {api, API_URL} from "../../config/api.ts";
import {Logs} from "./Action.ts";
import {AxiosError} from "axios";
import {PageResponse} from "../Page/ActionType.ts";

export const getLogsBetween = createAsyncThunk(
    'logs/getLogsBetween',
    async (params: { startDate: string; endDate: string, page: number, size: number }, {rejectWithValue}) => {
        try {
            const {data} = await api.get<PageResponse<Logs>>(`${API_URL}/logs/between`, {
                params: {
                    startDate: params.startDate,
                    endDate: params.endDate,
                    page: params.page,
                    size: params.size

                }
            });
            console.log("logs", data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
)