'use client';

// next
import { useSession } from 'next-auth/react';

// material-ui
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project-imports
import MainCard from 'components/MainCard';

// styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}));

// mock data for tenant comparison
type HotelService = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  stock: number;
  maxAdults: number;
  maxChildren: number;
};

type PricingTier = {
  name: string;
  price: number;
  isActive: boolean;
};

type TourismService = {
  id: string;
  name: string;
  pricingTiers: PricingTier[];
  duration: string;
  capacity: number;
  targetSpecialistId: string;
  startDate: string;
  endDate: string;
};

const hotelRows: HotelService[] = [
  {
    id: 'hotel-1',
    name: 'Deluxe Sea View',
    price: 5200,
    capacity: 2,
    description: 'Sea view, balcony, breakfast included',
    stock: 8,
    maxAdults: 2,
    maxChildren: 1
  },
  {
    id: 'hotel-2',
    name: 'Family Suite',
    price: 7800,
    capacity: 4,
    description: 'Two rooms, kitchenette, city view',
    stock: 5,
    maxAdults: 3,
    maxChildren: 2
  },
  {
    id: 'hotel-3',
    name: 'Standard Room',
    price: 3200,
    capacity: 2,
    description: 'Garden view, queen bed',
    stock: 12,
    maxAdults: 2,
    maxChildren: 1
  }
];

const tourismRows: TourismService[] = [
  {
    id: 'tour-1',
    name: 'Cappadocia Sunrise Tour',
    pricingTiers: [
      { name: 'Yetişkin', price: 4500, isActive: true },
      { name: 'Çocuk', price: 2800, isActive: true }
    ],
    duration: '2 days',
    capacity: 24,
    targetSpecialistId: 'guide-102',
    startDate: '2025-06-12',
    endDate: '2025-06-13'
  },
  {
    id: 'tour-2',
    name: 'Pamukkale Day Trip',
    pricingTiers: [{ name: 'Yetişkin', price: 3500, isActive: true }],
    duration: '1 day',
    capacity: 40,
    targetSpecialistId: 'guide-205',
    startDate: '2025-07-05',
    endDate: '2025-07-05'
  },
  {
    id: 'tour-3',
    name: 'Ephesus Heritage Route',
    pricingTiers: [
      { name: 'Yetişkin', price: 3900, isActive: true },
      { name: 'Öğrenci', price: 3200, isActive: true }
    ],
    duration: '1 day',
    capacity: 30,
    targetSpecialistId: 'guide-318',
    startDate: '2025-08-18',
    endDate: '2025-08-18'
  }
];

const formatPricingTiers = (tiers: PricingTier[]) => {
  if (!tiers?.length) return '—';
  const active = tiers.filter((tier) => tier.isActive);
  const list = (active.length ? active : tiers).map((tier) => `${tier.name}: ${tier.price}`);
  return list.join(', ');
};

// ==============================|| MUI TABLE - CUSTOMIZED ||============================== //

export default function CustomizedTables() {
  const { data: session } = useSession();

  let tenantOverride: string | null = null;
  if (typeof window !== 'undefined') {
    tenantOverride = new URLSearchParams(window.location.search).get('tenantType');
  }

  const tenantType =
    tenantOverride === 'hotel' || tenantOverride === 'tourism'
      ? tenantOverride
      : session?.user?.tenantType || 'hotel';

  const isTourism = tenantType === 'tourism';

  return (
    <MainCard content={false} title={isTourism ? 'Trips' : 'Rooms'}>
      <TableContainer>
        <Table sx={{ minWidth: 320 }} aria-label="customized table">
          {isTourism ? (
            <>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ pl: 3 }}>Name</StyledTableCell>
                  <StyledTableCell>Pricing</StyledTableCell>
                  <StyledTableCell align="right">Duration</StyledTableCell>
                  <StyledTableCell align="right">Capacity</StyledTableCell>
                  <StyledTableCell align="right">Target Specialist</StyledTableCell>
                  <StyledTableCell align="right">Start Date</StyledTableCell>
                  <StyledTableCell sx={{ pr: 3 }} align="right">
                    End Date
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tourismRows.map((row) => (
                  <StyledTableRow hover key={row.id}>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{formatPricingTiers(row.pricingTiers)}</StyledTableCell>
                    <StyledTableCell align="right">{row.duration}</StyledTableCell>
                    <StyledTableCell align="right">{row.capacity}</StyledTableCell>
                    <StyledTableCell align="right">{row.targetSpecialistId}</StyledTableCell>
                    <StyledTableCell align="right">{row.startDate}</StyledTableCell>
                    <StyledTableCell sx={{ pr: 3 }} align="right">
                      {row.endDate}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ pl: 3 }}>Name</StyledTableCell>
                  <StyledTableCell align="right">Price</StyledTableCell>
                  <StyledTableCell align="right">Capacity</StyledTableCell>
                  <StyledTableCell align="right">Description</StyledTableCell>
                  <StyledTableCell align="right">Stock</StyledTableCell>
                  <StyledTableCell align="right">Max Adults</StyledTableCell>
                  <StyledTableCell sx={{ pr: 3 }} align="right">
                    Max Children
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hotelRows.map((row) => (
                  <StyledTableRow hover key={row.id}>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.price}</StyledTableCell>
                    <StyledTableCell align="right">{row.capacity}</StyledTableCell>
                    <StyledTableCell align="right">{row.description}</StyledTableCell>
                    <StyledTableCell align="right">{row.stock}</StyledTableCell>
                    <StyledTableCell align="right">{row.maxAdults}</StyledTableCell>
                    <StyledTableCell sx={{ pr: 3 }} align="right">
                      {row.maxChildren}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </MainCard>
  );
}
