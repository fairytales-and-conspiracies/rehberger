import CountdownTimer from '@/components/CountdownTimer';
import SignUp from '@/components/SignUp';
import SocialMedia from '@/components/SocialMedia';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function Home() {
  return (
    <div className={`bg-home${INTERIM ? ' bg-home--interim' : ''}`}>
      <div
        className={`bg-home__overlay${
          INTERIM ? ' bg-home__overlay--interim' : ''
        }`}
      >
        <section className="home" id="home">
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
                also delivered as a fine art digital print. I created the motifs
                from the huge image archive of action press.”
              </p>
            </div>
          </div>
          <div className="home__community">
            <SignUp signUpText="Sign up for updates and information about Fairytales & Conspiracies." />
            <div className="home__community-separator" />
            <SocialMedia />
          </div>
        </section>
      </div>
    </div>
  );
}
