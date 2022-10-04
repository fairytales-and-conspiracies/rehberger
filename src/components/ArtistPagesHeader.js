import Link from 'next/link';

export default function ArtistPagesHeader(props) {
  const { active } = props;

  return (
    <header className="artist-header">
      <Link href="/current-exhibition">
        <a
          className={`artist-header__link ${
            active === 'current-exhibition' ? 'artist-header__link--active' : ''
          }`}
        >
          Current exhibitions
        </a>
      </Link>
      <Link href="/media-coverage">
        <a
          className={`artist-header__link ${
            active === 'media-coverage' ? 'artist-header__link--active' : ''
          }`}
        >
          Media coverage
        </a>
      </Link>
      <Link href="/#artist">
        <a className="artist-header__link">
          <span className="artist-header__back-arrow">←</span> Back
        </a>
      </Link>
    </header>
  );
}
