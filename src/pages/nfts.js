import { useState } from 'react';

import FrameSelection from '@components/FrameSelection';
import Header from '@components/Header';

export default function Home() {
  const [isFrameSelectionActive, setIsFrameSelectionActive] = useState(false);

  const frameSelectionClose = () => {
    setIsFrameSelectionActive(false);
  };

  return (
    <>
      <div className="bg-primary">
        <Header />
        <div className="under-construction">
          <span>Under construction...</span>
          <button
            onClick={() => {
              setIsFrameSelectionActive(true);
            }}
          >
            Click me
          </button>
        </div>
      </div>
      {isFrameSelectionActive && (
        <FrameSelection onClose={frameSelectionClose} />
      )}
    </>
  );
}
