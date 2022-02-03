import { useSelector } from 'react-redux';

import { AppState } from '@/redux/store';

export const useAppSelector = <T>(selector: (state: AppState) => T) =>
  useSelector<AppState, T>(selector);
