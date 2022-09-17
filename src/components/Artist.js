import Link from 'next/link';

export default function Artist() {
  return (
    <div className="bg-artist">
      <div className="anchor" id="artist" />
      <section className="artist">
        <h1 className="artist__heading">About the artist</h1>
        <div className="artist__content">
          <div className="artist__button-links">
            <Link href="/current-exhibition">
              <a className="artist__button-link btn btn--primary">
                Current exhibition
              </a>
            </Link>
            <Link href="/media-coverage">
              <a className="artist__button-link btn btn--primary">
                Media coverage
              </a>
            </Link>
          </div>
          <p className="artist__paragraph">
            Tobias Rehberger (Esslingen, 1966, lives and works in
            Frankfurt/Main) is one of the most influential and successful German
            artists of his generation. For more than 30 years, he has been
            building a consistent body of work in which he undermines artistic
            ideals such as genius and authenticity. Using strategies from many
            other fields and disciplines, Tobias Rehberger examines the meaning
            of art and what the future possibilities for art production are. The
            objects he creates are versatile and can be repeatedly adapted to
            the context in which they are meant to function. In this way,
            Rehberger’§s oeuvre evolves into an unpredictable and playful
            whirlpool of shapes and colours.
          </p>
        </div>
      </section>
    </div>
  );
}
