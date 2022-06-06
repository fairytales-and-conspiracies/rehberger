import CountdownTimer from '@components/CountdownTimer';
import Footer from '@components/Footer';
import Header from '@components/Header';

export default function Home() {
  return (
    <div className="bg-home">
      <div className="bg-home__overlay">
        <Header />
        <main className="home">
          <CountdownTimer />
          <div className="home__website-title">
            <span className="home__website-title-layer">
              Fairytales & conspiracies
            </span>
            <span className="home__website-title-layer">
              Fairytales & conspiracies
            </span>
            <span className="home__website-title-layer">
              Fairytales & conspiracies
            </span>
          </div>
          <div className="home__red-strip">
            <div className="home__artist-info-wrapper">
              <div className="home__by-artist-info">
                by <br className="max-screen-sm-hidden" />
                Tobias <br className="max-screen-sm-hidden" />
                Rehberger
              </div>
              <p className="home__artist-statement">
                “With my blockchain based edition “Fairytales & Conspiracies”, I
                wanted to create NFTs that are more than digitally certified
                artworks. My objective was to make conceptual use of this new
                technology within the framework of references that I have built
                over the span of my career. The result brings together the new
                world of purely digital NFTs with the tangible, old world of
                fine art prints to discuss questions related to authorship,
                originality, ownership and what constitutes an artwork. Each NFT
                consists of a liquid poster, whose single elements are
                solidified by selecting an individual artwork, which is then
                also deliviered as a fine art digital print. I created the
                motifs from the huge image archive of action press.”
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
