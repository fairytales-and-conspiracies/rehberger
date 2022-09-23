import Image from 'next/image';

import NFTPrice from '@/components/NFTPrice';
import VideoData from '@/static-data/videos';
import { padZeroes } from '@/utils/string';

const NFT_IMAGE_URL = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;

export default function CurrentFrame({ selectedFrame, video }) {
  let imageSrc;
  if (selectedFrame) {
    imageSrc =
      NFT_IMAGE_URL === '/img/frames'
        ? `${NFT_IMAGE_URL}/${video}/${selectedFrame.time}.png`
        : `${NFT_IMAGE_URL}/${selectedFrame.video}_${padZeroes(
            selectedFrame.frame
          )}.png`;
  }

  return (
    <div className="selected-frame__wrapper">
      <div className="selected-frame__image-with-timeframe-container">
        <div className="selected-frame__image-frame">
          <Image
            alt="Image frame for selected video frame"
            layout="fill"
            src="/img/selected-frame.svg"
          />
          <div
            className={`selected-frame__image ${
              !selectedFrame ? 'selected-frame__image--invisible' : ''
            }`}
          >
            <Image
              alt={`${VideoData[video].title} frame ${
                selectedFrame ? selectedFrame.frame : 1
              }`}
              height="100%"
              layout="responsive"
              src={imageSrc || '/img/frames/0'}
              width="75%"
            />
          </div>
        </div>
        <div className="selected-frame__time">
          {!!selectedFrame && (
            <>
              <div className="selected-frame__timeframe-title">Frame</div>
              {padZeroes(selectedFrame.frame, 4)
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
