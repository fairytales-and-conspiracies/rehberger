import ArtistPagesHeader from '@/components/ArtistPagesHeader';

export default function CurrentExhibition() {
  return (
    <div className="current-exhibition bg-primary">
      <ArtistPagesHeader active="current-exhibition" />
      <div className="current-exhibition__main">
        <h1 className="current-exhibition__heading">Current exhibition</h1>
        <div className="current-exhibition__content">
          <p className="current-exhibition__text">
            <b>Current exhibitions by Tobias Rehberger</b>
            <br />
            <br />
            <b>Solo Shows:</b>
            <br />
            <br />
            “I am me (except when I pretend I am her)”
            <br />
            Galleria Continua Beijing
            <br />
            Until January 20, 2023
            <br />
            <br />
            “Tobias Rehberger”
            <br />
            Yuelai Art Musuem, Chongqing, China
            <br />
            Opening October 28, 2022
            <br />
            <br />
            <b>Group Shows:</b>
            <br />
            <br />
            “Sven Väth - It’s easy to tell what saved us from hell”
            <br />
            Momem, Museum of Modern Electronic Music, Frankfurt / Main, Germany
            <br />
            Spatial Remix by Tobias Rehberger
            <br />
            Until October 30, 2022
            <br />
            <br />
            “CRAZY”
            <br />
            Chiostro del Bramante, Rome, Italy
            <br />
            Until January 8, 2023
            <br />
            <br />
            “The Ability to Dream”
            <br />
            Galleria Continua, San Gimignano, Italy
            <br />
            Opening September 24, 2022
            <br />
            <br />
            “Monochrome Multitudes”
            <br />
            Smart Museum of Art, Chicago, USA
            <br />
            September 22, 2022 – January 8, 2023
            <br />
            <br />
            “The Voice of Things”
            <br />
            Highlights of the Centre Pompidou Collection Vol. II
            <br />
            Westbund Museum Project, Shanghai
            <br />
            Until February 5, 2023
          </p>
        </div>
      </div>
    </div>
  );
}
