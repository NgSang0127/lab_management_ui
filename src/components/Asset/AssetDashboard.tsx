import React, { useEffect, useState } from 'react';
import {
    Tabs,
    Tab,
    Box,
} from '@mui/material';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const AssetDashboard: React.FC = () => {
    const {t}=useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    // Xác định tab hiện tại dựa trên đường dẫn
    useEffect(() => {
        if (location.pathname.endsWith('/asset')) {
            setValue(0);
        } else if (location.pathname.endsWith('/location')) {
            setValue(1);
        } else if (location.pathname.endsWith('/category')) {
            setValue(2);
        }else if (location.pathname.endsWith('/manager')) {
                setValue(3);
        }else if (location.pathname.endsWith('/maintenance')) {
            setValue(4);
        }else if (location.pathname.endsWith('/import-export')) {
            setValue(5);
        } else {
            // Mặc định chọn tab đầu tiên
            setValue(0);
            navigate('asset', { replace: true });
        }
    }, [location.pathname, navigate]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        switch(newValue) {
            case 0:
                navigate('asset');
                break;
            case 1:
                navigate('location');
                break;
            case 2:
                navigate('category');
                break;
            case 3:
                navigate('manager');
                break;
            case 4:
                navigate('maintenance');
                break;
            case 5:
                navigate('import-export');
                break;
            default:
                navigate('asset');
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="Asset Management Tabs"
                >
                    <Tab label={t('manager_asset.asset.title')} />
                    <Tab label={t('manager_asset.location')} />
                    <Tab label={t('manager_asset.category.title')} />
                    <Tab label={t('manager_asset.manager')} />
                    <Tab label={t('manager_asset.maintenance')} />manager_
                    <Tab label={t('manager_asset.import_export')} />
                </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AssetDashboard;
