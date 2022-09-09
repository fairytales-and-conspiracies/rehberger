import Image from 'next/image';
import Link from 'next/link';

export default function Imprint() {
  return (
    <div className="bg-primary imprint">
      <header className="imprint__header">
        <div className="imprint__logo">
          <Image
            alt="Fairytales and conspiracies"
            layout="fill"
            src="/img/fairytales-conspiracies.svg"
          />
        </div>
        <div className="imprint__back-link-container">
          <Link href="/">
            <a>← Back</a>
          </Link>
        </div>
      </header>
      <main className="imprint__main">
        <h1 className="imprint__title">
          Impr
          <br />
          int
        </h1>
        <section className="imprint__content">
          <h4 className="imprint__heading">Information according to § 5 TMG</h4>
          <p className="imprint__text">
            action press ag <br />
            Wielandstr. 3 <br />
            60318 Frankfurt am Main <br />
            ir@actionpress.de <br />
            www.actionpress.de
          </p>

          <h4 className="imprint__heading">Responsible</h4>
          <p className="imprint__text">
            Persons: Board of Directors of action press ag <br />
            Prof. Moritz Hunzinger <br />
            Ulli Michel
          </p>

          <h4 className="imprint__heading">Contact</h4>
          <p className="imprint__text">
            E-Mail: ir@actionpress.de <br />
            Register Court of Frankfurt am Main <br />
            HRB 114566 <br />
            StNr. 04522804958
          </p>

          <p className="imprint__text">
            LEI 5299002Y37DNOIMBMX46 <br />
            ISIN DE000A3ESE35 <br />
            WKN A3ESE3 <br />
            Ticker symbol AQP
          </p>

          <h4 className="imprint__heading">
            Consumer dispute resolution / universal arbitration board:
          </h4>
          <p className="imprint__text">
            We are not willing or obliged to participate in dispute resolution
            proceedings before a consumer arbitration board.
          </p>

          <h4 className="imprint__heading">Data protection</h4>
          <p className="imprint__text">
            The employees of action press ag are bound by data secrecy. The
            basis for the processing of personal data is the applicable European
            and German data protection law and the German Telemedia Act (TMG).
            In the course of establishing and maintaining the connection via the
            Internet between the visitor's computer and the infas computer
            requested, the following data is stored: Time of the server call, IP
            address, browser type, domain called up and, if the website is
            called up via a link, also the origin. This data is only collected
            for the purpose of statistical evaluation and is deleted within
            three months. No conclusion is drawn about the person of a visitor.
            infas secures its website and other systems and data by technical
            and organisational measures against loss and destruction as well as
            against access, modification or distribution by unauthorised
            persons. Website visitors have a right to free information about
            their stored personal data as well as a right to correction,
            blocking or deletion of this data, insofar as there is no legal
            obligation to retain this data. There is a right of appeal to a
            supervisory authority.
          </p>

          <h4 className="imprint__heading">Legal notice</h4>
          <p className="imprint__text">
            action press ag constantly checks and updates the information on its
            websites. Despite all due care, the data may have changed in the
            meantime. Therefore, no liability or guarantee can be assumed for
            the topicality, correctness and completeness of the information
            provided. Furthermore, action press ag reserves the right to make
            changes or additions to the information provided.
          </p>

          <h4 className="imprint__heading">Copyright</h4>
          <p className="imprint__text">
            The author permits the transfer of text and image material into data
            files intended exclusively for the private use of a user. The
            reproduction of information or data for other purposes, in
            particular the use of texts, parts of texts or image material,
            requires our written consent.
          </p>

          <h4 className="imprint__heading">Links</h4>
          <p className="imprint__text">
            You are leaving the offer of our website with some of the indicated
            links. We are not responsible for the content of external pages and
            therefore expressly distance ourselves from any content on the pages
            we link to.
          </p>

          <h4 className="imprint__heading">Webmaster</h4>
          <p className="imprint__text">ir@actionpress.de</p>

          <h4 className="imprint__heading">Picture credits</h4>
          <p className="imprint__text">action press / unsplash</p>
        </section>
      </main>
    </div>
  );
}
