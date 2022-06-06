import { useState } from 'react';

import Header from '@components/Header';

const FAQ_CONTENT = [
  {
    question: 'WHAT IS “FAIRYTALES & CONSPIRACIES”?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec
              odio aliquet, laoreet augue in, porttitor mauris. Sed tristique
              sagittis euismod. Donec venenatis egestas interdum. Aenean
              auctor nisi semper enim lacinia vulputate. Nulla ut mattis quam.
              Phasellus mattis condimentum porttitor. Integer vitae lacus
              tortor. Quisque est dui, accumsan at est ut, porta euismod sem.
              Vivamus tristique lectus at vehicula rutrum. Nullam suscipit,
              odio ut egestas pretium, urna arcu dictum sapien, quis lacinia
              eros nisl eu massa.`,
  },
  {
    question: 'WHO COMPOSED THE MUSIC?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec
              odio aliquet, laoreet augue in, porttitor mauris. Sed tristique
              sagittis euismod. Donec venenatis egestas interdum. Aenean
              auctor nisi semper enim lacinia vulputate. Nulla ut mattis quam.
              Phasellus mattis condimentum porttitor. Integer vitae lacus
              tortor. Quisque est dui, accumsan at est ut, porta euismod sem.
              Vivamus tristique lectus at vehicula rutrum. Nullam suscipit,
              odio ut egestas pretium, urna arcu dictum sapien, quis lacinia
              eros nisl eu massa.`,
  },
  {
    question: 'WHAT IS THE NFT EDITION SIZES?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec
              odio aliquet, laoreet augue in, porttitor mauris. Sed tristique
              sagittis euismod. Donec venenatis egestas interdum. Aenean
              auctor nisi semper enim lacinia vulputate. Nulla ut mattis quam.
              Phasellus mattis condimentum porttitor. Integer vitae lacus
              tortor. Quisque est dui, accumsan at est ut, porta euismod sem.
              Vivamus tristique lectus at vehicula rutrum. Nullam suscipit,
              odio ut egestas pretium, urna arcu dictum sapien, quis lacinia
              eros nisl eu massa.`,
  },
  {
    question: 'WHAT DOES EACH NFT CONTAIN?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec
              odio aliquet, laoreet augue in, porttitor mauris. Sed tristique
              sagittis euismod. Donec venenatis egestas interdum. Aenean
              auctor nisi semper enim lacinia vulputate. Nulla ut mattis quam.
              Phasellus mattis condimentum porttitor. Integer vitae lacus
              tortor. Quisque est dui, accumsan at est ut, porta euismod sem.
              Vivamus tristique lectus at vehicula rutrum. Nullam suscipit,
              odio ut egestas pretium, urna arcu dictum sapien, quis lacinia
              eros nisl eu massa.`,
  },
  {
    question: 'WHEN IS THE SALE START DATE?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec
              odio aliquet, laoreet augue in, porttitor mauris. Sed tristique
              sagittis euismod. Donec venenatis egestas interdum. Aenean
              auctor nisi semper enim lacinia vulputate. Nulla ut mattis quam.
              Phasellus mattis condimentum porttitor. Integer vitae lacus
              tortor. Quisque est dui, accumsan at est ut, porta euismod sem.
              Vivamus tristique lectus at vehicula rutrum. Nullam suscipit,
              odio ut egestas pretium, urna arcu dictum sapien, quis lacinia
              eros nisl eu massa.`,
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
      <Header />
      <main className="faq">
        <h1 className="faq__heading">FAQ</h1>
        <section className="faq__content">
          {FAQ_CONTENT.map((questionAndAnswer, index) => (
            <>
              <div
                className="faq__question"
                onClick={() => toggleExpand(index)}
              >
                {questionAndAnswer.question}
              </div>
              <p
                className={`faq__answer${
                  visibleIndex === index ? ' faq__answer--visible' : ''
                }`}
              >
                {questionAndAnswer.answer}
              </p>
            </>
          ))}
        </section>
      </main>
    </div>
  );
}
