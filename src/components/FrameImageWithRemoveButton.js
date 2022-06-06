import Image from 'next/image';

import VideoData from '@static-data/videos';

export default function FrameImageWithRemoveButton({ frame, onRemoveClick }) {
  return (
    <span className="frame-image">
      <Image
        alt={`${VideoData[frame.video].title} frame ${frame.frame}`}
        height="100%"
        layout="responsive"
        src={`/img/frames/${frame.video}/${frame.time}.png`}
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
    </span>
  );
}
