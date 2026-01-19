// project-imports
import samplePage from './sample-page';
import others from './support';
import management from './management';
// types
import { NavItemType } from 'types/menu';


// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, management, others]
};

export default menuItems;
