'use client';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Logo from 'components/logo';
import AuthWrapper2 from 'sections/auth/AuthWrapper2';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login2Page() {
  return (
    <AuthWrapper2>
      <Grid container spacing={3}>
        <Grid sx={{ textAlign: 'center' }} size={12}>
          <Logo />
        </Grid>
        <Grid size={12}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthLogin forgot="/auth/forgot-password2" />
        </Grid>
      </Grid>
    </AuthWrapper2>
  );
}
