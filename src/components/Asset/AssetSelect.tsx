import React, {useState, useEffect, useMemo} from 'react';
import {Autocomplete, TextField, CircularProgress, Paper} from '@mui/material';
import {AssetResponse, fetchAssets} from '../../api/asset/assetApi.ts';
import debounce from 'lodash.debounce';
import {styled} from '@mui/material/styles';
import {useTranslation} from "react-i18next";

const StyledPaper = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff8d6' : '#424242',
}));

interface AssetSelectProps {
    selectedAssetId: number | null;
    setSelectedAssetId: (id: number | null) => void;
}

const AssetSelect: React.FC<AssetSelectProps> = ({selectedAssetId, setSelectedAssetId}) => {
    const {t} = useTranslation();
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<AssetResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false);

    const debouncedFetchAssets = useMemo(
        () =>
            debounce(async (query: string) => {
                if (query.length < 2) {
                    setOptions([]);
                    return;
                }
                try {
                    setLoading(true);
                    const response = await fetchAssets(0, 20, query, '');
                    console.log('fetchAssets response:', response);

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

            value={options.find(asset => asset.id === selectedAssetId) || null}
            onChange={(_event, newValue) => {
                setSelectedAssetId(newValue ? newValue.id : null);
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setInputValue(newInputValue);
                }
            }}

            noOptionsText={
                inputValue.length < 2 ? t('manager_asset.asset_select.inputValue') : t('manager_asset.asset_select.defaultValue')
            }
            PaperComponent={(props) => <StyledPaper {...props} />}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('manager_asset.asset_select.label')}
                    variant="outlined"
                    fullWidth
                    slotProps={{
                        ...params.InputProps,
                        input: {
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }
                    }}
                />
            )}
        />
    );
};

export default AssetSelect;
