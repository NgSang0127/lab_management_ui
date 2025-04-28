import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { fetchSemesters } from '../../services/semester/semesterApi';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import {Semester} from "../../state/timetable/timetableSlice.ts";


const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface SemesterAutocompleteProps {
    selectedSemesterId: number | null;
    setSelectedSemesterId: (id: number | null) => void;
}

const SemesterAutocomplete: React.FC<SemesterAutocompleteProps> = ({ selectedSemesterId, setSelectedSemesterId }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<Semester[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

    const debouncedFetchSemesters = useMemo(
        () =>
            debounce(async (query: string, pageNum: number, append: boolean) => {
                try {
                    setLoading(true);
                    const response = await fetchSemesters(pageNum, 20);
                    const newOptions = response.content || [];
                    setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions));
                    setHasMore(!response.last);

                    if (selectedSemesterId && !selectedSemester) {
                        const matchedSemester = newOptions.find((semester) => semester.id === selectedSemesterId);
                        if (matchedSemester) {
                            setSelectedSemester(matchedSemester);
                            setInputValue(matchedSemester.name || '');
                        }
                    }
                } catch (err: any) {
                    console.error('Failed to fetch semesters:', err);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [selectedSemesterId, selectedSemester]
    );

    useEffect(() => {
        if (!open) return;
        debouncedFetchSemesters(inputValue, 0, false);
        setPage(0);
        return () => {
            debouncedFetchSemesters.cancel();
        };
    }, [inputValue, open, debouncedFetchSemesters]);

    const handleScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10;
        if (isNearBottom && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            debouncedFetchSemesters(inputValue, nextPage, true);
        }
    };

    return (
        <Autocomplete
            id="semester-autocomplete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => option.name || ''}
            loading={loading}
            value={selectedSemester}
            onChange={(_event, newValue) => {
                setSelectedSemester(newValue);
                setSelectedSemesterId(newValue ? newValue.id : null);
                setInputValue(newValue ? newValue.name || '' : '');
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setInputValue(newInputValue);
                }
            }}
            noOptionsText={inputValue.length < 2 ? 'Enter at least 2 characters' : 'No semesters found'}
            PaperComponent={(props) => <StyledPaper {...props} />}
            slotProps={{listbox:{ onScroll: handleScroll }}}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Semester"
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

export default SemesterAutocomplete;