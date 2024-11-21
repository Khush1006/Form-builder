'use client';

import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const UserForm = () => {
  const [data, setData] = useState([]);
  const [formState, setFormState] = useState({});
  const [currentSection, setCurrentSection] = useState(0); // Track current section
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzAzYWU5NzkzMzRjOTVjZjgzNDJhYWUiLCJpYXQiOjE3MzIxNjc4NTAsImV4cCI6MTczMjI1NDI1MH0.og1fQIXgGltgDppaxTHkAW18xZG7feA4IN4jfOgpg-A';

  const handleChange = (key, value) => {
    setFormState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentQuestions = data.questions.filter(
      (question) => question.sectionNumber === currentSection + 1
    );

    // Perform validation for the current section
    const isValid = currentQuestions.every((question) => {
      if (question.isMandatory) {
        return formState[question._id];
      }
      return true;
    });

    if (!isValid) {
      alert('Please complete all mandatory fields in this section.');
      return;
    }

    if (currentSection < data.sections.length - 1) {
      setCurrentSection((prev) => prev + 1); // Move to the next section
    } else {
      console.log('Form Submitted: ', formState);
      // Submit final data to the backend
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://52.66.121.156:4087/api/declaration-form/candidate/fetch/6731e2da220114fddcbd705a',
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
        setData(response.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" py={2} textAlign="center">
          {data.sections && data.sections[currentSection]}
        </Typography>

        <form onSubmit={handleSubmit}>
          {data.questions
            ?.filter((q) => q.sectionNumber === currentSection + 1) // Show only questions for the current section
            .map((question) => (
              <FormControl
                key={question._id}
                fullWidth
                margin="normal"
                required={question.isMandatory}
              >
                <FormLabel>{question.labelPre}</FormLabel>
                {question.instructions && (
                  <Typography variant="body2" color="textSecondary">
                    {question.instructions}
                  </Typography>
                )}

                {/* Handle different question types */}
                {question.questionType === 'Text' && (
                  <TextField
                    size="small"
                    value={formState[question._id] || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  />
                )}

                {question.questionType === 'Number' && (
                  <TextField
                    type="number"
                    size="small"
                    value={formState[question._id] || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  />
                )}

                {question.questionType === 'Select' && (
                  <Select
                    size="small"
                    value={formState[question._id] || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  >
                    {question.options.map((option) => (
                      <MenuItem key={option._id} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}

                {question.questionType === 'File' && (
                  <TextField
                    type="file"
                    size="small"
                    inputProps={{
                      accept: question.attachments[0]?.acceptedFileTypes.join(
                        ','
                      ),
                      multiple:
                        question.attachments[0]?.maxNumberOfFiles > 1,
                    }}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (
                        files.length > question.attachments[0].maxNumberOfFiles
                      ) {
                        alert(
                          `You can upload a maximum of ${question.attachments[0].maxNumberOfFiles} files.`
                        );
                        return;
                      }

                      for (let file of files) {
                        if (
                          file.size / (1024 * 1024) >
                          question.attachments[0].maxFileSize
                        ) {
                          alert(
                            `File size exceeds the maximum limit of ${question.attachments[0].maxFileSize}MB.`
                          );
                          return;
                        }
                      }

                      handleChange(question._id, files);
                    }}
                  />
                )}
              </FormControl>
            ))}

          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {currentSection < data?.sections?.length - 1
                ? 'Next Section'
                : 'Submit'}
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default UserForm;
