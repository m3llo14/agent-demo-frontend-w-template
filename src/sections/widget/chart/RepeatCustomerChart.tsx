'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useLocales from 'utils/locales/useLocales';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TrendPoint = {
  label: string;
  value: number;
};

interface Props {
  data: TrendPoint[];
  period: 'lastWeek' | 'last3Months' | 'lastYear' | 'last3Year';
}

// base chart options (STATIC)
const baseOptions: ChartProps = {
  chart: {
    type: 'area',
    toolbar: { show: false }
  },
  dataLabels: { enabled: false },
  stroke: { width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0
    }
  },
  grid: {
    strokeDashArray: 4
  }
};

// ==============================|| REPEAT CUSTOMER CHART ||============================== //

export default function RepeatCustomerChart({ data, period }: Props) {
  const theme = useTheme();
  const { t } = useLocales();

  const orderedData = useMemo(() => {
    return [...data].reverse();
  }, [data]);

  const monthLabelMap = useMemo<Record<string, string>>(
    () => ({
      Jan: t('months.jan'),
      Feb: t('months.feb'),
      Mar: t('months.mar'),
      Apr: t('months.apr'),
      May: t('months.may'),
      Jun: t('months.jun'),
      Jul: t('months.jul'),
      Aug: t('months.aug'),
      Sep: t('months.sep'),
      Oct: t('months.oct'),
      Nov: t('months.nov'),
      Dec: t('months.dec')
    }),
    [t]
  );

  const dayLabelMap = useMemo<Record<string, string>>(
    () => ({
      Mon: t('days.mon'),
      Tue: t('days.tue'),
      Wed: t('days.wed'),
      Thu: t('days.thu'),
      Fri: t('days.fri'),
      Sat: t('days.sat'),
      Sun: t('days.sun')
    }),
    [t]
  );

  const resolveLabel = useMemo(() => {
    return (label: string) => {
      if (period === 'lastWeek') {
        const dayOnlyMatch = label.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/);
        if (dayOnlyMatch) {
          return dayLabelMap[dayOnlyMatch[1]] ?? label;
        }
        const dayNumberMatch = label.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})$/);
        if (dayNumberMatch) {
          const [, day, dayNumber] = dayNumberMatch;
          return `${dayLabelMap[day] ?? day} ${dayNumber}`;
        }
        return label;
      }

      if (period === 'last3Months') {
        const weekMonthMatch = label.match(/^W(\d{1,2})\s+([A-Za-z]{3})$/i);
        if (weekMonthMatch) {
          const [, weekNumber, monthKey] = weekMonthMatch;
          const template = t('dashboard.week');
          const weekLabel = String(template).replace('{{week}}', weekNumber);
          return `${weekLabel} ${monthLabelMap[monthKey] ?? monthKey}`;
        }
        const weekMatch = label.match(/^W(\d{1,2})$/i);
        if (weekMatch) {
          const template = t('dashboard.week');
          return String(template).replace('{{week}}', weekMatch[1]);
        }
        const monthMatch = label.match(/^([A-Za-z]{3})$/);
        if (monthMatch) {
          const monthKey = monthMatch[1];
          return monthLabelMap[monthKey] ?? label;
        }
        return label;
      }

      const monthYearMatch = label.match(/^([A-Za-z]{3})\s+(\d{4})$/);
      if (monthYearMatch) {
        const [, month, year] = monthYearMatch;
        return `${monthLabelMap[month] ?? month} ${year}`;
      }

      return label;
    };
  }, [dayLabelMap, monthLabelMap, period, t]);

  const translatedCategories = useMemo(() => {
    return orderedData.map((item) => resolveLabel(item.label));
  }, [orderedData, resolveLabel]);

  const options: ChartProps = useMemo(
    () => ({
      ...baseOptions,
      colors: [theme.palette.primary.main],
      xaxis: {
        categories: translatedCategories,
        labels: {
          style: { colors: theme.palette.text.secondary }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.secondary }
        }
      },
      grid: {
        borderColor: theme.palette.divider
      },
      theme: {
        mode: theme.palette.mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }),
    [translatedCategories, theme]
  );

  const series = useMemo(
    () => [
      {
        name: 'Revenue',
        data: orderedData.map((d) => d.value)
      }
    ],
    [orderedData]
  );

  return <ReactApexChart options={options} series={series} type="area" height={284} />;
}
 