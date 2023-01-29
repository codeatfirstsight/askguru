import { readable, writable } from 'svelte/store';

export const languages = readable([
  {
    language: 'English',
    code: '',
    text: {
      title: 'Title',
      tags: 'Tags',
      be_specific: 'Be specific and imagine you\'re asking a question to another person.',
      title_placeholder: 'e.g. Is there an R function for finding the index of an element in a vector?',
      question_details: 'What are the details of your problem?',
      question_details_subtext: 'Introduce the problem and expand on what you put in the title. Minimum 20 characters.',
      tag_subtext: 'Add the relevant tags for your questions.',
      post_question: 'Post your question'
    }
  },
  {
    language: 'German',
    code: 'de.',
    text: {
      title: 'Titel',
      tags: 'Stichworte',
      be_specific: 'Seien Sie konkret und stellen Sie sich vor, Sie stellen einer anderen Person eine Frage.',
      title_placeholder: 'z.B. Gibt es eine R-Funktion, um den Index eines Elements in einem Vektor zu finden?',
      question_details: 'Was sind die details ihres problems?',
      question_details_subtext: 'Stellen sie das problem vor und erweitern sie den titel. Mindestens 20 zeichen.',
      tag_subtext: 'Fügen sie die relevanten tags für ihre fragen hinzu.',
      post_question: 'Poste deine frage'
    }
  }
]);

export const i18n = writable(languages[0]);