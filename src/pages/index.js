import Artist from '@components/Artist';
import FAQ from '@components/FAQ';
import Footer from '@components/Footer';
import Intro from '@components/Intro';
import Header from '@components/Header';
import Music from '@components/Music';
import NFTs from '@components/NFTs';
import Work from '@components/Work';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM == 'true';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Intro />
        {!INTERIM && (
          <>
            <Work />
            <Artist />
            <Music />
            <FAQ />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
