import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TextField, Chip, Box } from '@mui/material';

const RHFChip = ({
  chips = [],
  onChipsChange = () => {},
  placeholder = '',
  inputHeight = '32px',
  helperText = '',
  error = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const normalizedChips = typeof chips === 'string' ? [chips] : chips;

  const handleAddChip = (event) => {
    if ((event.key === 'Enter' || event.key === 'Tab') && inputValue.trim()) {
      event.preventDefault(); // Prevent default Enter or Tab behavior
      // Check if the chip already exists in the array
      if (!chips.includes(inputValue.trim())) {
        const newChips = [...chips, inputValue.trim()];
        onChipsChange(newChips); // Update the form value via Controller
      }
      setInputValue(''); // Clear the input after attempting to add a chip
    }
  };

  const handleDeleteChip = (chipToDelete) => {
    const newChips = chips?.filter((chip) => chip !== chipToDelete);
    onChipsChange(newChips); // This updates the form value via Controller
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // Ignore if dropped outside a droppable area

    const reorderedChips = Array.from(chips);
    const [movedChip] = reorderedChips.splice(result.source.index, 1);
    reorderedChips.splice(result.destination.index, 0, movedChip);

    onChipsChange(reorderedChips);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="chips-container"
        direction="horizontal"
        isDropDisabled={false} // Ensure this prop is a boolean
        isCombineEnabled={false} // Explicitly set to false or remove it if not needed
        ignoreContainerClipping={false} // Set to boolean value (false or true)
      >
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
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
              <Draggable key={chip} draggableId={chip} index={index}>
                {(provided) => (
                  <Chip
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    label={chip}
                    onDelete={() => handleDeleteChip(chip)}
                    sx={{ margin: '4px' }}
                    size="small"
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <TextField
              variant="standard"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddChip}
              placeholder={placeholder}
              sx={{ flexGrow: 1 }}
              error={error}
            />
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default RHFChip;
