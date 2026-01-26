import { useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import UserList from './UserList';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { ThemeMode } from 'config';

// types
import { UserProfile } from 'types/user-profile';

// assets
import { SearchNormal1 } from '@wandersonalwes/iconsax-react';

interface ChatDrawerProps {
  handleDrawerOpen: () => void;
  openChatDrawer: boolean | undefined;
  setUser: (u: UserProfile) => void;
  selectedUser: string | null;
}

// ==============================|| CHAT - DRAWER ||============================== //

export default function ChatDrawer({ handleDrawerOpen, openChatDrawer, setUser, selectedUser }: ChatDrawerProps) {
  const theme = useTheme();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const [search, setSearch] = useState<string | undefined>('');
  const handleSearch = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
    const newString = event?.target.value;
    setSearch(newString);
  };

  return (
    <Drawer
      sx={{
        width: 320,
        flexShrink: 0,
        display: { xs: openChatDrawer ? 'block' : 'none', lg: 'block' },
        zIndex: { xs: openChatDrawer ? 1300 : -1, lg: 0 }
      }}
      slotProps={{
        paper: {
          sx: {
            height: '100%',
            width: 320,
            boxSizing: 'border-box',
            position: { xs: 'fixed', lg: 'relative' },
            border: 'none',
            [theme.breakpoints.up('md')]: { borderRadius: '12px 0 0 12px' }
          }
        }
      }}
      variant={downLG ? 'temporary' : 'persistent'}
      anchor="left"
      open={openChatDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      <MainCard
        sx={{ borderRadius: '12px 0 0 12px', borderRight: 'none', height: '100%', '& div:nth-of-type(2)': { height: 'auto' } }}
        border={!downLG}
        content={false}
      >
        <Box sx={{ p: 3, pb: 1 }}>
          <Stack sx={{ gap: 2 }}>
            <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
              <Typography variant="h5" color="inherit">
                Messages
              </Typography>
              <Chip
                label="9"
                color={theme.palette.mode === ThemeMode.DARK ? 'default' : 'secondary'}
                sx={{ width: 20, height: 20, borderRadius: '50%', '& .MuiChip-label': { px: 0.5 } }}
              />
            </Stack>

            <OutlinedInput
              fullWidth
              id="input-search-header"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              slotProps={{ input: { sx: { p: '10.5px 0px 12px' } } }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchNormal1 style={{ fontSize: 'small' }} />
                </InputAdornment>
              }
            />
          </Stack>
        </Box>

        <SimpleBar
          sx={{ overflowX: 'hidden', height: { xs: 'calc(100vh - 300px)', md: 'calc(100vh - 402px)' }, minHeight: { xs: 0, md: 420 } }}
        >
          <Box sx={{ p: 3, pt: 0 }}>
            <UserList setUser={setUser} search={search} selectedUser={selectedUser} />
          </Box>
        </SimpleBar>
      </MainCard>
    </Drawer>
  );
}
