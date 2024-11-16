'use client'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Autocomplete, Box, Button, Container,  Stack, TextField, Typography } from '@mui/material'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import toast from 'react-hot-toast'
import SectionAndQuestion from './component/SectionAndQuestions'
import { branch, department, designation, grade, role } from '../utils/adminData'
import axios from 'axios'


const DeclarationForm = () => {
    const router=useRouter()
    const searchParams = useSearchParams()
    const edit_id = searchParams.get('id')
const token=searchParams.get('token')
    const [sectionOptions, setSectionOptions] = useState([])

    // Hooks
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        getValues,
        clearErrors
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            department: [],
            designation: [],
            role: [],
            branch: [],
            grade: [],
            gender: [],
            age: {
                from: '',
                to: '',
            },
            sections: [],
            questions: [{
                questionType: '',
                isMandatory: false,
                labelPre: '',
                labelPost: '',
                differentLabelsForPrePost: false,
                instructions: '',
                options: [{
                    label: '',
                    value: '',
                    isDefault: false,
                },],
                attachments: [
                    {
                        fileName: '',
                        maxNumberOfFiles: '',
                        acceptedFileTypes: '',
                        maxFileSize: ''
                    }
                ],
                sectionNumber: '',
            }]
        }
    })

    const fromValue = watch('from')

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: 'questions',
    });

    const ques = watch('questions')

    const values = watch()

    console.log('values', values)

    const onSubmit = async (data) => {

        const transformedQuestions = ques?.map((question) => {
            const { attachments, questionType, options, ...rest } = question;
console.log(question,'question')
            return {
                ...rest,
                questionType:questionType,
                sectionNumber: question?.sectionNumber?.value || '', // Assign sectionNumber value or keep it as empty

                ...(questionType === "File" ? { attachments } : {}),

                ...(questionType === "Select" || questionType === "MultiSelect"
                    ?
                     { options }
                    : {}),
            };
        });

        const payload = {
            ...data,
            questions: transformedQuestions
        }

        try {
            const response = await axios.post("http://52.66.121.156:4087/api/declaration-form/template/save", payload,{headers:{
                Authorization:'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzAzYWU5NzkzMzRjOTVjZjgzNDJhYWUiLCJpYXQiOjE3MzE2NDk1MDEsImV4cCI6MTczMTczNTkwMX0.kvw4xhPhIt_Ep54qga_ZvF6e723vzFhLtTusxy9eSAc'
            }}); 
            console.log("Response:", response.data);
            reset(); // Reset the form on success
            router.push('/')
            toast.success('form submitted')
          } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
          }


    }


    const sectionValue = watch('sections');

    useEffect(() => {
        if (sectionValue && sectionValue.length > 0) {
            fields.forEach((field, index) => {
                const sectionNumberValue = getValues(`questions.${index}.sectionNumber`);

                // Check if the current `sectionNumber` field is empty
                if (!sectionNumberValue?.value && !sectionNumberValue?.label) {
                    setValue(`questions.${index}.sectionNumber`, {
                        label: sectionValue[0],
                        value: 1
                    });
                }
            });

            const data = sectionValue.map((item, index) => ({
                label: item,
                value: index + 1
            }));

            setSectionOptions(data);
        }
    }, [sectionValue, fields, setValue, getValues]);

    const fetchDeclarationById = async () => {
        const response = await dispatch(getDeclarationByIdAsync(edit_id));

        if (response.payload.success === true) {
            const settings = response?.payload?.data;


            reset(settings)

            const transformedQuestions = response?.payload?.data?.questions?.map((question) => {

                const { attachments, questionType, options, ...rest } = question;

                const sectonValue = {
                    label: response?.payload?.data?.sections[1],
                    value: question?.sectionNumber
                }

                return {
                    ...rest,
                    sectionNumber: sectonValue || '', // Assign sectionNumber value or keep it as empty

                    // ...(questionType === "File" ? { attachments } : {}),

                    ...(questionType === "Select" || questionType === "MultiSelect"
                        ? { options }
                        : { options: [] }),
                };
            });

            setValue("questions", transformedQuestions)
        }
    }

    useEffect(() => {
        if (edit_id) {
            fetchDeclarationById();
        }
    }, [edit_id]);


    return (
        <Box width='100%' height='100%'>
        <Container maxWidth='lg'>
        <Box>
            <Typography variant='h5' textAlign='center' py={3}>
            Form Builder    
            </Typography>
        </Box>

              { token ?      <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack
                            sx={{ gap: 5 }}
                            display='grid'
                            rowGap={2}
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(3, 1fr)'
                            }}
                        >
                            <Controller
                                name='name'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                    size='small'
                                        {...field}
                                        fullWidth
                                        label='Name'
                                        {...(errors.name && { error: true, helperText: 'This field is required.' })}
                                    />
                                )}
                            />
                            <Controller
                                name='description'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                    size='small'
                                        {...field}
                                        fullWidth
                                        label='Description'
                                        {...(errors.description && { error: true, helperText: 'This field is required.' })}
                                    />
                                )}
                            />
                            <Controller
                                name='department'
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                                    <Autocomplete
                                        // options={departmentsOptions || []}
                                        options={department}
                                        value={value || null}
                                        multiple
                                        size='small'
                                        onChange={(event, newValue) => {
                                            setValue('department', newValue, { shouldValidate: true })
                                        }}
                                        renderInput={params => (
                                            <TextField
                                            size='small'
                                                {...params}
                                                {...field}
                                                label='Department'
                                                error={!!errors.department}
                                                helperText={errors.department?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            <Controller
                                name='designation'
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                                    <Autocomplete
                                        // options={designationsOptions}
                                        options={designation}
                                        size='small'
                                        value={value || null}
                                        multiple
                                        onChange={(event, newValue) => {
                                            setValue('designation', newValue, { shouldValidate: true })
                                        }}
                                        renderInput={params => (
                                            <TextField
                                            size='small'
                                                {...params}
                                                {...field}
                                                label='Designation'
                                                error={!!errors.designation}
                                                helperText={errors.designation?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            <Controller
                                name='role'
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                                    <Autocomplete
                                        size='small'
                                        options={role}
                                        value={value || null}
                                        multiple
                                        onChange={(event, newValue) => {
                                            setValue('role', newValue, { shouldValidate: true })
                                        }}
                                        renderInput={params => (
                                            <TextField
                                            size='small'
                                                {...params}
                                                {...field}
                                                label='Role'
                                                error={!!errors.role}
                                                helperText={errors.role?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            <Controller
                                name='branch'
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                                    <Autocomplete
                                        // options={branchOptions}
                                        options={branch}
                                        size='small'
                                        value={value || null}
                                        multiple
                                        onChange={(event, newValue) => {
                                            setValue('branch', newValue, { shouldValidate: true })
                                        }}
                                        renderInput={params => (
                                            <TextField
                                            size='small'
                                                {...params}
                                                {...field}
                                                label='Branch'
                                                error={!!errors.branch}
                                                helperText={errors.branch?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            <Controller
                                name='grade'
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                                    <Autocomplete
                                        // options={gradesOptions}
                                        options={grade}
                                        size='small'
                                        value={value || null}
                                        multiple
                                        onChange={(event, newValue) => {
                                            setValue('grade', newValue, { shouldValidate: true })
                                        }}
                                        renderInput={params => (
                                            <TextField
                                            size='small'
                                                {...params}
                                                {...field}
                                                label='Grade'
                                                error={!!errors.grade}
                                                helperText={errors.grade?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            <Controller
                                name='gender'
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                                    <Autocomplete
                                    options={['Male','Female' , 'other']}
                                        size='small'
                                        value={value || null}
                                        multiple
                                        onChange={(event, newValue) => {
                                            setValue('gender', newValue, { shouldValidate: true })
                                        }}
                                        renderInput={params => (
                                            <TextField
                                            size='small'
                                                {...params}
                                                {...field}
                                                label='Gender'
                                                error={!!errors.gender}
                                                helperText={errors.gender?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            <Stack direction='row' gap={2} alignItems='center'>
                                <Controller
                                    name='age.from'
                                    control={control}
                                    rules={{
                                        required: 'This field is required.',
                                        validate: (value) =>
                                            /^[0-9]*$/.test(value) || 'Only numbers are allowed.',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                        size='small'
                                            {...field}
                                            type="text"
                                            fullWidth
                                            label='Age (From)'
                                            onChange={(e) => {
                                                const inputValue = e.target.value;

                                                if (/^[0-9]*$/.test(inputValue)) {
                                                    field.onChange(inputValue);
                                                }
                                            }}

                                            error={!!errors?.age?.from}
                                            helperText={errors?.age?.from?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name='age.to'
                                    control={control}
                                    rules={{
                                        required: 'This field is required.',
                                        validate: (value) => {

                                            const toValue = Number(value);

                                            if (!/^[0-9]*$/.test(value)) {
                                                return 'Only numbers are allowed.';
                                            }

                                            if (fromValue && toValue <= fromValue) {
                                                return 'To value must be greater than From value';
                                            }


                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                        size='small'
                                            {...field}
                                            type="text"
                                            fullWidth
                                            label='Age (To)'
                                            onChange={(e) => {
                                                const inputValue = e.target.value;

                                                if (/^[0-9]*$/.test(inputValue)) {
                                                    field.onChange(inputValue);
                                                }
                                            }}

                                            error={!!errors?.age?.to}
                                            helperText={errors?.age?.to?.message}
                                        />
                                    )}
                                />
                            </Stack>
                        </Stack>
                            <SectionAndQuestion control={control} clearErrors={clearErrors} watch={watch} fields={fields} append={append} remove={remove} errors={errors} getValues={getValues} setValue={setValue} sectionOptions={sectionOptions}/>
                        <Stack gap={2} direction='row' my={4} display='flex' justifyContent='flex-end'>

                                <Button
                                size='small'
                                    variant='outlined'
                                    type='reset'
                                    onClick={() => {
                                        router.push('/')
                                        reset()
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button size='small' variant='contained' type='submit'>
                                    Add
                                </Button>
                        </Stack>
                    </form> :
                    <Typography textAlign={'center'}>
                    Need Token to display Token
                    </Typography>
                    }
            </Container>
        </Box>
    )
}

export default DeclarationForm

