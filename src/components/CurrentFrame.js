import Image from 'next/image';

import VideoData from '@static-data/videos';

export default function CurrentFrame({ selectedFrame, video }) {
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
              src={`/img/frames/${video}/${
                selectedFrame ? selectedFrame.time : 0
              }.png`}
              width="75%"
            />
          </div>
        </div>
        <div className="selected-frame__time">
          {!!selectedFrame && (
            <>
              <div className="selected-frame__timeframe-title">Timeframe</div>
              {selectedFrame.time
                .toFixed(4)
                .toString()
                .split('')
                .map((digitOrDecimalPoint, index) => (
                  <span
                    className={`${
                      digitOrDecimalPoint !== '.'
                        ? 'selected-frame__timeframe-digit'
                        : ''
                    }`}
                    key={index}
                  >
                    {digitOrDecimalPoint}
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
          <p className="selected-frame__description">
            {VideoData[video].description}
          </p>
          <div className="selected-frame__price euro-price">€666</div>
        </div>
      )}
    </div>
  );
}
