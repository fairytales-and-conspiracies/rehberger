import Artist from '@/components/Artist';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';
import JoinCommunity from '@/components/JoinCommunity';
import Header from '@/components/Header';
import Music from '@/components/Music';
import NFTs from '@/components/NFTs';
import Work from '@/components/Work';
import UniCryptContext from '@/context/UniCryptContext';
import { useContext, useEffect } from 'react';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function Home() {
  const { requestfetchRatePeriodically } = useContext(UniCryptContext);

  useEffect(
    () => {
      requestfetchRatePeriodically(true);
      return () => requestfetchRatePeriodically(false);
    },
    []
  )
  
  return (
    <>
      <Header />
      <main className="offset-by-header">
        <Intro />
        {!INTERIM && (
          <>
            <NFTs />
            <Work />
            <Artist />
            <Music />
            <FAQ />
            <JoinCommunity />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
