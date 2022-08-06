import Link from 'next/link';
import { useContext } from 'react';

import ShoppingCartContext from '@context/ShoppingCartContext';
import VideoData from '@static-data/videos';
import FrameImageWithRemoveButton from './FrameImageWithRemoveButton';

export default function ShoppingCartViewer({ isCheckout, setIsCheckout }) {
  const { removeFromCart, selectedFrames } = useContext(ShoppingCartContext);

  const selectedFramesByVideoMap = selectedFrames.reduce(
    (accumulator, frame) => {
      if (!accumulator.hasOwnProperty(frame.video)) {
        accumulator[frame.video] = [];
      }
      accumulator[frame.video].push(frame);
      return accumulator;
    },
    {}
  );
  const videos = Object.keys(selectedFramesByVideoMap);

  const removeFrameFromShoppingCart = (frame) => {
    removeFromCart(frame);
  };

  return (
    <div
      className={`cart-viewer${
        isCheckout ? ' cart-viewer--hidden-small-devices' : ''
      }`}
    >
      <div className="cart-viewer__top-section">
        <h1 className="cart-viewer__heading">Shopping cart</h1>
        <div className="cart-viewer__total-and-proceed-wrapper">
          <div className="cart-viewer__total">
            Total: €{selectedFrames.length * 666}
          </div>
          <button
            className="cart-viewer__proceed-small-devices btn btn--primary"
            onClick={() => setIsCheckout(true)}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
      <div className="cart-viewer__selected">
        {!!videos.length &&
          videos.map((video, index) => (
            <div className="cart-viewer__frames-for-video" key={index}>
              <div className="cart-viewer__selected-title">
                <span className="cart-viewer__selected-title-uppercase">
                  {VideoData[video].title}
                </span>{' '}
                |{' '}
                <span className="cart-viewer__selected-subtitle">
                  {VideoData[video].subtitle}
                </span>
              </div>
              {selectedFramesByVideoMap[video].map((frame) => (
                <div
                  className="cart-viewer__frame-image-container"
                  key={frame.frame}
                >
                  <FrameImageWithRemoveButton
                    frame={frame}
                    onRemoveClick={removeFrameFromShoppingCart}
                  />
                  <div className="cart-viewer__frame-image-description">
                    <div className="cart-viewer__frame-image-title">
                      {`${VideoData[video].title} - `}
                      <span className="cart-viewer__frame-image-timeframe">
                        {`Timeframe ${frame.time}`}
                      </span>
                    </div>
                    <div className="cart-viewer__frame-image-price euro-price">
                      €666
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        {!videos.length && (
          <div className="cart-viewer__empty-cart">
            Shopping cart is empty. Go to the{' '}
            <Link href={'/#nfts'}>
              <a className="link">NFT page</a>
            </Link>
            , choose a liquid poster, select your frames and then come back!
          </div>
        )}
      </div>
    </div>
  );
}
