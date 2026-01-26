import '@mui/material/styles';

// project-imports
import { CustomShadowProps } from 'types/theme';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadowProps;
  }
}
