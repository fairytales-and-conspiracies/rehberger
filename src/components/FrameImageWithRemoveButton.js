import Image from 'next/image';
import { useState } from 'react';

import VideoData from '@/static-data/videos';
import { getFrameFileName, getPaddedFrameNumber } from '@/utils/frames';

const NFT_IMAGE_URL = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;
const NFT_IMAGE_EXTENSION = process.env.NEXT_PUBLIC_NFT_IMAGE_EXTENSION;

export default function FrameImageWithRemoveButton({
  frame,
  isInShoppingCart,
  onRemoveClick,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  let imageSrc;
  if (frame) {
    imageSrc =
      NFT_IMAGE_URL === '/img/frames'
        ? `${NFT_IMAGE_URL}/${frame.video}/${frame.time}.${NFT_IMAGE_EXTENSION}`
        : `${NFT_IMAGE_URL}/${getFrameFileName(frame)}.${NFT_IMAGE_EXTENSION}`;
  }

  return (
    <span className="frame-image">
      <span
        className={`frame-image__main ${
          isInShoppingCart ? 'frame-image__main--in-shopping-cart' : ''
        }`}
      >
        <img
          alt={`${VideoData[frame.video].title} frame ${frame.frame}`}
          className="frame-image__img"
          height="100%"
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          src={imageSrc || '/img/frames/0'}
          width="75%"
        />
        <span className="frame-image__remove-container">
          <Image
            alt={`Remove frame ${frame.frame}`}
            className="frame-image__remove-icon"
            height="18px"
            onClick={() => onRemoveClick(frame)}
            src="/img/icons/trash.svg"
            width="14px"
          />
        </span>
        <span className="frame-image__remove-container--smaller-devices">
          <Image
            alt={`Remove frame ${frame.frame}`}
            className="frame-image__remove-icon"
            height="30px"
            onClick={() => onRemoveClick(frame)}
            src="/img/icons/trash.svg"
            width="24px"
          />
        </span>
      </span>
      {!isInShoppingCart && (
        <div
          className={`frame-image__info ${
            !imageLoaded ? 'frame-image__info--invisible' : ''
          }`}
        >
          <span className="frame-image__title">Frame</span>
          {getPaddedFrameNumber(frame)}
        </div>
      )}
    </span>
  );
}
