import { createContext, useEffect, useState } from 'react';

const SELECTED_FRAMES_SESSION_STORAGE_KEY = 'rehberger_selected_frames';

const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [selectedFrames, setSelectedFrames] = useState([]);

  useEffect(() => {
    const selectedFrames =
      JSON.parse(sessionStorage.getItem(SELECTED_FRAMES_SESSION_STORAGE_KEY)) ||
      [];

    setSelectedFrames(selectedFrames);
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
    setSelectedFrames[newSelectedFrames];
    storeInSessionStorage(newSelectedFrames);
  };

  return (
    <ShoppingCartContext.Provider
      value={{ addToCart, removeFromCart, selectedFrames }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export default ShoppingCartContext;
