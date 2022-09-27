import Image from 'next/image';

import NFTPrice from '@/components/NFTPrice';
import VideoData from '@/static-data/videos';
import { getFrameFileName } from '@/utils/frames';
import { padZeroes } from '@/utils/string';

const NFT_IMAGE_URL = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;
const NFT_IMAGE_EXTENSION = process.env.NEXT_PUBLIC_NFT_IMAGE_EXTENSION;

export default function CurrentFrame({ selectedFrame, video }) {
  let imageSrc;
  if (selectedFrame) {
    imageSrc =
      NFT_IMAGE_URL === '/img/frames'
        ? `${NFT_IMAGE_URL}/${video}/${selectedFrame.time}.${NFT_IMAGE_EXTENSION}`
        : `${NFT_IMAGE_URL}/${getFrameFileName(
            selectedFrame
          )}.${NFT_IMAGE_EXTENSION}`;
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
