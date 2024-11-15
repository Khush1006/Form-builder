import React, { useState } from 'react';

import { TextField, Chip, Box } from '@mui/material';


const RHFChip = ({
    chips = [],
    onChipsChange = () => { },
    placeholder = '',
    inputHeight = '32px',
    helperText = '',
    error = false

}) => {
    const [inputValue, setInputValue] = useState('');

    const normalizedChips = typeof chips === 'string' ? [chips] : chips;

    const handleAddChip = (event) => {
        if ((event.key === 'Enter' || event.key === 'Tab') && inputValue.trim()) {
            event.preventDefault(); // Prevent default Enter or Tab behavior
            // Check if the chip already exists in the array
            if (!chips.includes(inputValue.trim())) {
                const newChips = [...chips, inputValue.trim()];
                
                console.log(newChips,'ch')
                onChipsChange(newChips); // Update the form value via Controller
            }

            setInputValue(''); // Clear the input after attempting to add a chip
        }
    };

    const handleDeleteChip = (chipToDelete) => {
        const newChips = chips?.filter((chip) => chip !== chipToDelete);

        onChipsChange(newChips); // This updates the form value via Controller
    };

    console.log('error', error)

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: '4px',
                border: `1px solid ${error ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'}`,
                borderRadius: '7px',
                '&:focus-within': {
                    borderColor: error ? 'error' : 'blue',
                    border: `2px solid 'blue'`,
                },
                minHeight: inputHeight, // Set the minimum height of the container
            }}
        >
            {normalizedChips?.map((chip, index) => (
                <Chip
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteChip(chip)}
                    sx={{ margin: '4px' }}
                    size='small'
                />
            ))}
            <TextField
                variant="standard"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddChip}
                placeholder={placeholder}
                sx={{ flexGrow: 1 , textUnderlineOffset:'none'}}
                error={error}

            />
        </Box>
    );
};

export default RHFChip;
