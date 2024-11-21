'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';


const AllTemplates = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router= useRouter();
  const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzAzYWU5NzkzMzRjOTVjZjgzNDJhYWUiLCJpYXQiOjE3MzIxNjc4NTAsImV4cCI6MTczMjI1NDI1MH0.og1fQIXgGltgDppaxTHkAW18xZG7feA4IN4jfOgpg-A'

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://52.66.121.156:4087/api/declaration-form/template/search',{
            headers:{
                Authorization:'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzAzYWU5NzkzMzRjOTVjZjgzNDJhYWUiLCJpYXQiOjE3MzE2NDk1MDEsImV4cCI6MTczMTczNTkwMX0.kvw4xhPhIt_Ep54qga_ZvF6e723vzFhLtTusxy9eSAc'
            }
        }); // Replace with your API
        setData(response.data?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(data);
  }, []);
console.log(data,'data')
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant='h6' textAlign='center' py={2}>Template Table</Typography>
<Stack gap={2} display='flex' direction='row' justifyContent='flex-end' py={2}><Button variant='contained'
onClick={()=>router.push(`/form-builder?token=${token}`)}
>
    Create Template
</Button>
<Button variant='contained'
onClick={()=>router.push(`/user-form?token=${token}`)}
>
   User Form
</Button>


</Stack>

      {loading ? (
        <Box display='flex' justifyContent='center' py={2}>
        <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Sections</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row,index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.dataEnvironmentId}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.role?.map((item)=>item)}</TableCell>
                  <TableCell>{row.department?.join(',')}</TableCell>
                  <TableCell>{row.designation?.join(',')}</TableCell>
                  <TableCell>{row.branch?.join(',')}</TableCell>
                  <TableCell>{row.grade?.join(',')}</TableCell>
                  <TableCell>{row.gender?.join(',')}</TableCell>
                  <TableCell>{row.age?.from} - {row.age?.to} </TableCell>
                  <TableCell>{row.sections?.join(',')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default AllTemplates;
