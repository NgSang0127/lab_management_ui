import React, {useState, useEffect, useMemo} from 'react';
import {Autocomplete, TextField, CircularProgress, Paper, InputAdornment} from '@mui/material';
import {useSelector} from 'react-redux';
import debounce from 'lodash.debounce';
import {RootState, useAppDispatch} from '../../state/store.ts';
import {getUsers} from '../../state/admin/thunk.ts';
import {User} from '../../state/auth/authSlice.ts';
import {styled} from '@mui/material/styles';
import {unwrapResult} from "@reduxjs/toolkit";

const StyledPaper = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
}));

interface UserSelectProps {
    assignedUserId: number | null;
    setAssignedUserId: (id: number | null) => void;
}const UserSelect: React.FC<UserSelectProps> = ({ assignedUserId, setAssignedUserId }) => {
    const dispatch = useAppDispatch();
    const { isLoading } = useSelector((state: RootState) => state.admin);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMoreUsers, setHasMoreUsers] = useState<boolean>(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async (searchKeyword: string = '', pageNum: number = 0, append: boolean = false) => {
        try {
            const size = 20;
            const response = await dispatch(
                getUsers({
                    page: pageNum,
                    size,
                    keyword: searchKeyword,
                    role: '',
                })
            );
            const result = unwrapResult(response);
            const newUsers = Array.isArray(result.content) ? result.content : [];
            const uniqueUsers = Array.from(
                new Map([...(append ? filteredUsers : []), ...newUsers].map(u => [u.id, u])).values()
            );
            setFilteredUsers(uniqueUsers);
            setHasMoreUsers(result.totalElements > uniqueUsers.length);

            if (assignedUserId && !selectedUser) {
                const matchedUser = uniqueUsers.find(user => user.id === assignedUserId);
                if (matchedUser) {
                    setSelectedUser(matchedUser);
                    setInputValue(matchedUser.username || '');
                }
            }
        } catch (err: any) {
            console.error(err.message || 'Failed to fetch users.');
        }
    };

    const debouncedFetchUsers = useMemo(
        () => debounce((keyword: string) => {
            setPage(0);
            fetchUsers(keyword, 0, false);
        }, 300),
        []
    );

    useEffect(() => {
        if (open) {
            fetchUsers('', 0, false);
        }
        return () => {
            debouncedFetchUsers.cancel();
        };
    }, [open]);

    useEffect(() => {
        if (inputValue) {
            debouncedFetchUsers(inputValue);
        } else if (open) {
            fetchUsers('', 0, false);
        }
    }, [inputValue, open]);

    const handleUserLoadMore = () => {
        if (hasMoreUsers && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchUsers(inputValue, nextPage, true);
        }
    };

    const handleInputChange = (_event: any, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    const handleChange = (_event: any, newValue: User | null) => {
        setSelectedUser(newValue);
        setAssignedUserId(newValue ? newValue.id : null);
        setInputValue(newValue ? newValue.username || '' : '');
    };

    return (
        <Autocomplete
            id="assigned-user-select"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionLabel={(option) => option.username || ''}
            getOptionKey={(option) => option.id}
            filterOptions={(x) => x}
            options={filteredUsers}
            loading={isLoading}
            value={selectedUser}
            onChange={handleChange}
            onInputChange={handleInputChange}
            noOptionsText={inputValue.length < 1 && !filteredUsers.length ? 'Type to search users' : 'No users found'}
            clearOnBlur
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Assigned User"
                    variant="outlined"
                    fullWidth
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isLoading && <CircularProgress color="inherit" size={20} />}
                                    {params.InputProps.endAdornment}
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            )}
            slotProps={{
                paper: {
                    sx: { backgroundColor: (theme) => theme.palette.background.paper },
                },
                listbox: {
                    onScroll: (event: React.UIEvent) => {
                        const listboxNode = event.currentTarget;
                        const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1;
                        if (isNearBottom && hasMoreUsers && !isLoading) {
                            handleUserLoadMore();
                        }
                    },
                    style: { maxHeight: '300px', overflow: 'auto' },
                },
            }}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.username || ''}
                </li>
            )}
        />
    );
};
export default UserSelect;