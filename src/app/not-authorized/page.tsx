// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| NOT AUTHORIZED ||============================== //

export default function NotAuthorized() {
  return (
    <MainCard>
      <Stack sx={{ gap: 2, alignItems: 'flex-start' }}>
        <Typography variant="h4">Access denied</Typography>
        <Typography color="text.secondary">
          You do not have permission to view this page.
        </Typography>
        <Button component={Link} href="/dashboard" variant="contained">
          Go to dashboard
        </Button>
      </Stack>
    </MainCard>
  );
}

