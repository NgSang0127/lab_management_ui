import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { AssetResponse, fetchAssets } from '../../services/asset/assetApi.ts';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface AssetSelectProps {
    selectedAssetId: number | null;
    setSelectedAssetId: (id: number | null) => void;
}

const AssetSelect: React.FC<AssetSelectProps> = ({ selectedAssetId, setSelectedAssetId }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<AssetResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [isUserTyping, setIsUserTyping] = useState<boolean>(false);

    // Tìm selected asset từ options
    const selectedAsset = useMemo(() => {
        return options.find(asset => asset.id === selectedAssetId) || null;
    }, [options, selectedAssetId]);

    // Đồng bộ inputValue với giá trị đã chọn
    useEffect(() => {
        if (selectedAsset && !isUserTyping) {
            setInputValue(`${selectedAsset.name} (${selectedAsset.status})`);
        } else if (!selectedAsset && !isUserTyping) {
            setInputValue('');
        }
    }, [selectedAsset, isUserTyping]);

    const debouncedFetchAssets = useMemo(
        () =>
            debounce(async (query: string) => {
                if (query.length < 2) {
                    setOptions([]);
                    return;
                }
                try {
                    setLoading(true);
                    setError(null);
                    // @ts-ignore
                    const response = await fetchAssets(0, 20, query, '');
                    console.log('fetchAssets response:', response);

                    const filtered = response.content.filter(asset =>
                        asset.name.toLowerCase().includes(query.toLowerCase()) ||
                        asset.serialNumber.toLowerCase().includes(query.toLowerCase())
                    );
                    setOptions(filtered);
                } catch (err: any) {
                    console.error('Error fetching assets:', err);
                    setError(err.message || 'Failed to fetch assets.');
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        []
    );

    // Chỉ gọi API khi user đang typing
    useEffect(() => {
        if (!isUserTyping) return;

        if (inputValue.length < 2) {
            setOptions([]);
            return;
        }

        debouncedFetchAssets(inputValue);

        return () => {
            debouncedFetchAssets.cancel();
        };
    }, [inputValue, isUserTyping, debouncedFetchAssets]);

    useEffect(() => {
        return () => {
            debouncedFetchAssets.cancel();
        };
    }, [debouncedFetchAssets]);

    return (
        <Autocomplete
            id="asset-select"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => `${option.name} (${option.serialNumber})`}
            loading={loading}
            value={selectedAsset}
            onChange={(_event, newValue) => {
                setSelectedAssetId(newValue ? newValue.id : null);
                setIsUserTyping(false); // Reset typing flag khi chọn
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setIsUserTyping(true);
                    setInputValue(newInputValue);
                } else if (reason === 'reset') {
                    setIsUserTyping(false);
                } else if (reason === 'clear') {
                    setIsUserTyping(false);
                    setInputValue('');
                }
            }}
            noOptionsText={
                inputValue.length < 2
                    ? t('manager_asset.asset_select.inputValue')
                    : loading
                        ? 'Loading...'
                        : t('manager_asset.asset_select.defaultValue')
            }
            PaperComponent={(props) => <StyledPaper {...props} />}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('manager_asset.asset_select.label')}
                    variant="outlined"
                    fullWidth
                    error={!!error}
                    helperText={error}
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