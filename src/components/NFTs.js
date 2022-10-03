import Image from 'next/image';
import { forwardRef, useEffect, useState } from 'react';

import FrameSelection from '@/components/FrameSelection';
import IndividualPrice from '@/components/IndividualPrice';
import IndividualPricePurple from '@/components/IndividualPricePurple';
import NFTFactsheet from '@/components/NFTFactsheet';
import videos from '@/static-data/videos';
import { address } from '@/contract/FairytalesAndConspiracies';

function Home(_, ref) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const frameSelectionOpen = (video) => {
    setSelectedVideo(video);
  };

  const frameSelectionClose = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    if (selectedVideo) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [selectedVideo]);

  return (
    <>
      <div className="bg-primary">
        <div className="anchor" id="nfts" />
        <section className="nfts" ref={ref}>
          <div className="nfts__upper-half">
            <div className="nfts__upper-half-nfts">
              <div className="nfts__nft nfts__n§ft-1">
                <button
                  className="nfts__nft-thumbnail nfts__nft-1-thumbnail btn btn--no-style"
                  onClick={() =>
                    frameSelectionOpen(
                      videos.HAVEYOUEVERTHOUGHTOFEMIGRATING.cleanTitle
                    )
                  }
                  type="button"
                >
                  <Image
                    alt="HAVEYOUEVERTHOUGHTOFEMIGRATING? clickable thumbnail"
                    src="/img/01-1.png"
                    layout="fill"
                  />
                </button>
                <div className="nfts__nft-number nfts__nft-1-number">
                  <Image alt="Number 1" layout="fill" src="/img/1.svg" />
                </div>
                <div className="nfts__nft-text nfts__nft-1-text">
                  <h4 className="nfts__nft-title">
                    {videos.HAVEYOUEVERTHOUGHTOFEMIGRATING.title}
                  </h4>
                  <p className="nfts__nft-description">
                    {videos.HAVEYOUEVERTHOUGHTOFEMIGRATING.subtitle}
                    <br />
                  </p>
                </div>
              </div>
              <div className="nfts__nft nfts__nft-2">
                <button
                  className="nfts__nft-thumbnail nfts__nft-2-thumbnail btn btn--no-style"
                  onClick={() =>
                    frameSelectionOpen(
                      videos.IMAGINEYOURSELFWITHOUTAHOME.cleanTitle
                    )
                  }
                  type="button"
                >
                  <Image
                    alt="IMAGINEYOURSELFWITHOUTAHOME clickable thumbnail"
                    src="/img/02-1.png"
                    layout="fill"
                  />
                </button>
                <div className="nfts__nft-number nfts__nft-2-number">
                  <Image alt="Number 2" layout="fill" src="/img/2.svg" />
                </div>
                <div className="nfts__nft-text nfts__nft-2-text">
                  <h4 className="nfts__nft-title">
                    {videos.IMAGINEYOURSELFWITHOUTAHOME.title}
                  </h4>
                  <p className="nfts__nft-description">
                    {videos.IMAGINEYOURSELFWITHOUTAHOME.subtitle}
                    <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="nfts__upper-half-right-section">
              <a
                className="nfts__btn btn btn--primary"
                target="_blank"
                href={`https://etherscan.io/address/${address}`}
                rel="noopener noreferrer"
              >
                View on Etherscan
              </a>
              <a
                className="nfts__btn btn btn--primary"
                target="_blank"
                href="https://ipfs.io/ipfs/QmSPanAWoBXX4cZeVPi2yTrqfcydYLgNGGhaeMhj7xThdd"
                rel="noopener noreferrer"
              >
                View on IPFS
              </a>
              <IndividualPrice />
              <IndividualPricePurple />
            </div>
          </div>
          <div className="nfts__lower-half">
            <div className="nfts__nft nfts__nft-3">
              <button
                className="nfts__nft-thumbnail nfts__nft-3-thumbnail"
                onClick={() =>
                  frameSelectionOpen(videos.HAVEYOUEVERSTOLENANIDEA.cleanTitle)
                }
                type="submit"
              >
                <Image
                  alt="HAVEYOUEVERSTOLENANIDEA? clickable thumbnail"
                  src="/img/03-1.png"
                  layout="fill"
                />
              </button>
              <div className="nfts__nft-number nfts__nft-3-number">
                <Image alt="Number 3" layout="fill" src="/img/3.svg" />
              </div>
              <div className="nfts__nft-text nfts__nft-3-text">
                <h4 className="nfts__nft-title">
                  {videos.HAVEYOUEVERSTOLENANIDEA.title}
                </h4>
                <p className="nfts__nft-description">
                  {videos.HAVEYOUEVERSTOLENANIDEA.subtitle}
                  <br />
                </p>
              </div>
            </div>
            <div className="nfts__nft nfts__nft-4">
              <button
                className="nfts__nft-thumbnail nfts__nft-4-thumbnail btn btn--no-style"
                onClick={() =>
                  frameSelectionOpen(videos.AREYOUAFRAIDOFTHEPOOR.cleanTitle)
                }
                type="button"
              >
                <Image
                  alt="AREYOUAFRAIDOFTHEPOOR? clickable thumbnail"
                  src="/img/04-1.png"
                  layout="fill"
                />
              </button>
              <div className="nfts__nft-number nfts__nft-4-number">
                <Image alt="Number 4" layout="fill" src="/img/4.svg" />
              </div>
              <div className="nfts__nft-text nfts__nft-4-text">
                <h4 className="nfts__nft-title">
                  {videos.AREYOUAFRAIDOFTHEPOOR.title}
                </h4>
                <p className="nfts__nft-description">
                  {videos.AREYOUAFRAIDOFTHEPOOR.subtitle}
                  <br />
                </p>
              </div>
            </div>
            <div className="nfts__how-it-works-and-nft-5-wrapper">
              <div className="nfts__nft nfts__nft-5">
                <button
                  className="nfts__nft-thumbnail nfts__nft-5-thumbnail btn btn--no-style"
                  onClick={() =>
                    frameSelectionOpen(
                      videos.ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR
                        .cleanTitle
                    )
                  }
                  type="button"
                >
                  <Image
                    alt="ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR clickable thumbnail"
                    src="/img/05-1.png"
                    layout="fill"
                  />
                </button>
                <div className="nfts__nft-number nfts__nft-5-number">
                  <Image alt="Number 5" layout="fill" src="/img/5.svg" />
                </div>
                <div className="nfts__nft-text nfts__nft-5-text">
                  <h4 className="nfts__nft-title">
                    {videos.ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR.title}
                  </h4>
                  <p className="nfts__nft-description">
                    {videos.ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR.subtitle}
                    <br />
                  </p>
                </div>
              </div>
              <div className="nfts__how-it-works">
                <h2 className="nfts__how-it-works-title">How it works</h2>
                <p className="nfts__how-it-works-step">
                  Select the liquid poster.
                </p>
                <p className="nfts__how-it-works-step">
                  Click the liquid poster on the frames you like the most.
                </p>
                <p className="nfts__how-it-works-step">
                  If the frame you selected has been sold, the algorithm will
                  propose the next closest selection to yours that is still
                  available.
                </p>
                <p className="nfts__how-it-works-step">
                  You will be taken to an external payment platform Stripe.
                </p>
                <p className="nfts__how-it-works-step">
                  Complete purchasing your NFT.
                </p>
              </div>
            </div>
          </div>
          <NFTFactsheet />
        </section>
      </div>
      {selectedVideo && (
        <FrameSelection onClose={frameSelectionClose} video={selectedVideo} />
      )}
    </>
  );
}

export default forwardRef(Home);
