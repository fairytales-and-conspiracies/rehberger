export default function NFTFactsheet() {
  return (
    <div className="factsheet">
      <h1 className="factsheet__heading">Factsheet</h1>
      <div className="factsheet__content">
        <p className="factsheet__content-group">
          <span className="bold">“Fairytales and Conspiracies”</span>
        </p>
        <p className="factsheet__content-group">
          <span className="bold">5 different video motifs.</span>
          <br />
          2021
        </p>
        <p className="factsheet__content-group">
          Multimedia artworks composed of images selected by the artist from
          “action press AG” archive containing more than{' '}
          <span className="bold">150 million images</span>.<br />
          Each video motif has its{' '}
          <span className="bold">
            individual soundtrack composed by the renowned producer of
            electronic music Markus Nikolai
          </span>
          .
        </p>
        <p className="factsheet__content-group">
          <span className="factsheet__content-heading-with-bottom-margin bold">
            NFT Edition Size:
          </span>
          <br />
          <span className="factsheet__title-for-size">
            Liquid poster No.1 - “HAVEYOUEVERTHOUGHTOFEMIGRATING?”:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">720</span>
          <br />
          <span className="factsheet__title-for-size">
            Liquid poster No.2 - “IMAGINEYOURSELFWITHOUTAHOME”:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">1080</span>
          <br />
          <span className="factsheet__title-for-size">
            Liquid poster No.3 - “HAVEYOUEVERSTOLENANIDEA?”:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">540</span>
          <br />
          <span className="factsheet__title-for-size">
            Liquid poster No.4 - “AREYOUAFRAIDOFTHEPOOR?”:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">720</span>
          <br />
          <span className="factsheet__title-for-size">
            Liquid poster No.5 - “ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR”:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">720</span>
          <br />
          <span className="factsheet__title-for-size">
            Total edition size “Fairytales & Conspiracies”:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">3.750</span>
        </p>
        <div className="factsheet__content-group">
          <span className="factsheet__content-heading-with-bottom-margin bold">
            Each NFT includes:
          </span>{' '}
          <ul className="factsheet__nft-includes-list">
            <li className="factsheet__nft-includes-list-item">
              high resolution digital image of their selected frame out of a
              liquid poster video clip (unique, png file)
              <br />
              CAVEAT: If the frame you selected has already been sold, our
              algorithm will propose to you the frame closest to your initial
              selection that is still available!
            </li>
            <li className="factsheet__nft-includes-list-item">
              physical fine art paper print of their selected frame in A1 format
              (594 x 841 mm, 23.3 x 33.1 inch) size (unique + signed by hand by
              Tobias Rehberger; including an “Artoken (r)” authentification chip
              ensuring unambiguous connection of the physical print to the NFT
              entry on the Ethereum blockchain and its associated digital files
              (digital image and video incl. audio); incl. international
              shipping to buyer‘s address)
            </li>
            <li className="factsheet__nft-includes-list-item">
              the liquid poster (= video clip incl. audio) that their selected
              frame originates from (Limited Edition; total edition size 3.750;
              for edition size of each liquid poster please refer to information
              posted above)
            </li>
          </ul>
        </div>
        <p className="factsheet__content-group">
          Sales Starting Date: DD.MM.2022, 08:00 a.m. CET
        </p>
      </div>
    </div>
  );
}
