import Link from 'next/link';
import { useContext } from 'react';

import ShoppingCartContext from '@context/ShoppingCartContext';
import VideoData from '@static-data/videos';
import FrameImageWithRemoveButton from './FrameImageWithRemoveButton';

export default function ShoppingCartViewer() {
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
    <div className="cart-viewer">
      <h1 className="cart-viewer__heading">Shopping cart</h1>
      <div className="cart-viewer__selected">
        {!!videos.length &&
          videos.map((video, index) => (
            <>
              <div className="cart-viewer__selected-title" key={index}>
                {`${VideoData[video].title} | ${VideoData[video].subtitle}`}
              </div>
              {selectedFramesByVideoMap[video].map((frame) => (
                <FrameImageWithRemoveButton
                  frame={frame}
                  key={frame.frame}
                  onRemoveClick={removeFrameFromShoppingCart}
                />
              ))}
            </>
          ))}
        {!videos.length && (
          <div className="cart-viewer__empty-cart">
            Shopping cart is empty. Go to the{' '}
            <Link href={'/nfts'}>
              <a className="link">NFT page</a>
            </Link>
            , play a liquid poster, select your frames and then come back!
          </div>
        )}
      </div>
    </div>
  );
}
