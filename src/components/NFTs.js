import Image from 'next/image';
import { forwardRef, useEffect, useState } from 'react';

import FrameSelection from '@/components/FrameSelection';
import IndividualPrice from '@/components/IndividualPrice';
import IndividualPricePurple from '@/components/IndividualPricePurple';
import NFTFactsheet from '@/components/NFTFactsheet';

function Home(_, ref) {
  const [isFrameSelectionActive, setIsFrameSelectionActive] = useState(false);

  const frameSelectionOpen = () => {
    setIsFrameSelectionActive(true);
  };

  const frameSelectionClose = () => {
    setIsFrameSelectionActive(false);
  };

  if (typeof document !== 'undefined') {
    document.body.style.overflow = isFrameSelectionActive ? 'hidden' : 'auto';
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // TODO: Etherscan and IPFS links

  return (
    <>
      <div className="bg-primary">
        <section className="nfts" id="nfts" ref={ref}>
          <div className="nfts__upper-half">
            <div className="nfts__upper-half-nfts">
              <div className="nfts__nft nfts__nft-1">
                <button
                  className="nfts__nft-thumbnail nfts__nft-1-thumbnail btn btn--no-style"
                  onClick={frameSelectionOpen}
                  type="button"
                >
                  <Image
                    alt="Brick & Mortar clickable thumbnail"
                    src="/img/01-1.png"
                    layout="fill"
                  />
                  <div className="nfts__nft-number nfts__nft-1-number">
                    <Image alt="Number 1" layout="fill" src="/img/1.svg" />
                  </div>
                </button>
                <div className="nfts__nft-text nfts__nft-1-text">
                  <h4 className="nfts__nft-title">
                    HAVEYOUEVERTHOUGHTOFEMIGRATING?
                  </h4>
                  <p className="nfts__nft-description">
                    Liquid Poster No. 1<br />
                    <span className="nfts__nft-description-question">
                      Is it a place or is it a feeling?
                    </span>
                  </p>
                </div>
              </div>
              <div className="nfts__nft nfts__nft-2">
                <button
                  className="nfts__nft-thumbnail nfts__nft-2-thumbnail btn btn--no-style"
                  onClick={frameSelectionOpen}
                  type="button"
                >
                  <Image
                    alt="IMAGINEYOURSELFWITHOUTAHOME clickable thumbnail"
                    src="/img/02-1.png"
                    layout="fill"
                  />
                  <div className="nfts__nft-number nfts__nft-2-number">
                    <Image alt="Number 2" layout="fill" src="/img/2.svg" />
                  </div>
                </button>
                <div className="nfts__nft-text nfts__nft-2-text">
                  <h4 className="nfts__nft-title">
                    IMAGINEYOURSELFWITHOUTAHOME
                  </h4>
                  <p className="nfts__nft-description">
                    Liquid Poster No. 2<br />
                    <span className="nfts__nft-description-question">
                      Which came first and who is having the last laugh?
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="nfts__upper-half-right-section">
              <a href="https://etherscan.io">
                <a className="nfts__btn btn btn--primary">View on Etherscan</a>
              </a>
              <a href="https://www.pinata.cloud">
                <a className="nfts__btn btn btn--primary">View on IPFS</a>
              </a>
              <IndividualPrice />
              <IndividualPricePurple />
            </div>
          </div>
          <div className="nfts__lower-half">
            <div className="nfts__nft nfts__nft-3">
              <button
                className="nfts__nft-thumbnail nfts__nft-3-thumbnail"
                onClick={frameSelectionOpen}
                type="submit"
              >
                <Image
                  alt="HAVEYOUEVERSTOLENANIDEA? clickable thumbnail"
                  src="/img/03-1.png"
                  layout="fill"
                />
                <div className="nfts__nft-number nfts__nft-3-number">
                  <Image alt="Number 3" layout="fill" src="/img/3.svg" />
                </div>
              </button>
              <div className="nfts__nft-text nfts__nft-3-text">
                <h4 className="nfts__nft-title">HAVEYOUEVERSTOLENANIDEA?</h4>
                <p className="nfts__nft-description">
                  Liquid Poster No. 3<br />
                  <span className="nfts__nft-description-question">
                    We have a question for you
                  </span>
                </p>
              </div>
            </div>
            <div className="nfts__nft nfts__nft-4">
              <button
                className="nfts__nft-thumbnail nfts__nft-4-thumbnail btn btn--no-style"
                onClick={frameSelectionOpen}
                type="button"
              >
                <Image
                  alt="AREYOUAFRAIDOFTHEPOOR? clickable thumbnail"
                  src="/img/04-1.png"
                  layout="fill"
                />
                <div className="nfts__nft-number nfts__nft-4-number">
                  <Image alt="Number 4" layout="fill" src="/img/4.svg" />
                </div>
              </button>
              <div className="nfts__nft-text nfts__nft-4-text">
                <h4 className="nfts__nft-title">AREYOUAFRAIDOFTHEPOOR?</h4>
                <p className="nfts__nft-description">
                  Liquid Poster No. 4<br />
                  <span className="nfts__nft-description-question">
                    Can you feel the wind of change?
                  </span>
                </p>
              </div>
            </div>
            <div className="nfts__how-it-works-and-nft-5-wrapper">
              <div className="nfts__nft nfts__nft-5">
                <button
                  className="nfts__nft-thumbnail nfts__nft-5-thumbnail btn btn--no-style"
                  onClick={frameSelectionOpen}
                  type="button"
                >
                  <Image
                    alt="ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR clickable thumbnail"
                    src="/img/05-1.png"
                    layout="fill"
                  />
                  <div className="nfts__nft-number nfts__nft-5-number">
                    <Image alt="Number 5" layout="fill" src="/img/5.svg" />
                  </div>
                </button>
                <div className="nfts__nft-text nfts__nft-5-text">
                  <h4 className="nfts__nft-title">
                    ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR
                  </h4>
                  <p className="nfts__nft-description">
                    Liquid Poster No. 5<br />
                    <span className="nfts__nft-description-question">
                      Where would you go?
                    </span>
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
                  You will be taken to an external platform OpenSea.
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
      {isFrameSelectionActive && (
        <FrameSelection onClose={frameSelectionClose} />
      )}
    </>
  );
}

export default forwardRef(Home);
