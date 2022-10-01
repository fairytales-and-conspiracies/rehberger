import { useEffect, useState } from 'react';

const useThreeDots = (hookState) => {
  const [dotsState, setDotsState] = useState(hookState);
  const [nbSufixDots, setNbSufixDots] = useState(0);

  useEffect(() => {
    let handle;
    if (dotsState) {
      handle = setInterval(() => {
        setNbSufixDots((nbDots) => (nbDots % 3) + 1);
      }, 500);
    } else {
      clearInterval(handle);
      setNbSufixDots(0);
    }

    return () => {
      clearInterval(handle);
      setNbSufixDots(0);
    };
  }, [dotsState]);

  return {
    dots: `${new Array(nbSufixDots + 1).join('.')}`,
    setDotsState,
  };
};

export default useThreeDots;
