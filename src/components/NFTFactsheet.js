import videos from '@/static-data/videos';

const VID1 = 'HAVEYOUEVERTHOUGHTOFEMIGRATING';
const VID2 = 'IMAGINEYOURSELFWITHOUTAHOME';
const VID3 = 'HAVEYOUEVERSTOLENANIDEA';
const VID4 = 'AREYOUAFRAIDOFTHEPOOR';
const VID5 = 'ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR';

export default function NFTFactsheet() {
  return (
    <div className="factsheet">
      <h1 className="factsheet__heading">Factsheet</h1>
      <div className="factsheet__content">
        <p className="factsheet__content-group">
          <span className="bold">
            “Fairytales & Conspiracies” by Tobias Rehberger
          </span>
        </p>
        <p className="factsheet__content-group">
          <span className="bold">
            NFT art project based on 5 different video motifs.
          </span>
          <br />
          2022
        </p>
        <p className="factsheet__content-group">
          Multimedia artworks composed of images selected by the artist from
          “action press AG” archive containing more than{' '}
          <span className="bold">160 million images</span>.<br />
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
            {videos[VID1].subtitle} - HAVEYOUEVERTHOUGHTOFEMIGRATING?
          </span>{' '}
          <span className="factsheet__number-of-frames bold">720</span>
          <br />
          <span className="factsheet__title-for-size">
            {videos[VID2].subtitle} - IMAGINEYOURSELFWITHOUTAHOME
          </span>{' '}
          <span className="factsheet__number-of-frames bold">1.080</span>
          <br />
          <span className="factsheet__title-for-size">
            {videos[VID3].subtitle} - HAVEYOUEVERSTOLENANIDEA?
          </span>{' '}
          <span className="factsheet__number-of-frames bold">540</span>
          <br />
          <span className="factsheet__title-for-size">
            {videos[VID4].subtitle} - AREYOUAFRAIDOFTHEPOOR?
          </span>{' '}
          <span className="factsheet__number-of-frames bold">720</span>
          <br />
          <span className="factsheet__title-for-size">
            {videos[VID5].subtitle} - ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR
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
              a high-resolution digital image of the selected frame of a Liquid
              Poster video clip (unique jpg-file with 7.087 x 9.449 pixels;
              equivalent to 300 dpi with an edge length of 60 x 80 cm; the file
              will be hosted on IPFS)
              <br />
              CAVEAT: If the frame you selected has already been sold, our
              algorithm will propose to you the frame closest to your initial
              selection that is still available!
            </li>
            <li className="factsheet__nft-includes-list-item">
              physical fine art paper print of the selected frame in poster
              format 59,4 x 79,4 cm (unique + signed by hand by Tobias
              Rehberger; including international shipping to buyer’s address)
            </li>
          </ul>
        </div>
        <p className="factsheet__content-group">
          <span className="factsheet__content-heading-with-bottom-margin bold">
            Technical Details:
          </span>
          <br />
          <span className="factsheet__title-for-details">Network:</span>{' '}
          <span className="factsheet__number-of-frames bold">
            Ethereum Mainnet
          </span>
          <br />
          <span className="factsheet__title-for-details">
            Smart Contract Type:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">ERC 1155</span>
          <br />
          <span className="factsheet__title-for-details">
            Hosting of Metadata:
          </span>{' '}
          <span className="factsheet__number-of-frames bold">IPFS</span>
        </p>
        <p className="factsheet__content-group">
          <span className="bold">
            IPFS hosting costs for six months are included in the NFT sales
            price. After six months responsibility for ensuring continued
            hosting passes on to the purchaser. Free IPFS hosting for private
            users up to 1 GB is available through services such as pinata.cloud
            or nft.storage.
          </span>
        </p>
        <p className="factsheet__content-group">
          <span className="bold">NFT Drop: Sep 28th, 2022 - 19:00 CET</span>
        </p>
      </div>
    </div>
  );
}
