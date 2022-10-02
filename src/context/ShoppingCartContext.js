import { createContext, useEffect, useMemo, useState } from 'react';

import videos from '@/static-data/videos';
import axios from 'axios';
import { USER_EMAIL_SESSION_STORAGE_KEY } from './PaymentContext';

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

  const sortFrames = (frameA, frameB) => {
    const sortOrderA = videos[frameA.video].sortOrder;
    const sortOrderB = videos[frameB.video].sortOrder;

    // The number 10000 seems arbitrary, but the main point is that the order
    // of the videos in sorting holds more weight than the order of the frames.
    // Frame order should only matter when the video is the same.
    return (
      sortOrderA * 10000 + frameA.frame - (sortOrderB * 10000 + frameB.frame)
    );
  };

  const addToCart = (frames) => {
    const newSelectedFrames = (selectedFrames || [])
      .concat(frames)
      .sort(sortFrames);
    setSelectedFrames(newSelectedFrames);
    storeInSessionStorage(newSelectedFrames);
  };

  const clearFramesReservations = async (frames) => {
    const email = sessionStorage.getItem(USER_EMAIL_SESSION_STORAGE_KEY);
    if (email) {
      await axios.post('/api/reservations/clear', { frames, email });
    }
  };

  const removeFromCart = async (frame) => {
    try {
      await clearFramesReservations([frame]);
      const newSelectedFrames = selectedFrames.filter(
        (frameInCart) =>
          frameInCart.frame !== frame.frame || frameInCart.video !== frame.video
      );
      setSelectedFrames(newSelectedFrames);
      storeInSessionStorage(newSelectedFrames);
    } catch (e) {
      console.log('Remove cart - Error: Clear reservation api call failed', e);
    }
  };

  const removeManyFromCart = async (frames) => {
    try {
      await clearFramesReservations(frames);
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
    } catch (e) {
      console.log('Remove many - Error: Clear reservation api call failed', e);
    }
  };

  const removeAllFromCart = async () => {
    try {
      await clearFramesReservations(selectedFrames);
      setSelectedFrames([]);
      storeInSessionStorage([]);
    } catch (e) {
      console.log('Remove all - Error: Clear reservation api call failed', e);
    }
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
