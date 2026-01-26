import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import AlertCustomerDelete from './AlertCustomerDelete';
import ListCard from './export-pdf/ListCard';

import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// types
import { CustomerList } from 'types/customer';

// assets
import { DocumentDownload, Edit, Trash } from '@wandersonalwes/iconsax-react';

interface Props {
  customer: CustomerList;
  open: boolean;
  onClose: () => void;
  editCustomer: () => void;
}

const avatarImage = '/assets/images/users';

// ==============================|| CUSTOMER - PREVIEW ||============================== //

export default function CustomerPreview({ customer, open, onClose, editCustomer }: Props) {
  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = () => {
    setOpenAlert(!openAlert);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        slots={{ transition: PopupTransition }}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        slotProps={{ paper: { sx: { width: 1024, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } } } }}
      >
        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>
          <DialogTitle sx={{ px: 0 }}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <PDFDownloadLink document={<ListCard customer={customer} />} fileName={`Customer-${customer.name}.pdf`}>
                      <Tooltip title="Export">
                        <IconButton color="secondary">
                          <DocumentDownload />
                        </IconButton>
                      </Tooltip>
                    </PDFDownloadLink>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={editCustomer}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" onClick={handleClose}>
                      <IconButton color="error">
                        <Trash />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                <ListItemAvatar sx={{ mr: 0.75 }}>
                  <Avatar alt={customer.name} size="lg" src={`${avatarImage}/avatar-${!customer.avatar ? 1 : customer.avatar}.png`} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="h5">{customer.name}</Typography>}
                  secondary={<Typography color="secondary">{customer.email}</Typography>}
                />
              </ListItem>
            </List>
          </DialogTitle>
          <DialogContent dividers sx={{ px: 0 }}>
            <SimpleBar sx={{ height: 'calc(100vh - 290px)' }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <MainCard title="Customer Info">
                    <List sx={{ py: 0 }}>
                      <ListItem divider>
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography color="secondary">Name</Typography>
                          <Typography>{customer.name}</Typography>
                        </Stack>
                      </ListItem>
                      <ListItem divider>
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography color="secondary">Email</Typography>
                          <Typography>{customer.email}</Typography>
                        </Stack>
                      </ListItem>
                      <ListItem divider>
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography color="secondary">Contact</Typography>
                          <Typography>{customer.contact}</Typography>
                        </Stack>
                      </ListItem>
                      <ListItem>
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography color="secondary">Age</Typography>
                          <Typography>{customer.age}</Typography>
                        </Stack>
                      </ListItem>
                    </List>
                  </MainCard>
                </Grid>
              </Grid>
            </SimpleBar>
          </DialogContent>

          <DialogActions>
            <Button color="error" variant="contained" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <AlertCustomerDelete id={customer.id!} title={customer.name} open={openAlert} handleClose={handleClose} />
    </>
  );
}
