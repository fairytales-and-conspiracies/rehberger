/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

import NFTPrice from '@/components/NFTPrice';
import VideoData from '@/static-data/videos';
import { getFrameFileName } from '@/utils/frames';
import { padZeroes } from '@/utils/string';

const NFT_IMAGE_URL = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;
const NFT_IMAGE_EXTENSION = process.env.NEXT_PUBLIC_NFT_IMAGE_EXTENSION;

export default function CurrentFrame({
  firstImageLoaded,
  imageLoadingToggle,
  selectedFrame,
  setFirstImageLoaded,
  video,
}) {
  // TODO: This is a quick fix - find a more elegant solution
  const [imageLoaded, setImageLoaded] = useState(false);

  const [nbSufixDots, setNbSufixDots] = useState(3);
  useEffect(() => {
    let handle;
    if (!imageLoaded) {
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
  }, [imageLoaded]);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageLoadingToggle]);

  const textSuffix =
    nbSufixDots > 0 ? `${new Array(nbSufixDots + 1).join('.')}` : '';

  const imageSrc =
    NFT_IMAGE_URL === '/img/frames'
      ? `${NFT_IMAGE_URL}/${video}/${
          selectedFrame ? selectedFrame.time : 0
        }.${NFT_IMAGE_EXTENSION}`
      : `${NFT_IMAGE_URL}/${getFrameFileName(
          selectedFrame || { video, frame: 1 }
        )}.${NFT_IMAGE_EXTENSION}`;

  const onImageLoad = () => {
    if (!firstImageLoaded) {
      setFirstImageLoaded(true);
    }
    setImageLoaded(true);
  };

  return (
    <div className="selected-frame__wrapper">
      <div className="selected-frame__image-with-timeframe-container">
        <div className="selected-frame__image-frame">
          <img
            alt="Frame for selected video frame"
            className="selected-frame__image-frame-img"
            src="/img/selected-frame.svg"
          />
          <div
            className={`selected-frame__image ${
              !selectedFrame ? 'selected-frame__image--invisible' : ''
            }`}
          >
            {!imageLoaded && (
              <div className="selected-frame__image-img-loading">
                Solidifying
                <span className="selected-frame__image-img-loading-three-dots">
                  {textSuffix}
                </span>
              </div>
            )}

            <img
              alt={`${VideoData[video].title} #${
                selectedFrame ? selectedFrame.frame : 1
              }`}
              className={`selected-frame__image-img ${
                !imageLoaded ? 'selected-frame__image-img--invisible' : ''
              }`}
              height="100%"
              layout="responsive"
              loading="lazy"
              onLoad={onImageLoad}
              src={
                imageSrc ||
                'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
              }
              width="75%"
            />
          </div>
        </div>
        <div className="selected-frame__time">
          {!!selectedFrame && (
            <>
              <div className="selected-frame__timeframe-title">Frame</div>
              {padZeroes(
                selectedFrame.frame,
                VideoData[video].frames > 999 ? 4 : 3
              )
                .split('')
                .map((digit, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span className="selected-frame__timeframe-digit" key={index}>
                    {digit}
                  </span>
                ))}
            </>
          )}
        </div>
      </div>
      {video && (
        <div className="selected-frame__info">
          <h2 className="selected-frame__title">{VideoData[video].title}</h2>
          <h3 className="selected-frame__subtitle">
            {VideoData[video].subtitle}
          </h3>
          <div className="selected-frame__price euro-price">
            <NFTPrice />
          </div>
        </div>
      )}
    </div>
  );
}
