import axios from 'axios';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import CurrentFrame from '@components/CurrentFrame';
import SelectionPreview from '@components/SelectionPreview';
import ShoppingCartContext from '@context/ShoppingCartContext';
import VideoData from '@static-data/videos';

const VIDEO = 'brick-and-mortar';

export default function FrameSelection({ onClose }) {
  const { selectedFramesInShoppingCart } = useContext(ShoppingCartContext);

  const [loading, setLoading] = useState(true);
  const [frames, setFrames] = useState(null);
  const [selectedFrames, setSelectedFrames] = useState([]);
  const [currentSelectedFrame, setCurrentSelectedFrame] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/frames?video=${VIDEO}`)
      .then((response) => {
        const frames = response.data.data.map((frame) => {
          // When checking for the closest available frame, we also want
          // to check whether the frame is already in the shopping cart,
          // and if so exclude it as well from the available frames
          const frameInCart = (selectedFramesInShoppingCart || []).find(
            (frameInCart) => frameInCart.frame === frame.frame
          );

          return Object.assign({}, frame, { isInShoppingCart: !!frameInCart });
        });

        setFrames(frames);
      })
      .then(() => setLoading(false));
  }, []);

  const findClosestAvailableFrame = (currentTime) => {
    const timeDifferenceBetweenFrames = frames[1].time - frames[0].time;
    const approxFrameNumber = currentTime / timeDifferenceBetweenFrames;
    const closerToUpper =
      approxFrameNumber - Math.floor(approxFrameNumber) >= 0.5;

    const firstFrame = frames[0].frame;
    const lastFrame = frames[frames.length - 1].frame;

    let closestAvailableFrame = null;

    let frameNumber = Math.round(approxFrameNumber),
      reachedOneBound = false,
      step = closerToUpper ? -1 : 1;

    while (!closestAvailableFrame) {
      if (frameNumber < firstFrame) {
        if (reachedOneBound) {
          break;
        }
        reachedOneBound = true;
        frameNumber += step;
        step = 1;
      }

      if (frameNumber > lastFrame) {
        if (reachedOneBound) {
          break;
        }
        reachedOneBound = true;
        frameNumber += step;
        step = -1;
      }

      if (
        !frames[frameNumber - 1].sold &&
        !frames[frameNumber - 1].isInShoppingCart
      ) {
        closestAvailableFrame = frames[frameNumber - 1];
        break;
      }

      frameNumber += step;
      if (!reachedOneBound) {
        step *= -1;
        step += step > 0 ? 1 : -1;
      }
    }

    return closestAvailableFrame;
  };

  const onVideoClick = (event) => {
    console.log('Time: ', event.target.currentTime);

    const currentTime = event.target.currentTime;
    let closestAvailableFrame = findClosestAvailableFrame(currentTime);

    if (!closestAvailableFrame) {
      // TODO: what to do when there are no more available frames
    }

    setCurrentSelectedFrame(closestAvailableFrame);

    const newSelectedFrames = selectedFrames.slice();
    newSelectedFrames.push(closestAvailableFrame);
    setSelectedFrames(newSelectedFrames);

    setCurrentSelectedFrame(closestAvailableFrame);

    console.log('Frame number: ', closestAvailableFrame);
  };

  const removeSelectedFrame = (frameToRemove) => {
    const newSelectedFrames = selectedFrames.filter(
      (frame) => frame.frame !== frameToRemove.frame
    );
    setSelectedFrames(newSelectedFrames);
  };

  const removeAllFrames = () => {
    setSelectedFrames([]);
  };

  return (
    <div
      className={`frame-selection ${
        loading ? 'frame-selection--invisible' : ''
      }`}
    >
      <div className="frame-selection__encapsulator">
        <span className="frame-selection__close">
          <Image
            alt="Close"
            height="25"
            onClick={onClose}
            src="/img/icons/close.svg"
            width="25"
          />
        </span>
        <div className="frame-selection__container">
          <div className="frame-selection__inner-container">
            <CurrentFrame selectedFrame={currentSelectedFrame} video={VIDEO} />

            {VIDEO && (
              <div className="frame-selection__frame-info">
                <h2 className="selected-frame__title">
                  {VideoData[VIDEO].title}
                </h2>
                <h3 className="selected-frame__subtitle">
                  {VideoData[VIDEO].subtitle}
                </h3>
                <p className="selected-frame__description">
                  {VideoData[VIDEO].description}
                </p>
                <div className="selected-frame__price euro-price">€666</div>
              </div>
            )}

            <video
              autoPlay
              className="frame-selection__video"
              loop
              muted
              onClick={onVideoClick}
            >
              <source src="/vid/brick-and-mortar.mov" />
            </video>

            <div className="frame-selection__instructions-wrapper">
              <div className="frame-selection__instructions-group">
                <div className="frame-selection__instructions-image">
                  <Image
                    alt="Read the text below"
                    height="60"
                    src="/img/chevrons-ul-to-lr.svg"
                    width="57"
                  />
                </div>
                <div className="frame-selection__instructions-image-small-devices">
                  <Image
                    alt="Read the text below"
                    height="20"
                    src="/img/double-chevron-down.svg"
                    width="19"
                  />
                </div>
                <p className="frame-selection__instructions">
                  Click on the liquid poster to select the frame you like. Keep
                  klicking on desired frames to select multiple.
                </p>
              </div>
              <div className="frame-selection__instructions-group">
                <p className="frame-selection__instructions">
                  Every single frame is completely unique. If the frame you
                  selected has already been sold, our algorithm will propose to
                  you the frame closest to your initial selection that is still
                  available!
                </p>
              </div>
              <div className="frame-selection__instructions-group">
                <div className="frame-selection__instructions-image">
                  <Image
                    alt="Edit selections in section to the right"
                    height="60"
                    src="/img/chevrons-ll-to-ur.svg"
                    width="57"
                  />
                </div>
                <p className="frame-selection__instructions">
                  After completing selections, use the section on the right to
                  edit your selections and complete ordering your NFT.
                </p>
                <div className="frame-selection__instructions-image-small-devices">
                  <Image
                    alt="Select frame below"
                    height="20"
                    src="/img/double-chevron-down.svg"
                    width="19"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SelectionPreview
          removeAllFrames={removeAllFrames}
          removeSelectedFrame={removeSelectedFrame}
          selectedFrames={selectedFrames}
        />
      </div>
    </div>
  );
}
