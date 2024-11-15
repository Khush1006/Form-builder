import React from "react";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Controller } from "react-hook-form";
import { Icon } from "@iconify/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RHFChip from "./Chip";
import { questionType } from "@/components/utils/question";

const SectionAndQuestion = ({
  control,
  errors,
  watch,
  fields,
  append,
  remove,
  getValues,
  setValue,
  clearErrors,
  sectionOptions
}) => {
  // const colors = colorSchemes().light.palette;

  const addOption = (questionIndex) => {
    const currentOptions = getValues(`questions.${questionIndex}.options`);

    const newOption = {
      label: "",
      value: "",
      isDefault: false
    };

    // Using setValue to update the options array
    setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      newOption
    ]);
  };

  // Function to remove an option from a specific question
  const removeOption = (questionIndex, optionIndex) => {
    const currentOptions = getValues(`questions.${questionIndex}.options`);

    // Remove the option at the specified index
    const updatedOptions = currentOptions.filter(
      (_, idx) => idx !== optionIndex
    );

    // Using setValue to update the options array
    setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const addAttachment = (questionIndex) => {
    const currentAttachments =
      getValues(`questions.${questionIndex}.attachments`) || [];

    const newAttachment = {
      fileName: "",
      maxNumberOfFiles: "",
      acceptedFileTypes: "",
      maxFileSize: ""
    };

    setValue(`questions.${questionIndex}.attachments`, [
      ...currentAttachments,
      newAttachment
    ]);
  };

  // Function to remove an attachment
  const removeAttachment = (questionIndex, attachmentIndex) => {
    const currentAttachments = getValues(
      `questions.${questionIndex}.attachments`
    );

    const updatedAttachments = currentAttachments.filter(
      (_, idx) => idx !== attachmentIndex
    );

    setValue(`questions.${questionIndex}.attachments`, updatedAttachments);
  };

  console.log("watch()", watch());
  console.log("errors", errors);

  return (
    <Stack alignItems="center">
      <>
        {/* <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2, mt: 5 }}>
                    <Typography variant='h6' sx={{  textAlign: 'center' }}>
                        Questions
                    </Typography>
                </Stack> */}
                <Box sx={{ my: 3, maxWidth:700}} display='flex' flexDirection='column' justifyContent='center'>
            <Typography
              variant="subtitle1"
              sx={{
                // fontSize: "14px",
              }}
            >
              Sections
            </Typography>

            <Controller
                            name="sections"
                            control={control}
                            rules={{ required: 'This field is required.' }}
                            render={({ field }) => (
                                <Stack>

                                    <RHFChip
                                        {...field}
                                        chips={field?.value}
                                        onChipsChange={field.onChange}
                                        disabled={false}
                                        InputProps={{
                                            sx: {
                                                borderRadius: '20px',
                                            },
                                        }}
                                        error={errors?.sections ? true : false}
                                        helperText={errors?.sections?.message}
                                    />
                                </Stack>
                            )}
                        />
            {errors?.sections && (
              <Typography
                variant="caption"
                sx={{ color: "#d32f2f", fontSize: "12px", pt: -5 }}
              >
                {errors?.sections?.message}
              </Typography>
            )}
          </Box>
        <CardContent>

          <Stack
         rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
          >
            {fields?.map((field, index) => {
              const isDifferentLabelsChecked = watch(
                `questions.${index}.differentLabelsForPrePost`
              );
              const selectedQuestionType = watch(
                `questions.${index}.questionType`
              );
              const isHasContdition = watch(`questions.${index}.displayCondition.hasCondition`)

              return (
                <Card
                  sx={{ width: "600px", p: { xs: 3, md: 5 } }}
                  key={field.id}
                  display="grid"
                  gap={5}
                  gridtemplatecolumns={{
                    xs: "repeat(1, 1fr)",
                    md: "repeat(1, 1fr)"
                  }}
                >
                
            <Box textAlign="end">
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  append({
                    questionType: "",
                    isMandatory: false,
                    labelPre: "",
                    labelPost: "",
                    differentLabelsForPrePost: false,
                    instructions: "",
                    options: [
                      {
                        label: "",
                        value: "",
                        isDefault: false
                      }
                    ],
                    attachments: [
                      {
                        fileName: "",
                        maxNumberOfFiles: "",
                        acceptedFileTypes: "",
                        maxFileSize: ""
                      }
                    ],
                    displayCondition: {
                                        hasCondition: false,
                                        conditionOn: null,
                                        conditionOnValues: []
                                    },
                    sectionNumber: "",

                  })
                }
                sx={{my:2}}
                color="primary"
              >
               <Icon
                    icon="material-symbols-light:add"
                    width={23}
                    height={23}
                  />
              </Button>
            </Box>
                  <Controller
                    name={`questions.${index}.questionType`}
                    control={control}
                    rules={{ required: "This field is required." }}
                    render={({
                      field: { onChange, value, ...field },
                      fieldState: { error }
                    }) => (
                      <Autocomplete
                        size="small"
                        options={questionType}
                        value={value || null}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                          setValue(`questions.${index}.options`, [
                            {
                              label: "",
                              value: "",
                              isDefault: false
                            }
                          ]);
                          setValue(`questions.${index}.displayCondition.conditionOn`, index)
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="Question Type"
                            error={!!errors?.questions?.[index]?.questionType}
                            helperText={
                              errors?.questions?.[index]?.questionType?.message
                            }
                            fullWidth
                          />
                        )}
                      />
                    )}
                  />

                  <Stack sx={{ mt: 3 }}>
                    <Controller
                      name={`questions.${index}.differentLabelsForPrePost`}
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={Boolean(value)} // Ensure it is boolean
                              onChange={(e) => onChange(e.target.checked)} // Set the value as boolean
                            />
                          }
                          label="Do you want Different Label for pre and post"
                        />
                      )}
                    />
                  </Stack>

                  <Controller
                    name={`questions.${index}.labelPre`}
                    control={control}
                    rules={{ required: "This is a required field." }}
                    render={({ field }) => (
                      <TextField
                        sx={{ mt: 3 }}
                        size="small"
                        {...field}
                        fullWidth
                        label={"Label Pre"}
                        placeholder="Enter Name Label Pre"
                        error={!!errors?.questions?.[index]?.labelPre}
                        helperText={
                          errors?.questions?.[index]?.labelPre?.message
                        }
                      />
                    )}
                  />

                  {/* Conditionally render Label Post only if checkbox is checked */}
                  {isDifferentLabelsChecked && (
                    <Controller
                      name={`questions.${index}.labelPost`}
                      control={control}
                      rules={{
                        required: "This is a required field when checked."
                      }}
                      render={({ field }) => (
                        <TextField
                          size="small"
                          sx={{ mt: 3 }}
                          {...field}
                          fullWidth
                          label={"Label Post"}
                          placeholder="Enter Name Label Post"
                          error={!!errors?.questions?.[index]?.labelPost}
                          helperText={
                            errors?.questions?.[index]?.labelPost?.message
                          }
                        />
                      )}
                    />
                  )}

                  <Controller
                    name={`questions.${index}.instructions`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        sx={{ mt: 3 }}
                        {...field}
                        fullWidth
                        label={"Instructions"}
                        placeholder="Enter Instructions"
                      />
                    )}
                  />

                  {selectedQuestionType === "Select" && (
                    <Box sx={{ mt: 3 }}>
                      <RadioGroup name={`questions.${index}.options`}>
                        {watch(`questions.${index}.options`)?.map(
                          (option, optionIdx) => (
                            <Box
                              key={optionIdx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={option.isDefault}
                                    onClick={() => {
                                      const currentOptions = getValues(
                                        `questions.${index}.options`
                                      );
                                      const isCurrentlySelected =
                                        currentOptions[optionIdx].isDefault;

                                      {
                                        console.log(
                                          "isCurrentlySelected",
                                          isCurrentlySelected
                                        );
                                      }

                                      const updatedOptions = currentOptions.map(
                                        (opt, idx) => ({
                                          ...opt,

                                          // Toggle isDefault to false if the same radio button is clicked
                                          isDefault:
                                            idx === optionIdx
                                              ? !isCurrentlySelected
                                              : false
                                        })
                                      );

                                      setValue(
                                        `questions.${index}.options`,
                                        updatedOptions
                                      );
                                    }}
                                  />
                                }
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1
                                    }}
                                  >
                                    <TextField
                                      size="small"
                                      value={option.label}
                                      onChange={(e) => {
                                        const updatedOptions = getValues(
                                          `questions.${index}.options`
                                        );

                                        updatedOptions[optionIdx].label =
                                          e.target.value;
                                        updatedOptions[optionIdx].value =
                                          e.target.value; // Optionally set the value as well
                                        setValue(
                                          `questions.${index}.options`,
                                          updatedOptions
                                        );
                                      }}
                                      placeholder="Option Label"
                                    />
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        removeOption(index, optionIdx)
                                      }
                                    >
                                       <Icon
                            icon="mi:delete"
                            color="red"
                            width={18}
                            height={18}
                          />
                                    </IconButton>
                                  </Box>
                                }
                              />
                            </Box>
                          )
                        )}
                      </RadioGroup>

                      <Button
                        onClick={() => addOption(index)}
                        startIcon={<i className="tabler-plus" />}
                      >
                        Add Option
                      </Button>
                    </Box>
                  )}
                  {selectedQuestionType === "MultiSelect" && (
                    <Box sx={{ mt: 3 }}>
                      <FormGroup>
                        {watch(`questions.${index}.options`)?.map(
                          (option, optionIdx) => (
                            <Box
                              key={optionIdx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={option.isDefault}
                                    onChange={() => {
                                      const currentOptions = getValues(
                                        `questions.${index}.options`
                                      );

                                      // Toggle isDefault state for the checkbox
                                      const updatedOptions = currentOptions.map(
                                        (opt, idx) => ({
                                          ...opt,
                                          isDefault:
                                            idx === optionIdx
                                              ? !opt.isDefault
                                              : opt.isDefault
                                        })
                                      );

                                      setValue(
                                        `questions.${index}.options`,
                                        updatedOptions
                                      );
                                    }}
                                  />
                                }
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1
                                    }}
                                  >
                                    <TextField
                                      size="small"
                                      value={option.label}
                                      onChange={(e) => {
                                        const updatedOptions = getValues(
                                          `questions.${index}.options`
                                        );

                                        updatedOptions[optionIdx].label =
                                          e.target.value;
                                        updatedOptions[optionIdx].value =
                                          e.target.value; // Optionally set the value as well
                                        setValue(
                                          `questions.${index}.options`,
                                          updatedOptions
                                        );
                                      }}
                                      placeholder="Option Label"
                                    />
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        removeOption(index, optionIdx)
                                      }
                                    >
                                       <Icon
                            icon="mi:delete"
                            color="red"
                            width={18}
                            height={18}
                          />
                                    </IconButton>
                                  </Box>
                                }
                              />
                            </Box>
                          )
                        )}
                      </FormGroup>

                      <Button
                        startIcon={
                          <Icon
                            icon="material-symbols-light:add"
                            width={23}
                            height={23}
                          />
                        }
                        onClick={() => addOption(index)}
                      >
                        Add Option
                      </Button>
                    </Box>
                  )}


                  {(selectedQuestionType === 'MultiSelect' || selectedQuestionType === 'Select') &&
                                        <>
                                            <Controller
                                                name={`questions.${index}.displayCondition.hasCondition`}
                                                control={control}
                                                render={({ field: { onChange, value, ...field } }) => (
                                                    <FormControlLabel
                                                        sx={{ mt: 3 }}
                                                        control={
                                                            <Checkbox
                                                                {...field}
                                                                checked={Boolean(value)} // Ensure it is boolean
                                                                onChange={(e) => onChange(e.target.checked)} // Set the value as boolean
                                                            />
                                                        }
                                                        label="Has condition"
                                                    />
                                                )}
                                            />
                                            {isHasContdition &&
                                                <Box sx={{ mt: 3, ml: 6 }}>
                                                    <FormGroup>
                                                        {watch(`questions.${index}.options`)?.map((option, optionIdx) => {
                                                            // Check if the option exists in conditionOnValues
                                                            const isChecked = !!watch(`questions.${index}.displayCondition.conditionOnValues`)
                                                                ?.some((opt) => opt === option.value);

                                                            return (
                                                                <Box key={optionIdx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={isChecked}
                                                                                onChange={() => {
                                                                                    const currentOptions = getValues(
                                                                                        `questions.${index}.displayCondition.conditionOnValues`
                                                                                    ) || [];

                                                                                    // Toggle option in conditionOnValues
                                                                                    const updatedOptions = isChecked
                                                                                        ? currentOptions.filter((opt) => opt.label !== option.label)
                                                                                        : [...currentOptions, option?.value];

                                                                                    setValue(`questions.${index}.displayCondition.conditionOnValues`, updatedOptions);
                                                                                }}
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                {option.label}
                                                                            </Box>
                                                                        }
                                                                    />
                                                                </Box>
                                                            );
                                                        })}
                                                    </FormGroup>
                                                </Box>
                                            }
                                        </>

                                    }
                  {selectedQuestionType === "File" && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Attachments
                      </Typography>
    
                      {watch(`questions.${index}.attachments`)?.map(
                        (attachment, attachmentIdx) => (
                          <Stack
                            key={attachmentIdx}
                            rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
                          >
                            <Controller
                              name={`questions.${index}.attachments.${attachmentIdx}.fileName`}
                              control={control}
                              rules={{
                                required: "Accepted file types are required."
                              }}
                              render={({
                                field: { onChange, value },
                                fieldState: { error }
                              }) => (

                                <>
                                <TextField
                                  size="small"
                                //   {...field}
                                  fullWidth
                                  label="File Name"
                                  value={getValues(`questions.${index}.attachments.${attachmentIdx}.fileName`)}
                                  onChange={(e) => {
                                    const updatedAttachments = getValues(
                                      `questions.${index}.attachments`
                                    );

                                    updatedAttachments[attachmentIdx].fileName =
                                      e.target.value;
                                    setValue(
                                      `questions.${index}.attachments`,
                                      updatedAttachments
                                    );
                                    clearErrors(
                                      `questions.${index}.attachments.${attachmentIdx}.fileName`
                                    );
                                  }}
                                  placeholder="Enter File Name"
                                  error={!!error}
                                  helperText={error?.message}
                                />
                                {console.log('value',value)}
                                </>
                              )}
                            />
                            <Controller
                              name={`questions.${index}.attachments.${attachmentIdx}.maxNumberOfFiles`}
                              control={control}
                              rules={{
                                required: "Accepted file types are required."
                              }}
                              render={({
                                field: { onChange, value },
                                fieldState: { error }
                              }) => (
                                <TextField
                                  size="small"
                                //   {...field}
                                  type="number"
                                  fullWidth
                                  label="Max Number of Files"
                                  value={getValues(`questions.${index}.attachments.${attachmentIdx}.maxNumberOfFiles`)}
                                  onChange={(e) => {
                                    const updatedAttachments = getValues(
                                      `questions.${index}.attachments`
                                    );

                                    updatedAttachments[
                                      attachmentIdx
                                    ].maxNumberOfFiles = e.target.value;
                                    setValue(
                                      `questions.${index}.attachments`,
                                      updatedAttachments
                                    );
                                    clearErrors(
                                      `questions.${index}.attachments.${attachmentIdx}.maxNumberOfFiles`
                                    );
                                  }}
                                  placeholder="Max Number of Files"
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                            />

                            <Controller
                              name={`questions.${index}.attachments.${attachmentIdx}.acceptedFileTypes`}
                              control={control}
                              rules={{
                                required: "Accepted file types are required."
                              }}
                              render={({
                                field: { onChange, value },
                                fieldState: { error }
                              }) => (
                                <Autocomplete
                                  size="small"
                                  options={ [
            "image/jpeg",
            "image/png",
            "application/pdf"
          ]} // List of accepted file types
                                  value={value || null}
                                  onChange={(event, newValue) => {
                                    onChange(newValue);
                                    const updatedAttachments = getValues(
                                      `questions.${index}.attachments`
                                    );

                                    updatedAttachments[
                                      attachmentIdx
                                    ].acceptedFileTypes = newValue;
                                    setValue(
                                      `questions.${index}.attachments`,
                                      updatedAttachments
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="File Types"
                                      placeholder="Select file type"
                                      error={!!error}
                                      helperText={error?.message}
                                      fullWidth
                                    />
                                  )}
                                />
                              )}
                            />

                            <Controller
                              name={`questions.${index}.attachments.${attachmentIdx}.maxFileSize`}
                              control={control}
                              rules={{
                                required: "Accepted file types are required."
                              }}
                              render={({
                                field: { onChange, value },
                                fieldState: { error }
                              }) => (
                                <TextField
                                  size="small"
                                //   {...field}
                                  type="number"
                                  fullWidth
                                  label="Max File Size (MB)"
                                  value={getValues(`questions.${index}.attachments.${attachmentIdx}.maxFileSize`)}
                                  onChange={(e) => {
                                    const updatedAttachments = getValues(
                                      `questions.${index}.attachments`
                                    );

                                    updatedAttachments[
                                      attachmentIdx
                                    ].maxFileSize = e.target.value;
                                    setValue(
                                      `questions.${index}.attachments`,
                                      updatedAttachments
                                    );
                                    clearErrors(
                                      `questions.${index}.attachments.${attachmentIdx}.maxFileSize`
                                    );
                                  }}
                                  placeholder="Enter Max Size in MB"
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                            />
                            <IconButton
                              color="error"
                              onClick={() =>
                                removeAttachment(index, attachmentIdx)
                              }
                            >
                                <Icon
                            icon="mi:delete"
                            color="red"
                            width={18}
                            height={18}
                          />
                            </IconButton>
                          </Stack>
                        )
                      )}
                      <Button
                        onClick={() => addAttachment(index)}
                        startIcon={<i className="tabler-plus" />}
                      >
                        Add Attachment
                      </Button>
                    </Box>
                  )}

                  <Controller
                    name={`questions.${index}.sectionNumber`}
                    control={control}
                    rules={{ required: "This field is required." }}
                    render={({
                      field: { onChange, value, ...field },
                      fieldState: { error }
                    }) => (
                      <Autocomplete
                        size="small"
                        options={sectionOptions}
                        value={value || null}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField
                            sx={{ mt: 3 }}
                            {...params}
                            {...field}
                            label="Section Number"
                            error={!!errors?.questions?.[index]?.sectionNumber}
                            helperText={
                              errors?.questions?.[index]?.sectionNumber?.message
                            }
                            fullWidth
                          />
                        )}
                      />
                    )}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "space-between"
                    }}
                  >
                    {fields?.length > 1 && (
                      <Box height="100%" alignContent="end">
                        <IconButton
                          sx={{ width: "40px", height: "40px" }}
                          onClick={() => remove(index)}
                        >
                          <Icon
                            icon="mi:delete"
                            color="red"
                            width={18}
                            height={18}
                          />
                        </IconButton>
                      </Box>
                    )}
                    <Controller
                      name={`questions.${index}.isMandatory`}
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormControlLabel
                          sx={{ mt: 3 }}
                          control={
                            <Checkbox
                              {...field}
                              checked={Boolean(value)} // Ensure it is boolean
                              onChange={(e) => onChange(e.target.checked)} // Set the value as boolean
                            />
                          }
                          label="Required"
                        />
                      )}
                    />
                  </Box>
                </Card>
              );
            })}

          </Stack>
        </CardContent>
      </>
    </Stack>
  );
};

export default SectionAndQuestion;
