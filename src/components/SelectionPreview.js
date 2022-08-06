import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';

import FrameImageWithRemoveButton from '@components/FrameImageWithRemoveButton';
import ShoppingCartContext from '@context/ShoppingCartContext';
import VideoData from '@static-data/videos';

export default function SelectionPreview({
  removeAllFrames,
  removeSelectedFrame,
  selectedFrames,
}) {
  const { addToCart } = useContext(ShoppingCartContext);

  const [isSelectionPreviewVisible, setIsSelectionPreviewVisible] =
    useState(false);
  const [
    haveFramesJustBeenAddedToShoppingCart,
    setHaveFramesJustBeenAddedToShoppingCart,
  ] = useState(false);

  const expandSelectionPreview = () => {
    setIsSelectionPreviewVisible(true);
  };

  const collapseSelectionPreview = () => {
    setIsSelectionPreviewVisible(false);
  };

  const onSelectedFrameRemoveClick = (frame) => {
    removeSelectedFrame(frame);
    setHaveFramesJustBeenAddedToShoppingCart(false);
  };

  const onAddToCartClick = () => {
    addToCart(selectedFrames);
    removeAllFrames();
    setHaveFramesJustBeenAddedToShoppingCart(true);
  };

  const onClearAllClick = () => {
    removeAllFrames();
    setHaveFramesJustBeenAddedToShoppingCart(false);
  };

  return (
    <div
      className={
        'selection-preview' +
        (isSelectionPreviewVisible
          ? ' selection-preview--visible'
          : ' selection-preview--hidden')
      }
    >
      <div className="selection-preview__expander-wrapper">
        <div className="selection-preview__expander-wrapper-border"></div>
        <span
          className={
            'selection-preview__expander' +
            (!isSelectionPreviewVisible
              ? ' selection-preview__expander--visible'
              : ' selection-preview__expander--hidden')
          }
          onClick={expandSelectionPreview}
        >
          <Image
            alt="Expand section showing selected frames"
            height="15"
            layout="fixed"
            src="/img/icons/chevron-left.svg"
            width="15"
          />
        </span>
        <div className="selection-preview__expander-wrapper-border"></div>
      </div>
      <div className="selection-preview__container">
        <span className="selection-preview__close">
          <Image
            alt="Close"
            height="25"
            onClick={collapseSelectionPreview}
            src="/img/icons/close.svg"
            width="25"
          />
        </span>
        <Link href="/shopping-cart">
          <a className="selection-preview__shopping-cart btn btn--primary btn--small">
            <Image
              alt="Shopping cart"
              height="20"
              src="/img/icons/shopping-cart.svg"
              width="20"
            />
          </a>
        </Link>
        <div className="selection-preview__main">
          <h2 className="selection-preview__title">Selection preview</h2>
          <div
            className={`selection-preview__selected-frames ${
              !selectedFrames.length
                ? 'selection-preview__selected-frames--no-frames'
                : ''
            }`}
          >
            {!selectedFrames.length && (
              <>
                {haveFramesJustBeenAddedToShoppingCart && (
                  <span>
                    You have added the selected frames to your shopping cart.{' '}
                    <Link href="/shopping-cart">
                      <a className="link">Check it out</a>
                    </Link>{' '}
                    or keep selecting more frames!
                  </span>
                )}
                {!haveFramesJustBeenAddedToShoppingCart &&
                  `No frames have been selected. Click on the liquid poster to
                select the frame you like.`}
              </>
            )}
            {!!selectedFrames.length &&
              selectedFrames.map((frame) => (
                <FrameImageWithRemoveButton
                  frame={frame}
                  key={frame.frame}
                  onRemoveClick={onSelectedFrameRemoveClick}
                />
              ))}
          </div>
          <button className="btn btn--primary" onClick={onAddToCartClick}>
            Add to cart
          </button>
          <button className="btn btn--secondary" onClick={removeAllFrames}>
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
