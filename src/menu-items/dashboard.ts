// project-imports
import dashboard from './dashboard-menu';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - API (FALLBACK) ||============================== //

export function MenuFromAPI(): NavItemType {
  return dashboard;
}

export default dashboard;
