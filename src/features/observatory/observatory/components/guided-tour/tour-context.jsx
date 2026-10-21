import { useCallback, useState } from 'react';
import { TourContext } from './use-tour';
import { tourSteps } from './tour-steps';


export function TourProvider({ children }) {
  // Temporarily restart on every page load while the tour is being iterated.
  const [index, setIndex] = useState(-1);
  const finish = useCallback(() => {
    setIndex(null);
  }, []);
  return <TourContext.Provider value={{ index, welcome: index === -1, step: index == null || index < 0 ? null : tourSteps[index], setIndex, finish }}>{children}</TourContext.Provider>;
}
