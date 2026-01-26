// project-imports
import others from './support';
import management from './management';
import dashboard from './dashboard-menu';
// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, management, others]
};

export default menuItems;
