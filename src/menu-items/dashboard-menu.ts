// assets
import { HomeTrendUp } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: HomeTrendUp
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'dashboard',
  title: 'dashboard',
  type: 'group',
  url: '/dashboard',
  icon: icons.dashboard
};

export default dashboard;

