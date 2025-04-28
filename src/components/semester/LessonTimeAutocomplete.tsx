import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { fetchLessonTimes } from '../../state/lessonTime/thunk.ts';
import { useAppDispatch } from '../../state/store.ts';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import { LessonTime } from '../../state/lessonTime/lessonTimeSlice.ts';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface LessonTimeAutocompleteProps {
    selectedLessonTimeId: number | null;
    setSelectedLessonTimeId: (id: number | null) => void;
    label: string;
}

const LessonTimeAutocomplete: React.FC<LessonTimeAutocompleteProps> = ({ selectedLessonTimeId, setSelectedLessonTimeId, label }) => {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<LessonTime[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedLessonTime, setSelectedLessonTime] = useState<LessonTime | null>(null);

    const debouncedFetchLessonTimes = useMemo(
        () =>
            debounce(async (query: string, pageNum: number, append: boolean) => {
                try {
                    setLoading(true);
                    const response = await dispatch(fetchLessonTimes()).unwrap();
                    const newOptions = response || [];
                    setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions));
                    setHasMore(false); // API không hỗ trợ phân trang, đặt hasMore thành false

                    if (selectedLessonTimeId && !selectedLessonTime) {
                        const matchedLessonTime = newOptions.find((lt) => lt.id === selectedLessonTimeId);
                        if (matchedLessonTime) {
                            setSelectedLessonTime(matchedLessonTime);
                            setInputValue(`${matchedLessonTime.lessonNumber} (${matchedLessonTime.startTime} - ${matchedLessonTime.endTime})`);
                        }
                    }
                } catch (err: any) {
                    console.error('Failed to fetch lesson times:', err);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [selectedLessonTimeId, selectedLessonTime, dispatch]
    );

    useEffect(() => {
        if (!open) return;
        debouncedFetchLessonTimes(inputValue, 0, false);
        setPage(0);
        return () => {
            debouncedFetchLessonTimes.cancel();
        };
    }, [inputValue, open, debouncedFetchLessonTimes]);

    const handleScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10;
        if (isNearBottom && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            debouncedFetchLessonTimes(inputValue, nextPage, true);
        }
    };

    return (
        <Autocomplete
            id={`lesson-time-autocomplete-${label}`}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => `${option.lessonNumber} (${option.startTime} - ${option.endTime})` || ''}
            loading={loading}
            value={selectedLessonTime}
            onChange={(_event, newValue) => {
                setSelectedLessonTime(newValue);
                setSelectedLessonTimeId(newValue ? newValue.id : null);
                setInputValue(newValue ? `${newValue.lessonNumber} (${newValue.startTime} - ${newValue.endTime})` : '');
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setInputValue(newInputValue);
                }
            }}
            noOptionsText={inputValue.length < 2 ? 'Enter at least 2 characters' : 'No lesson times found'}
            PaperComponent={(props) => <StyledPaper {...props} />}
            slotProps={{listbox:{ onScroll: handleScroll }}}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
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

export default LessonTimeAutocomplete;