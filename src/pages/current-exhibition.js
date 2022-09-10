import Image from 'next/image';

import ArtistPagesHeader from '@/components/ArtistPagesHeader';

export default function CurrentExhibition() {
  return (
    <div className="current-exhibition bg-primary">
      <ArtistPagesHeader active="current-exhibition" />
      <div className="current-exhibition__main">
        <h1 className="current-exhibition__heading">Current exhibition</h1>
        <div className="current-exhibition__cover">
          <Image
            alt={`Tobias Rehberger current exhibition - "I do if I don't"`}
            layout="responsive"
            width="1300"
            src="/img/current-exhibition-cover.png"
            height="600"
          />
        </div>
        <div className="current-exhibition__cover--vertical">
          <Image
            alt={`Tobias Rehberger current exhibition - "I do if I don't"`}
            layout="responsive"
            width="364"
            src="/img/current-exhibition-cover-vertical.png"
            height="676"
          />
        </div>
        <div className="current-exhibition__content">
          <p className="current-exhibition__text">
            <span>
              The Kunstmuseum Stuttgart is currently presenting a comprehensive
              exhibition devoted to the work of Tobias Rehberger.
            </span>
            <br />
            <br />
            For his sculptures, wall pictures, and installations, the artist, a
            native of Esslingen now active worldwide, makes use of various
            concepts and ideas from architecture, design or even music.
            <br />
            <br />
            Rehberger sets everyday objects and spatial structures into
            unexpected combinations, thus giving them a new interpretation.
            <br />
            <br />
            The widely acclaimed exhibition features the artist’s central work
            groups from the last three decades.
          </p>
          <div className="current-exhibition__image">
            <Image
              alt="Rehberger - Facade"
              height="800"
              layout="responsive"
              src="/img/current-exhibition-1.png"
              width="1024"
            />
          </div>
          <div className="current-exhibition__image">
            <Image
              alt="Rehberger - Sex"
              height="680"
              layout="responsive"
              src="/img/current-exhibition-2.png"
              width="1024"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
