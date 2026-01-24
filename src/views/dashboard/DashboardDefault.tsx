'use client';

// next
import { useSession } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import { GRID_COMMON_SPACING } from 'config';

import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';

// assets
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from '@wandersonalwes/iconsax-react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();
  const { data: session } = useSession();

  let tenantOverride: string | null = null;
  if (typeof window !== 'undefined') {
    tenantOverride = new URLSearchParams(window.location.search).get('tenantType');
  }

  const tenantType =
    tenantOverride === 'hotel' || tenantOverride === 'tourism'
      ? tenantOverride
      : session?.user?.tenantType || 'hotel';

  const cardTitles = {
    hotel: {
      revenue: 'Total Revenue',
      bookings: 'Total Bookings',
      occupancy: 'Occupied Rooms',
      today: 'Check-ins Today'
    },
    tourism: {
      revenue: 'Total Revenue',
      bookings: 'Total Trips',
      occupancy: 'Active Routes',
      today: 'Departures Today'
    }
  } as const;

  return (
    <Grid container spacing={GRID_COMMON_SPACING}>
      <Grid size={12}>
{/*         <WelcomeBanner /> */}
      </Grid>
      {/* row 1 */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={cardTitles[tenantType].revenue}
          count="$3000"
          iconPrimary={<Wallet3 />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={cardTitles[tenantType].bookings}
          count="290+"
          color="warning"
          iconPrimary={<Book />}
          percentage={
            <Typography sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </EcommerceDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={cardTitles[tenantType].occupancy}
          count="1,568"
          color="success"
          iconPrimary={<Calendar />}
          percentage={
            <Typography sx={{ color: 'success.darker', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.darker} />
        </EcommerceDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={cardTitles[tenantType].today}
          count="20"
          color="error"
          iconPrimary={<CloudChange />}
          percentage={
            <Typography sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </EcommerceDataCard>
      </Grid>
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 8, lg: 12 }}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={12}>
            <RepeatCustomerRate />
          </Grid>
          <Grid size={12}>
  {/*           <ProjectOverview /> */}
          </Grid>
        </Grid>
      </Grid>

      {/* row 3 */}

    </Grid>
  );
}

