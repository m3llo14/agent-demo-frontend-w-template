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
import { mapAuthUser } from 'utils/auth-mapper';

// i18n
import useLocales from 'utils/locales/useLocales';

// assets
import { Book, Calendar, CloudChange, Wallet3 } from '@wandersonalwes/iconsax-react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();
  const { data: session } = useSession();
  const { t } = useLocales();

  const auth = session?.user?.backendUser
    ? mapAuthUser(session.user.backendUser)
    : null;

  // super admin bu dashboard'u görmesin
  if (!auth || auth.role === 'SUPER_ADMIN' || !auth.tenantType) {
    return null;
  }

  const tenantType = auth.tenantType;

  return (
    <Grid container spacing={GRID_COMMON_SPACING}>
      {/* row 1 */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.revenue.${tenantType}`)}
          count="$3000"
          iconPrimary={<Wallet3 />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.bookings.${tenantType}`)}
          count="290+"
          color="warning"
          iconPrimary={<Book />}
          percentage={
            <Typography sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </EcommerceDataCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.occupancy.${tenantType}`)}
          count="1,568"
          color="success"
          iconPrimary={<Calendar />}
          percentage={
            <Typography sx={{ color: 'success.darker', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.darker} />
        </EcommerceDataCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.today.${tenantType}`)}
          count="20"
          color="error"
          iconPrimary={<CloudChange />}
          percentage={
            <Typography sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </EcommerceDataCard>
      </Grid>

      {/* row 2 */}
      <Grid size={{ xs: 12 }}>
        <RepeatCustomerRate />
      </Grid>
    </Grid>
  );
}
