import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { getUsers } from '../../state/admin/thunk.ts';
import { useAppDispatch } from '../../state/store.ts';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import { User } from '../../state/auth/authSlice.ts';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface InstructorAutocompleteProps {
    selectedInstructorId: number | null;
    setSelectedInstructorId: (id: number | null) => void;
}

const InstructorAutocomplete: React.FC<InstructorAutocompleteProps> = ({ selectedInstructorId, setSelectedInstructorId }) => {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedInstructor, setSelectedInstructor] = useState<User | null>(null);

    const fetchInstructors = async (query: string, pageNum: number, append: boolean) => {
        try {
            setLoading(true);
            const response = await dispatch(
                getUsers({
                    page: pageNum,
                    size: 20,
                    keyword: query,
                    role: 'TEACHER',
                })
            ).unwrap();
            const newOptions = response.content || [];
            setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions));
            setHasMore(!response.last);

            if (selectedInstructorId && !selectedInstructor) {
                const matchedInstructor = newOptions.find((instructor) => instructor.id === selectedInstructorId);
                if (matchedInstructor) {
                    setSelectedInstructor(matchedInstructor);
                    setInputValue(`${matchedInstructor.fullName} - ${matchedInstructor.username}`);
                }
            }
        } catch (err: any) {
            console.error('Failed to fetch instructors:', err);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchInstructors = useMemo(
        () => debounce((query: string, pageNum: number, append: boolean) => fetchInstructors(query, pageNum, append), 500),
        [selectedInstructorId, selectedInstructor, dispatch]
    );

    useEffect(() => {
        if (selectedInstructorId) {
            fetchInstructors('', 0, false);
        }
    }, [selectedInstructorId]);

    useEffect(() => {
        if (open) {
            debouncedFetchInstructors(inputValue, 0, false);
            setPage(0);
        }
        return () => {
            debouncedFetchInstructors.cancel();
        };
    }, [inputValue, open, debouncedFetchInstructors]);

    const handleScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10;
        if (isNearBottom && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            debouncedFetchInstructors(inputValue, nextPage, true);
        }
    };

    return (
        <Autocomplete
            id="instructor-autocomplete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => `${option.fullName} - ${option.username}`}
            loading={loading}
            value={selectedInstructor}
            onChange={(_event, newValue) => {
                setSelectedInstructor(newValue);
                setSelectedInstructorId(newValue ? newValue.id : null);
                setInputValue(newValue ? `${newValue.fullName} - ${newValue.username}` : '');
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setInputValue(newInputValue);
                }
            }}
            noOptionsText={inputValue.length < 2 ? 'Enter at least 2 characters' : 'No instructors found'}
            PaperComponent={(props) => <StyledPaper {...props} />}
            slotProps={{listbox:{ onScroll: handleScroll }}}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Instructor"
                    variant="outlined"
                    fullWidth
                    required
                    slotProps={{
                        input: {
                            ...params.InputProps,
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

export default InstructorAutocomplete;