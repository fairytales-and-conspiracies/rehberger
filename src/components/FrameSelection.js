import axios from 'axios';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';

import CurrentFrame from '@/components/CurrentFrame';
import NFTPrice from '@/components/NFTPrice';
import SelectionPreview from '@/components/SelectionPreview';
import ShoppingCartContext from '@/context/ShoppingCartContext';
import VideoData from '@/static-data/videos';
import iOS from '@/utils/ios';

const isFrameInCart = (frame, framesInCart) =>
  framesInCart.find(
    (frameInCart) =>
      frameInCart.frame === frame.frame && frameInCart.video === frame.video
  );

const sortFrames = (frameA, frameB) => {
  return frameA.frame - frameB.frame;
};

export default function FrameSelection({ onClose, video }) {
  const isIOS = iOS();

  const { selectedFrames: selectedFramesInShoppingCart } =
    useContext(ShoppingCartContext);

  const videoRef = useRef();

  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [frames, setFrames] = useState(null);
  const [imageLoadingToggle, setImageLoadingToggle] = useState(false);
  const [isSelectionPreviewVisible, setIsSelectionPreviewVisible] =
    useState(false);
  const [loadingFrames, setLoadingFrames] = useState(true);
  const [selectedFrames, setSelectedFrames] = useState([]);

  const [currentSelectedFrame, setCurrentSelectedFrame] = useState(null);
  const [noMoreAvailable, setNoMoreAvailable] = useState(false);

  const [nbSufixDots, setNbSufixDots] = useState(3);
  useEffect(() => {
    let handle;
    if (loadingFrames || !firstImageLoaded) {
      handle = setInterval(() => {
        setNbSufixDots((nbDots) => (nbDots % 3) + 1);
      }, 500);
    } else {
      clearInterval(handle);
      setNbSufixDots(3);
    }

    return () => {
      clearInterval(handle);
      setNbSufixDots(3);
    };
  }, [loadingFrames, firstImageLoaded]);

  useEffect(() => {
    axios
      .get(`/api/frames?video=${video}`)
      .then((response) => {
        const responseFrames = response.data.data.sort(sortFrames);
        setFrames(responseFrames);
      })
      .then(() => setLoadingFrames(false));
  }, []);

  useEffect(() => {
    if (videoRef && !loadingFrames) {
      videoRef.current.autoPlay = true;
      videoRef.current.play();
    }
  }, [loadingFrames]);

  const findClosestAvailableFrame = (currentTime) => {
    const timeDifferenceBetweenFrames = frames[1].time - frames[0].time;
    const approxFrameNumber = currentTime / timeDifferenceBetweenFrames;
    const closerToUpper =
      approxFrameNumber - Math.floor(approxFrameNumber) >= 0.5;

    let closestAvailableFrame = null;

    let frameRepresentationNumber = Math.round(approxFrameNumber);
    let step = closerToUpper ? -1 : 1;

    while (!closestAvailableFrame) {
      let frameNumber;
      if (frameRepresentationNumber >= frames.length) {
        frameNumber = frameRepresentationNumber - frames.length;
      } else if (frameRepresentationNumber < 0) {
        frameNumber = frames.length + frameRepresentationNumber;
      } else {
        frameNumber = frameRepresentationNumber;
      }

      if (
        !frames[frameNumber].sold &&
        !isFrameInCart(frames[frameNumber], selectedFramesInShoppingCart) &&
        !isFrameInCart(frames[frameNumber], selectedFrames)
      ) {
        closestAvailableFrame = frames[frameNumber];
        break;
      }

      frameRepresentationNumber += step;

      if (Math.abs(step) >= frames.length) {
        break;
      }

      step *= -1;
      step += step > 0 ? 1 : -1;
    }

    return closestAvailableFrame;
  };

  const onVideoClick = (event) => {
    if (isIOS) {
      event.preventDefault();
    }

    setIsSelectionPreviewVisible(true);
    setImageLoadingToggle(!imageLoadingToggle);

    const { currentTime } = event.target;

    if (!noMoreAvailable) {
      const closestAvailableFrame = findClosestAvailableFrame(currentTime);

      if (!closestAvailableFrame) {
        setCurrentSelectedFrame(null);
        setNoMoreAvailable(true);
        return;
      }

      const newSelectedFrames = selectedFrames.slice();
      newSelectedFrames.push(closestAvailableFrame);
      setSelectedFrames(newSelectedFrames);

      setCurrentSelectedFrame(closestAvailableFrame);
    }
  };

  const onVideoLoad = () => {
    // setLoadingVideo(false);
  };

  const removeSelectedFrame = (frameToRemove) => {
    const newSelectedFrames = selectedFrames.filter(
      (frame) => frame.frame !== frameToRemove.frame
    );
    setSelectedFrames(newSelectedFrames);
    setNoMoreAvailable(false);
  };

  const removeAllFrames = () => {
    setSelectedFrames([]);
    setNoMoreAvailable(false);
  };

  const textSuffix =
    nbSufixDots > 0 ? `${new Array(nbSufixDots + 1).join('.')}` : '';

  return (
    <div className="frame-selection">
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
        <div className="frame-selection__loading">
          Condensing your liquid poster
          <span className="frame-selection__loading--three-dots">
            {textSuffix}
          </span>
        </div>
        <div
          className={`frame-selection__container ${
            loadingFrames || !firstImageLoaded
              ? 'frame-selection__container--invisible'
              : ''
          }`}
        >
          <div className="frame-selection__inner-container">
            <CurrentFrame
              firstImageLoaded={firstImageLoaded}
              imageLoadingToggle={imageLoadingToggle}
              selectedFrame={currentSelectedFrame}
              setFirstImageLoaded={setFirstImageLoaded}
              video={video}
            />

            {video && (
              <div className="frame-selection__frame-info">
                <h2 className="selected-frame__title">
                  {VideoData[video].title}
                </h2>
                <h3 className="selected-frame__subtitle">
                  {VideoData[video].subtitle}
                </h3>
                <div className="selected-frame__price euro-price">
                  <NFTPrice />
                </div>
              </div>
            )}

            <video
              className="frame-selection__video"
              controls={isIOS}
              loop
              onClick={onVideoClick}
              onCanPlay={onVideoLoad}
              ref={videoRef}
            >
              <source src={`/vid/${VideoData[video].cleanTitle}.mp4`} />
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
                  Click on the Liquid Poster to select the frame you like. Keep
                  clicking on desired frames to select multiple.
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
          isSelectionPreviewVisible={isSelectionPreviewVisible}
          removeAllFrames={removeAllFrames}
          removeSelectedFrame={removeSelectedFrame}
          selectedFrames={selectedFrames}
          setIsSelectionPreviewVisible={setIsSelectionPreviewVisible}
        />
      </div>
    </div>
  );
}
