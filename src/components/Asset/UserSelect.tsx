import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { getUsers } from "../../state/Admin/Reducer.ts";
import { User } from "../../state/Authentication/Action.ts";
import { styled } from '@mui/material/styles';

// Tùy chỉnh màu sắc của Paper (dropdown)
const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff8d6' : '#424242',
}));

interface UserSelectProps {
    assignedUserId: number | null;
    setAssignedUserId: (id: number | null) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ assignedUserId, setAssignedUserId }) => {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useSelector((state: RootState) => state.admin);

    console.log("user",user);
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<User[]>([]);
    const [open, setOpen] = useState<boolean>(false);

    // Debounce fetchUsers to avoid excessive API calls
    const debouncedFetchUsers = useMemo(
        () =>
            debounce((query: string) => {
                if (query.length < 2) return;
                dispatch(getUsers({ page: 0, size: 20, keyword: query, role: '' }));
            }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (inputValue) {
            debouncedFetchUsers(inputValue);
        } else {
            setOptions([]);
        }
        // Cleanup debounce on unmount
        return () => {
            debouncedFetchUsers.cancel();
        };
    }, [inputValue, debouncedFetchUsers]);

    useEffect(() => {
        if (user.length > 0) {
            setOptions(user);
        }
    }, [user]);

    const handleInputChange = (_event: any, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    const handleChange = (_event: any, newValue: User | null) => {
        setAssignedUserId(newValue ? newValue.id : null);
    };

    return (
        <Autocomplete
            id="assigned-user-select"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.username})`}
            options={options}
            loading={isLoading}
            value={options.find(user => user.id === assignedUserId) || null}
            onChange={handleChange}
            onInputChange={handleInputChange}
            noOptionsText={inputValue.length < 2 ? 'Enter at least two characters' : 'Not found user'}
            PaperComponent={(props) => <StyledPaper {...props} />}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Assigned User"
                    variant="outlined"
                    fullWidth
                    slotProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default UserSelect;
