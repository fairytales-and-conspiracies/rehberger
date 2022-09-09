import { createContext, useEffect, useMemo, useState } from 'react';

const SELECTED_FRAMES_SESSION_STORAGE_KEY = 'rehberger_selected_frames';

const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [selectedFrames, setSelectedFrames] = useState([]);

  useEffect(() => {
    const selectedFramesInStorage =
      JSON.parse(sessionStorage.getItem(SELECTED_FRAMES_SESSION_STORAGE_KEY)) ||
      [];

    setSelectedFrames(selectedFramesInStorage);
  }, []);

  const storeInSessionStorage = (frames) => {
    sessionStorage.setItem(
      SELECTED_FRAMES_SESSION_STORAGE_KEY,
      JSON.stringify(frames)
    );
  };

  const addToCart = (frames) => {
    const newSelectedFrames = (selectedFrames || []).concat(frames);
    setSelectedFrames(newSelectedFrames);
    storeInSessionStorage(newSelectedFrames);
  };

  const removeFromCart = (frame) => {
    const newSelectedFrames = selectedFrames.filter(
      (frameInCart) => frameInCart.frame !== frame.frame
    );
    setSelectedFrames(newSelectedFrames);
    storeInSessionStorage(newSelectedFrames);
  };

  const removeAllFromCart = () => {
    setSelectedFrames([]);
    storeInSessionStorage([]);
  };

  const memoizedValue = useMemo(
    () => ({
      addToCart,
      removeAllFromCart,
      removeFromCart,
      selectedFrames,
    }),
    [addToCart, removeAllFromCart, removeFromCart, selectedFrames]
  );

  return (
    <ShoppingCartContext.Provider value={memoizedValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export default ShoppingCartContext;
