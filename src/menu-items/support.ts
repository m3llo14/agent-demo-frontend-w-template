// assets

import { OceanProtocol, Level, ShieldCross, InfoCircle, I24Support, Driving, Calendar2 } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  menuLevel: OceanProtocol,
  menuLevelSubtitle: Level,
  disabledMenu: ShieldCross,
  chipMenu: InfoCircle,
  documentation: I24Support,
  roadmap: Driving,
  calender: Calendar2
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const others: NavItemType = {
  id: 'other',
  title: 'others',
  type: 'group',
  children: [
    {
      id: 'calender',
      title: 'calender',
      type: 'item',
      url: '/calender',
      icon: icons.calender,
      target: false
    }
    /*{
      id: 'menu-level-subtitle',
      title: 'menu-level-subtitle',
      caption: 'menu-level-subtitle-caption',
      type: 'collapse',
      icon: icons.menuLevelSubtitle,
      children: [
        {
          id: 'sub-menu-level-1.1',
          title: 'level 1',
          caption: 'menu-level-subtitle-item',
          type: 'item',
          url: '#'
        },
        {
          id: 'sub-menu-level-1.2',
          title: 'level 1',
          caption: 'menu-level-subtitle-collapse',
          type: 'collapse',
          children: [
            {
              id: 'sub-menu-level-2.1',
              title: 'level 2',
              type: 'item',
              url: '#'
            },
            {
              id: 'sub-menu-level-2.2',
              title: 'level 2',
              type: 'item',
              url: '#'
            }
          ]
        }
      ]
    },
    */

  ]
};

export default others;
