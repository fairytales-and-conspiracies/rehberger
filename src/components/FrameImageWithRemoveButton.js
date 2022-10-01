import Image from 'next/image';
import { useEffect, useState } from 'react';

import useThreeDots from '@/hooks/ThreeDots';
import VideoData from '@/static-data/videos';
import { getFrameFileName } from '@/utils/frames';

const NFT_IMAGE_URL = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;
const NFT_IMAGE_EXTENSION = process.env.NEXT_PUBLIC_NFT_IMAGE_EXTENSION;

export default function FrameImageWithRemoveButton({
  frame,
  isInShoppingCart,
  onRemoveClick,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { dots, setDotsState } = useThreeDots();

  useEffect(() => {
    setDotsState(!imageLoaded);
  }, [imageLoaded]);

  let imageSrc;
  if (frame) {
    imageSrc =
      NFT_IMAGE_URL === '/img/frames'
        ? `${NFT_IMAGE_URL}/${frame.video}/${frame.time}.${NFT_IMAGE_EXTENSION}`
        : `${NFT_IMAGE_URL}/${getFrameFileName(frame)}.${NFT_IMAGE_EXTENSION}`;
  }

  return (
    <span
      className={`frame-image ${
        isInShoppingCart ? 'frame-image--in-shopping-cart' : ''
      }`}
    >
      {dots && (
        <div
          className={`frame-image__loading frame-image__loading ${
            isInShoppingCart ? 'frame-image__loading--in-shopping-cart' : ''
          }`}
        >
          <span className="frame-image__loading-dots">{dots}</span>
        </div>
      )}
      <Image
        alt={`${VideoData[frame.video].title} frame ${frame.frame}`}
        height="100%"
        layout="responsive"
        onLoadingComplete={() => setImageLoaded(true)}
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
  );
}
