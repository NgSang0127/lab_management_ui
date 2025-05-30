import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Typography, Box,
} from "@mui/material";
import {DataGrid, GridColDef, GridToolbar, GridValueGetter} from '@mui/x-data-grid';
import { RootState, useAppDispatch } from "../../state/store.ts";
import { getLogsBetween } from "../../state/dashboard/thunk.ts";
import CustomAlert from "../support/CustomAlert.tsx";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "../support/LoadingIndicator.tsx";
import { CustomNoRowsOverlay } from "../support/CustomNoRowsOverlay.tsx";
import {Logs} from "../../state/dashboard/dashboardSlice.ts";

interface DetailsTableProps {
    startDate: string;
    endDate: string;
    setError: (msg: string) => void;
    setErrorOpen: (open: boolean) => void;
}

const DetailsTable: React.FC<DetailsTableProps> = ({ startDate, endDate, setError, setErrorOpen }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { logs, isLoading, error, totalElements } = useSelector(
        (state: RootState) => state.logs
    );

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(
                getLogsBetween({
                    startDate,
                    endDate,
                    page,
                    size: rowsPerPage,
                })
            )
                .unwrap()
                .catch((err) => {
                    setError(err || 'Failed to fetch logs');
                    setErrorOpen(true);
                });
        }
    }, [dispatch, startDate, endDate, page, rowsPerPage, setError, setErrorOpen]);

    const columns: GridColDef<Logs>[] = [
        {
            field: 'timestamp',
            headerName: t('dashboard.detailsTable.timestamp'),
            minWidth: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'endpoint',
            headerName: t('dashboard.detailsTable.endpoint'),
            minWidth: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'action',
            headerName: t('dashboard.detailsTable.action'),
            minWidth: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'user',
            headerName: t('dashboard.detailsTable.user'),
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueGetter: ((value, row) => {
                if (!row) return 'N/A';
                return row.user?.username || 'N/A';
            }) as GridValueGetter<Logs>,
        },
        {
            field: 'course',
            headerName: t('dashboard.detailsTable.course'),
            width: 300,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueGetter: ((value, row) => {
                if (!row) return 'N/A';
                return row.course?.name || 'N/A';
            }) as GridValueGetter<Logs>,
        },
        {
            field: 'ipAddress',
            headerName: t('dashboard.detailsTable.ip'),
            minWidth: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'userAgent',
            headerName: t('dashboard.detailsTable.userAgent'),
            minWidth: 500,

            align: 'center',
            headerAlign: 'center',
        },
    ];

    return (
        <div className="h-full px-7">
            <Typography variant="h5" className="pb-7">
                {t('dashboard.detailsTable.title')}
            </Typography>

            <LoadingIndicator open={isLoading} />
            <CustomAlert
                open={!!error.getLogsBetween}
                message={error.getLogsBetween || ""}
                severity="error"
                onClose={() => setErrorOpen(false)}
            />

            <Box sx={{ height: '700px', width: '100%', mt: 4 }}>
                <DataGrid
                    rows={logs}
                    columns={columns}
                    paginationMode="server"
                    rowCount={totalElements}
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setRowsPerPage(newModel.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    loading={isLoading}
                    slots={{
                        toolbar: GridToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    slotProps={{
                        pagination: {
                            showFirstButton: true,
                            showLastButton: true,
                        },
                    }}
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                        },
                        '--DataGrid-overlayHeight': '300px',
                    }}
                    disableRowSelectionOnClick

                />
            </Box>
        </div>
    );
};

export default DetailsTable;