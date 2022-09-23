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
      (frameInCart) =>
        frameInCart.frame !== frame.frame || frameInCart.video !== frame.video
    );
    setSelectedFrames(newSelectedFrames);
    storeInSessionStorage(newSelectedFrames);
  };

  const removeManyFromCart = (frames) => {
    const newSelectedFrames = selectedFrames.reduce((acc, frameInCart) => {
      const isFrameToRemove = frames.find(
        (frame) =>
          frame.frame === frameInCart.frame && frame.video === frameInCart.video
      );

      if (!isFrameToRemove) {
        acc.push(frameInCart);
      }
      return acc;
    }, []);
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
      removeManyFromCart,
      selectedFrames,
    }),
    [
      addToCart,
      removeAllFromCart,
      removeFromCart,
      removeManyFromCart,
      selectedFrames,
    ]
  );

  return (
    <ShoppingCartContext.Provider value={memoizedValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export default ShoppingCartContext;
