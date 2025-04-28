import React, {useState, useEffect, useMemo} from 'react';
import {Autocomplete, TextField, CircularProgress, Paper} from '@mui/material';
import {fetchActiveSemester} from '../../services/semester/semesterApi';
import debounce from 'lodash.debounce';
import {styled} from '@mui/material/styles';
import {Semester} from "../../state/timetable/timetableSlice.ts";


const StyledPaper = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface SemesterAutocompleteProps {
    selectedSemesterId: number | null;
    setSelectedSemesterId: (id: number | null) => void;
}

const SemesterActiveAutocomplete: React.FC<SemesterAutocompleteProps> = ({
                                                                             selectedSemesterId,
                                                                             setSelectedSemesterId
                                                                         }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<Semester[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

    const fetchSemesters = async (query: string) => {
        try {
            setLoading(true);
            const response = await fetchActiveSemester();
            const semesters = Array.isArray(response) ? response : [response].filter(Boolean);
            const filtered = semesters.filter((semester) =>
                semester.name.toLowerCase().includes(query.toLowerCase())
            );
            setOptions(filtered);

            if (selectedSemesterId) {
                const matchedSemester = filtered.find((semester) => semester.id === selectedSemesterId);
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
    };

    const debouncedFetchSemesters = useMemo(
        () => debounce((query: string) => fetchSemesters(query), 500),
        [selectedSemesterId]
    );

    useEffect(() => {
        if (selectedSemesterId) {
            fetchSemesters('');
        }
    }, [selectedSemesterId]);

    useEffect(() => {
        if (open) {
            debouncedFetchSemesters(inputValue);
        }
        return () => {
            debouncedFetchSemesters.cancel();
        };
    }, [inputValue, open, debouncedFetchSemesters]);

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

export default SemesterActiveAutocomplete;