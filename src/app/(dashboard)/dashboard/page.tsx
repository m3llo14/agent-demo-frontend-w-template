'use client';

import { MouseEvent, useEffect, useState } from 'react';

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
import axiosServices from 'utils/axios';
import { resolveTenantType } from 'config/sector-registry';

// i18n
import useLocales from 'utils/locales/useLocales';

// assets
import { Book, Calendar, CloudChange, Wallet3 } from '@wandersonalwes/iconsax-react';

type DashboardData = {
  totalRevenue: number;
  totalBookings: number;
  todaysAppointments: number;
};

type CardKey = 'revenue' | 'bookings' | 'today';
type PeriodValue = 'lastWeek' | 'last3Months' | 'lastYear' | 'last3Year';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Dashboard() {
  const theme = useTheme();
  const { data: session } = useSession();
  const { t } = useLocales();
  const [revenueData, setRevenueData] = useState<DashboardData | null>(null);
  const [bookingsData, setBookingsData] = useState<DashboardData | null>(null);
  const [todayData, setTodayData] = useState<DashboardData | null>(null);
  const [periods, setPeriods] = useState<Record<CardKey, PeriodValue>>({
    revenue: 'lastWeek',
    bookings: 'lastWeek',
    today: 'lastWeek'
  });

  const auth = session?.user?.backendUser ?? null;

  if (!session) {
    return null;
  }
  
  // super admin bu dashboard'u görmesin
  if (!auth || auth.role === 'SUPER_ADMIN' || !auth.sectorType) {
    return null;
  }

  const resolvedTenantType =
    resolveTenantType({ sectorType: auth.sectorType }) ??
    (String(auth.sectorType ?? '')
      .trim()
      .toLowerCase()
      .startsWith('reservat')
      ? 'hotel'
      : undefined);
  const tenantType = resolvedTenantType ?? auth.sectorType;
  const merchantId = auth?.merchantId;

  useEffect(() => {
    if (!merchantId) return;
  
    axiosServices
      .get(`/appointments/dashboard/${merchantId}`, {
        params: { period: periods.revenue }
      })
      .then((res) => {
        setRevenueData(res.data.data);
      })
      .catch(console.error);
  }, [merchantId, periods.revenue]);
  useEffect(() => {
    if (!merchantId) return;
    
    axiosServices
      .get(`/appointments/dashboard/${merchantId}`, {
        params: { period: periods.bookings }
      })
      .then((res) => {
        setBookingsData(res.data.data);
      })
      .catch(console.error);
  }, [merchantId, periods.bookings]);
  useEffect(() => {
    if (!merchantId) return;
    axiosServices
      .get(`/appointments/dashboard/${merchantId}`, {
        params: { period: periods.today }
      })
      .then((res) => {
        setTodayData(res.data.data);
      })
      .catch(console.error);
  }, [merchantId, periods.today]);

  const handlePeriodChange = (cardKey: CardKey, period: PeriodValue) => {
    setPeriods((prev) => ({ ...prev, [cardKey]: period }));
  };

  if (!revenueData || !bookingsData || !todayData) {
    return null;
  }

  return (
    <Grid container spacing={GRID_COMMON_SPACING}>
      {/* row 1 */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.revenue.${tenantType}`)}
          count={String(revenueData.totalRevenue)}
          iconPrimary={<Wallet3 />}
          onPeriodChange={(p) => handlePeriodChange('revenue', p)}
          percentage={<Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}></Typography>}
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.bookings.${tenantType}`)}
          count={String(bookingsData.totalBookings)}
          color="warning"
          iconPrimary={<Book />}
          onPeriodChange={(p) => handlePeriodChange('bookings', p)}
          percentage={<Typography sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}></Typography>}
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </EcommerceDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <EcommerceDataCard
          title={t(`dashboard.cards.today.${tenantType}`)}
          count={String(todayData.todaysAppointments)}
          color="error"
          iconPrimary={<CloudChange />}
          onPeriodChange={(p) => handlePeriodChange('today', p)}
          percentage={<Typography sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}></Typography>}
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
