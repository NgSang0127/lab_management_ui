import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { AssetResponse, fetchAssets } from '../../api/asset/assetApi.ts';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';

// Tùy chỉnh màu sắc của Paper (dropdown)
const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff8d6' : '#424242',
}));

interface AssetSelectProps {
    selectedAssetId: number | null;
    setSelectedAssetId: (id: number | null) => void;
}

const AssetSelect: React.FC<AssetSelectProps> = ({ selectedAssetId, setSelectedAssetId }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<AssetResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    // Quản lý trạng thái mở/đóng dropdown
    const [open, setOpen] = useState<boolean>(false);

    // Debounce fetchAssets để tránh gọi API quá nhiều lần
    const debouncedFetchAssets = useMemo(
        () =>
            debounce(async (query: string) => {
                if (query.length < 2) {
                    setOptions([]);
                    return;
                }
                try {
                    setLoading(true);
                    // Giả sử bạn muốn tìm kiếm assets với keyword query và status trống
                    const response = await fetchAssets(0, 20, query, '');
                    console.log('fetchAssets response:', response);

                    // Giả sử API trả về PageResponse<AssetResponse>
                    const filtered = response.content.filter(asset =>
                        asset.name.toLowerCase().includes(query.toLowerCase()) ||
                        asset.serialNumber.toLowerCase().includes(query.toLowerCase())
                    );
                    setOptions(filtered);
                    setError(null);

                } catch (err: any) {
                    setError(err.message || 'Failed to fetch assets.');
                } finally {
                    setLoading(false);
                }
            }, 500),
        []
    );

    // Gọi debouncedFetchAssets mỗi khi inputValue thay đổi
    useEffect(() => {
        if (inputValue.length < 2) {
            setOptions([]);
            return;
        }
        debouncedFetchAssets(inputValue);
        return () => {
            debouncedFetchAssets.cancel();
        };
    }, [inputValue, debouncedFetchAssets]);

    return (
        <Autocomplete
            id="asset-select"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => `${option.name} (${option.serialNumber})`}
            loading={loading}
            // Tìm asset trong options có ID trùng với selectedAssetId
            value={options.find(asset => asset.id === selectedAssetId) || null}
            onChange={(_event, newValue) => {
                setSelectedAssetId(newValue ? newValue.id : null);
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    // Chỉ fetch khi thực sự gõ, tránh gọi API khi Autocomplete set lại inputValue lúc chọn
                    setInputValue(newInputValue);
                }
            }}

            noOptionsText={
                inputValue.length < 2 ? 'Nhập ít nhất 2 ký tự để tìm kiếm' : 'Không tìm thấy tài sản'
            }
            PaperComponent={(props) => <StyledPaper {...props} />}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select Asset"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AssetSelect;
