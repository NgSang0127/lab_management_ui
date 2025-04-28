import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { fetchRooms, RoomResponse } from '../../services/asset/roomApi.ts';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#424242',
}));

interface RoomAutocompleteProps {
    selectedRoomId: number | null;
    setSelectedRoomId: (id: number | null) => void;
}

const RoomAutocomplete: React.FC<RoomAutocompleteProps> = ({ selectedRoomId, setSelectedRoomId }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<RoomResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);

    const debouncedFetchRooms = useMemo(
        () =>
            debounce(async (query: string, pageNum: number, append: boolean) => {
                try {
                    setLoading(true);
                    const response = await fetchRooms(pageNum, 20);
                    const newOptions = response.content || [];
                    setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions));
                    setHasMore(!response.last);

                    if (selectedRoomId && !selectedRoom) {
                        const matchedRoom = newOptions.find((room) => room.id === selectedRoomId);
                        if (matchedRoom) {
                            setSelectedRoom(matchedRoom);
                            setInputValue(matchedRoom.name || '');
                        }
                    }
                } catch (err: any) {
                    console.error('Failed to fetch rooms:', err);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [selectedRoomId, selectedRoom]
    );

    useEffect(() => {
        if (!open) return;
        debouncedFetchRooms(inputValue, 0, false);
        setPage(0);
        return () => {
            debouncedFetchRooms.cancel();
        };
    }, [inputValue, open, debouncedFetchRooms]);

    const handleScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10;
        if (isNearBottom && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            debouncedFetchRooms(inputValue, nextPage, true);
        }
    };

    return (
        <Autocomplete
            id="room-autocomplete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => option.name || ''}
            loading={loading}
            value={selectedRoom}
            onChange={(_event, newValue) => {
                setSelectedRoom(newValue);
                setSelectedRoomId(newValue ? newValue.id : null);
                setInputValue(newValue ? newValue.name || '' : '');
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                    setInputValue(newInputValue);
                }
            }}
            noOptionsText={inputValue.length < 2 ? 'Enter at least 2 characters' : 'No rooms found'}
            PaperComponent={(props) => <StyledPaper {...props} />}
            slotProps={{listbox:{ onScroll: handleScroll }}}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Room"
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

export default RoomAutocomplete;