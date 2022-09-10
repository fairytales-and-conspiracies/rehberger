import Image from 'next/image';

import ArtistPagesHeader from '@/components/ArtistPagesHeader';

export default function MediaCoverage() {
  return (
    <div className="media-coverage bg-primary">
      <ArtistPagesHeader active="media-coverage" />
      <div className="media-coverage__main">
        <h1 className="media-coverage__heading">Media & Press</h1>
        <div className="media-coverage__content-group">
          <div className="media-coverage__image">
            <Image
              alt="Media image"
              height="680"
              layout="responsive"
              src="/img/media-1.png"
              width="680"
            />
          </div>
          <div className="media-coverage__text">
            <div className="media-coverage__text-date">April 28, 2022</div>
            <div className="media-coverage__text-heading">
              The Sydney Morning Herald
            </div>
            <p className="media-coverage__text-paragraph">
              “Parts of inner-city Sydney will be bathed in artificial
              “sunshine” with the City of Sydney set to give the go-ahead to a
              $1.7 million public art installation.
            </p>
            <p className="media-coverage__text-paragraph">
              Leading German sculptor Tobias Rehberger has taken the humble lamp
              post and transformed it into a vibrant solar compass linking four
              locations in the former industrial heartland of Green Square and
              Zetland to world destinations.”
            </p>
          </div>
        </div>
        <div className="media-coverage__content-group">
          <div className="media-coverage__text no-margin">
            <div className="media-coverage__text-date">April 25, 2022</div>
            <div className="media-coverage__text-heading">
              Il Giornale Dell Arte
            </div>
            <p className="media-coverage__text-paragraph media-coverage__text-paragraph--with-separator">
              “Ecco fatto: un grande tributo a Tobias Rehberger… In mostra al
              Kunstmuseum i lavori più recenti del poliedrico artista tedesco di
              fama internazionale… La grande monografica «Lo faccio se non lo
              faccio» (I do if I don’t) che il Kunstmuseum dedica fino al 28
              agosto allo scultore, professore d’arte e poliartista tedesco di
              fama internazionale Tobias Rehberger (Esslingen am Neckar, 1966),
              presenta alcuni gruppi centrali di opere create negli ultimi
              trent’anni di attività dall’un tempo allievo di Thomas Bayrle e
              Martin Kippenberger alla scuola di Francoforte.”
            </p>
            <p className="media-coverage__text-paragraph">
              “That’s it: a great tribute to Tobias Rehberger... On show at the
              Kunstmuseum are the most recent works by the internationally
              renowned German multifaceted artist... The major monographic
              exhibition “I do if I don’t” (I do if I don’t) that the
              Kunstmuseum is dedicating until 28 August to the internationally
              renowned German sculptor, art teacher and polyartist Tobias
              Rehberger (Esslingen am Neckar, 1966), presents some central
              groups of works created over the last 30 years by the one-time
              pupil of Thomas Bayrle and Martin Kippenberger at the Frankfurt
              School.”
            </p>
          </div>
          <div className="media-coverage__image">
            <Image
              alt="Media image"
              height="680"
              layout="responsive"
              src="/img/media-2.png"
              width="680"
            />
          </div>
        </div>
        <div className="media-coverage__content-group">
          <div className="media-coverage__image">
            <Image
              alt="Media image"
              height="600"
              layout="responsive"
              src="/img/media-3.png"
              width="680"
            />
          </div>
          <div className="media-coverage__text">
            <div className="media-coverage__text-date">April 25, 2022</div>
            <div className="media-coverage__text-heading">
              Stuttgarter Nachrichten/StN+
            </div>
            <p className="media-coverage__text-paragraph media-coverage__text-paragraph--with-separator">
              “Wo fängt Kunst an, wo hört sie auf, und wie schmecken frittierte
              Austern? Ein Atelierbesuch bei Tobias Rehberger, der nun im
              Kunstmuseum Stuttgart im Fokus steht.”
            </p>
            <p className="media-coverage__text-paragraph">
              “Where does art begin, where does it end, and what do fried
              oysters taste like? A studio visit with Tobias Rehberger, who is
              now in focus at the Kunstmuseum Stuttgart.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
