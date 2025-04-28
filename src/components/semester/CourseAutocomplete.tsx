import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper, Chip } from '@mui/material';
import { fetchCourses, CourseRequest } from '../../services/course/courseApi.ts';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface CourseAutocompleteProps {
    selectedCourses: CourseRequest[];
    setSelectedCourses: (courses: CourseRequest[]) => void;
}

const CourseAutocomplete: React.FC<CourseAutocompleteProps> = ({ selectedCourses, setSelectedCourses }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<CourseRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<CourseRequest[]>(selectedCourses);

    const debouncedFetchCourses = useMemo(
        () =>
            debounce(async (query: string, pageNum: number, append: boolean) => {
                try {
                    setLoading(true);
                    const response = await fetchCourses(pageNum, 20, query);
                    const newOptions = response.content || [];
                    setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions));
                    setHasMore(!response.last);

                    if (selectedCourses.length > 0 && selectedOptions.length === 0) {
                        const matchedCourses = newOptions.filter((option) =>
                            selectedCourses.some((course) => course.id === option.id)
                        );
                        if (matchedCourses.length > 0) {
                            setSelectedOptions(matchedCourses);
                            setSelectedCourses(matchedCourses);
                        }
                    }
                } catch (err: any) {
                    console.error('Failed to fetch courses:', err);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [selectedCourses, selectedOptions]
    );

    useEffect(() => {
        if (!open) return;
        debouncedFetchCourses(inputValue, 0, false);
        setPage(0);
        return () => {
            debouncedFetchCourses.cancel();
        };
    }, [inputValue, open, debouncedFetchCourses]);

    useEffect(() => {
        setSelectedOptions(selectedCourses);
    }, [selectedCourses]);

    const handleScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10;
        if (isNearBottom && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            debouncedFetchCourses(inputValue, nextPage, true);
        }
    };

    return (
        <Autocomplete
            id="course-autocomplete"
            multiple
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => `${option.name || ''} - NH:${option?.nh || '?'} - TH:${option?.th || '?'}`}
            loading={loading}
            value={selectedOptions}
            onChange={(_event, newValue) => {
                setSelectedOptions(newValue);
                setSelectedCourses(newValue);
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setInputValue(newInputValue);
                }
            }}
            noOptionsText={inputValue.length < 2 ? 'Enter at least 2 characters' : 'No courses found'}
            PaperComponent={(props) => <StyledPaper {...props} />}
            slotProps={{listbox:{ onScroll: handleScroll }}}
            renderValue={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip label={option.name || ''} {...getTagProps({ index })} key={option.id || index} />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Courses"
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

export default CourseAutocomplete;