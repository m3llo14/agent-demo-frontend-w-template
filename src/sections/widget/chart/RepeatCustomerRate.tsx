'use client';

import { MouseEvent, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import RepeatCustomerChart from './RepeatCustomerChart';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import useLocales from 'utils/locales/useLocales';

type PeriodValue = 'lastWeek' | 'last3Months' | 'lastYear' | 'last3Year';

type TrendPoint = {
  label: string;
  value: number;
};

interface Props {
  data: TrendPoint[];
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  period: PeriodValue;
  onPeriodChange: (p: PeriodValue) => void;
}

export default function RepeatCustomerRate({
  data,
  currentValue,
  previousValue,
  changePercentage,
  period,
  onPeriodChange
}: Props) {
  const { t } = useLocales();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const periodLabels: Record<PeriodValue, string> = {
    lastWeek: t('dashboard.range.lastWeek'),
    last3Months: t('dashboard.range.last3Months'),
    lastYear: t('dashboard.range.lastYear'),
    last3Year: t('dashboard.range.last3Years')
  };

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (p: PeriodValue) => {
    onPeriodChange(p);
    setAnchorEl(null);
  };

  return (
    <MainCard>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">
          {t('dashboard.cards.revenue')}
        </Typography>

        <IconButton
          color="secondary"
          onClick={handleClick}
          sx={{ transform: 'rotate(90deg)' }}
        >
          <MoreIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <ListItemButton onClick={() => handleSelect('lastWeek')}>{periodLabels.lastWeek}</ListItemButton>
          <ListItemButton onClick={() => handleSelect('last3Months')}>{periodLabels.last3Months}</ListItemButton>
          <ListItemButton onClick={() => handleSelect('lastYear')}>{periodLabels.lastYear}</ListItemButton>
          <ListItemButton onClick={() => handleSelect('last3Year')}>{periodLabels.last3Year}</ListItemButton>
        </Menu>
      </Stack>

      {/* METRIC */}
      <Stack direction="row" justifyContent="flex-end" mt={1}>
        <Chip
          label={`${changePercentage > 0 ? '+' : ''}${changePercentage}%`}
          color={changePercentage >= 0 ? 'success' : 'error'}
          size="small"
        />
      </Stack>

      {/* CHART */}
      <RepeatCustomerChart data={data} period={period} />
    </MainCard>
  );
}
