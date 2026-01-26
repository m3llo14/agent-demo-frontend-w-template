import { useEffect, useState, ChangeEvent } from 'react';

// material-ui
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { merge } from 'lodash-es';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project-imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { insertCustomer, updateCustomer } from 'api/customer';
import { openSnackbar } from 'api/snackbar';

// assets
import { Camera, Trash } from '@wandersonalwes/iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';
import { CustomerList } from 'types/customer';

// CONSTANT
const getInitialValues = (customer: CustomerList | null) => {
  const newCustomer = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    age: 18,
    avatar: 1,
    contact: ''
  };

  if (customer) {
    return merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormCustomerAdd({ customer, closeModal }: { customer: CustomerList | null; closeModal: () => void }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(
    `/assets/images/users/avatar-${customer && customer !== null && customer?.avatar ? customer.avatar : 1}.png`
  );

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const CustomerSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('First Name is required'),
    lastName: Yup.string().max(255).required('Last Name is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    age: Yup.number().min(0).max(120).required('Age is required'),
    contact: Yup.string().max(255).required('Contact is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const newCustomer: CustomerList = values;
        newCustomer.name = newCustomer.firstName + ' ' + newCustomer.lastName;

        if (customer) {
          updateCustomer(newCustomer.id!, newCustomer).then(() => {
            openSnackbar({
              open: true,
              message: 'Customer update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertCustomer(newCustomer).then(() => {
            openSnackbar({
              open: true,
              message: 'Customer added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setSubmitting(false);
            closeModal();
          });
        }
      } catch {}
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" sx={{ justifyContent: 'center' }}>
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'center', mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avatar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={(theme) => ({
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bgcolor: 'rgba(0,0,0,.65)',
                          ...theme.applyStyles('dark', { bgcolor: 'rgba(255, 255, 255, .75)' }),
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        })}
                      >
                        <Stack sx={{ gap: 0.5, alignItems: 'center', color: 'secondary.lighter' }}>
                          <Camera style={{ fontSize: '2rem' }} />
                          <Typography>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avatar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="customer-firstName">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-firstName"
                          placeholder="Enter First Name"
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="customer-lastName">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-lastName"
                          placeholder="Enter Last Name"
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={9}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="customer-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="Enter Customer Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={3}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="customer-age">Age</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="customer-age"
                          placeholder="Enter Age"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="customer-contact">Contact</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-contact"
                          placeholder="Enter Contact"
                          {...getFieldProps('contact')}
                          error={Boolean(touched.contact && errors.contact)}
                          helperText={touched.contact && errors.contact}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                <Grid>
                  {customer && (
                    <Tooltip title="Delete Customer" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid>
                  <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {customer ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {customer && <AlertCustomerDelete id={customer.id!} title={customer.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}
