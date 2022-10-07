import { useState } from 'react';

const FAQ_CONTENT = [
  {
    question: 'What is an NFT?',
    answer: (
      <>
        <p className="faq__answer-paragraph">
          An NFT is a unique digital item stored on a decentralized computer
          network aka a blockchain. NFT stands for Non-Fungible Token.
        </p>

        <p className="faq__answer-paragraph">
          If an asset is fungible, it means that you can exchange it for another
          one of the same kind, and it will hold the same value. It’s
          interchangeable.
        </p>

        <p className="faq__answer-paragraph">
          Think about a two-euro coin. If you exchange it for another two-euro
          coin or two one-euro coins, you receive exactly the same value in
          turn. Or take, for example, a cryptocurrency like Bitcoin. Each token
          is an exact copy of the others; you receive the same value when you
          trade one bitcoin for another.
        </p>

        <p className="faq__answer-paragraph">
          Non-fungible assets aren’t interchangeable. Some examples from the
          physical world are a painting, a trading card, or a concert ticket.
          Note that you can’t split these assets into smaller units, unlike
          fungible ones. They’re unique.
        </p>

        <p className="faq__answer-paragraph">
          NFTs allow applying these non-fungibility characteristics in the
          digital world.
        </p>

        <p className="faq__answer-paragraph">
          NFTs can represent ownership of physical items in a digital format (=
          digital proof of ownership of physical objects). The even greater
          innovation is that NFTs can also represent rights over natively
          digital items such as digital images or digital audio files. This has
          opened up to the possibility to create unique digital items for the
          first time.
        </p>

        <p className="faq__answer-paragraph faq__answer-paragraph--no-margin-bottom">
          Each of Tobias Rehberger’s “Fairytales & Conspiracies” NFTs references
          a digital image as well as a physical fine art print on paper – thus
          exploring all capabilities of NFT technology.
        </p>
      </>
    ),
  },
  {
    question: 'How can I buy a “Fairytales & Conspiracies” NFT?',
    answer: (
      <>
        <p className="faq__answer-paragraph">
          You can acquire NFTs from Tobias Rehberger’s “Fairytales &
          Conspiracies” edition in two ways:
        </p>

        <p className="faq__answer-paragraph">
          a) Via a so-called wallet compatible with the cryptocurrency network
          Ethereum: Coinbase Wallet or MetaMask. In this case, the payment of
          your NFTs has to be conducted in the cryptocurrency ETH. You have
          purchase ETH with a credit card in the wallet itself or at a crypto
          exchange and transfer it from there to your wallet.
        </p>
        <p className="faq__answer-paragraph faq__answer-paragraph--no-margin-bottom">
          b) You can also conveniently pay for the NFTs you selected directly on
          our site with a credit card. In this case, your NFTs will be stored
          safely with us until further notice. In the confirmation email for
          your purchase, we will send you a link under which you can have us
          transfer your NFTs to your wallet free of charge at a later date, as
          soon as you have created a wallet for Ethereum NFTs.
        </p>
      </>
    ),
  },
  {
    question: 'How do I setup a wallet?',
    answer: (
      <>
        <p className="faq__answer-paragraph">
          We support the following Ethereum wallet solutions: Coinbase Wallet,
          MetaMask and WalletConnect. Of those we recommend using Coinbase
          Wallet and MetaMask. See the video links below for instructions how to
          set up and use Coinbase Wallet and MetaMask:
        </p>

        <div className="faq__answer-row">
          <span className="faq__answer-fixed-width-info">
            How to set up and use Coinbase wallet:
          </span>{' '}
          <a
            className="faq__answer-link"
            href="https://youtu.be/KMBJ5790pZk"
            rel="noreferrer"
            target="_blank"
          >
            https://youtu.be/KMBJ5790pZk
          </a>
        </div>
        <div className="faq__answer-row">
          <span className="faq__answer-fixed-width-info">
            How to set up and use MetaMask wallet:
          </span>{' '}
          <a
            className="faq__answer-link"
            href="https://youtu.be/tw-tQD0jztE"
            rel="noreferrer"
            target="_blank"
          >
            https://youtu.be/tw-tQD0jztE
          </a>
        </div>
      </>
    ),
  },
  {
    question: 'How do I fund a wallet?',
    answer: (
      <>
        <p className="faq__answer-paragraph">
          See video link below for instructions how to fund Coinbase Wallet or
          MetaMask with the cryptocurrency ETH (which you can use to buy
          “Fairytales & Conspiracies” NFTs):
        </p>

        <div className="faq__answer-row">
          <span className="faq__answer-fixed-width-info">
            How to fund a MetaMask wallet:
          </span>{' '}
          <a
            className="faq__answer-link"
            href="https://youtu.be/s_ZSuujT3Jo"
            rel="noreferrer"
            target="_blank"
          >
            https://youtu.be/s_ZSuujT3Jo
          </a>
        </div>
      </>
    ),
  },
  {
    question:
      'What do I receive as part of my “Fairytales & Conspiracies” NFT?',
    answer: (
      <>
        <p className="faq__answer-paragraph">
          Each “Fairytales & Conspiracies” NFT references both, a digital as
          well as a physical object:
        </p>

        <ul className="faq__answer-list">
          <li>
            a high-resolution digital image of the selected frame of a Liquid
            Poster video clip (unique jpg-file with 7.087 x 9.449 pixels;
            equivalent to 300 dpi with an edge length of 60 x 80 cm; the file
            will be hosted on IPFS)
          </li>

          <li>
            a physical fine art paper print of the selected frame in poster
            format 59,4 x 79,4 cm (unique + signed by hand by Tobias Rehberger;
            including international shipping to buyer’s address)
          </li>
        </ul>
      </>
    ),
  },
  {
    question:
      'Where is the digital image stored that my “Fairytales & Conspiracies” NFT references?',
    answer: (
      <p className="faq__answer-paragraph">
        All high-resolution digital images of solidified “Fairytales &
        Conspiracies” posters that are referenced by “Fairytales & Conspiracies”
        NFTs are stored on the decentralized storage solution “Inter-Planetary
        File System” (IPFS). IPFS is commonly accepted as the gold standard when
        it comes to storing NFT metadata. Unlike a centralized server that can
        be shut down by a single entity (= the owner of the server), because of
        its decentralized nature files stored on IPFS are more resilient against
        actions of a single actor.
      </p>
    ),
  },
  {
    question:
      'I cannot see my NFT in my MetaMask wallet. What do I need to do?',
    answer: (
      <>
        <ol className="faq__answer-ordered-list">
          <li>
            Click on “Import tokens” located at the bottom of the “Assets” tab
            on your wallet homepage.
          </li>

          <li>
            Switch to the “Custom token” tab at the top, and then enter the
            “Fairytales & Conspiracies” token address
            0x1D41518a2c8229b04dAd2dD24D262Af7A8b01cAD in the first field.
          </li>

          <li>The “Token Symbol” should autofill.</li>

          <li>For “Token Decimal” enter “0”.</li>

          <li>Click “Add Custom Token”</li>

          <li>
            You will now see a page asking you to confirm that you want to add
            the token. When you click “Import Tokens”, the token type will be
            added to your wallet.
          </li>
        </ol>

        <p className="faq__answer-paragraph faq__answer-paragraph--small-margin-bottom">
          For further information, please follow the links below:
        </p>

        <ul className="faq__answer-list">
          <li>
            <a
              className="faq__answer-link"
              href="https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-display-tokens-in-MetaMask#h_01FWH492CHY60HWPC28RW0872H"
            >
              https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-display-tokens-in-MetaMask#h_01FWH492CHY60HWPC28RW0872H
            </a>
          </li>
          <li>
            <a
              className="faq__answer-link"
              href="https://www.youtube.com/watch?v=lWbiYBeS7lM"
            >
              https://www.youtube.com/watch?v=lWbiYBeS7lM
            </a>
          </li>
        </ul>

        <p className="faq__answer-paragraph">
          Please note, that MetaMask currently does support receiving and
          holding ERC-1155 NFTs (the technical standard used by “Fairytales and
          Conspiracies”), however does not display these tokens flawlessly in
          the wallet UI.
        </p>
        <p className="faq__answer-paragraph">
          To make sure, your Ethereum address holds your “Fairytales &
          Conspiracies” NFT we recommend looking up your public Ethereum address
          on Etherscan and checking your balance under “Erc1155 token
          transactions”. Your correct token balance will be displayed there.
        </p>
      </>
    ),
  },
  {
    question:
      'How do I transfer my „Fairytales & Conspiracies“ NFT to another address?',
    answer: (
      <>
        <p className="faq__answer-paragraph">
          “Fairytales & Conspiracies” is an NFT edition on the Ethereum
          blockchain using the latest and most advanced technical standard for
          NFTs ERC-1155.
        </p>

        <p className="faq__answer-paragraph">
          At the moment several wallets such as MetaMask allow for ERC-1155
          tokens to be received and held, but don’t support sending these NFTs
          to other Ethereum addresses yet.
        </p>

        <p className="faq__answer-paragraph">
          To send “Fairytales & Conspiracies” NFTs to another Ethereum address,
          the easiest option is to connect your MetaMask or Coinbase Wallet
          browser extension to the NFT marketplace OpenSea (
          <a className="faq__answer-link" href="https://www.opensea.io">
            www.opensea.io
          </a>
          ) and use its functionality OpenSea transfer.
        </p>

        <p className="faq__answer-paragraph faq__answer-paragraph--small-margin-bottom">
          To transfer an NFT using OpenSea transfer function please follow the
          steps described in the link below:
        </p>

        <ul className="faq__answer-list">
          <li>
            <a className="faq__answer-link">
              https://cryptochronicle.io/how-to-transfer-your-nfts-on-opensea/
            </a>
          </li>
        </ul>
      </>
    ),
  },
];

export default function FAQ() {
  const [visibleIndex, setVisibleIndex] = useState(-1);

  const toggleExpand = (index) => {
    if (visibleIndex === index) {
      setVisibleIndex(-1);
    } else {
      setVisibleIndex(index);
    }
  };

  return (
    <div className="bg-light">
      <div className="anchor" id="faq" />
      <section className="faq">
        <h1 className="faq__heading">FAQ</h1>
        <div className="faq__content">
          {FAQ_CONTENT.map((questionAndAnswer, index) => (
            <div className="faq__question" key={questionAndAnswer.question}>
              <button
                className="faq__question-btn btn"
                onClick={() => toggleExpand(index)}
                type="button"
              >
                {questionAndAnswer.question}
              </button>
              <div
                className={`faq__answer${
                  visibleIndex === index ? ' faq__answer--visible' : ''
                }`}
              >
                {questionAndAnswer.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
