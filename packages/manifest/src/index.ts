import type { AiConfig, ElementMocks } from '@tailor-cms/cek-common';
import { pick, times } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'MULTIPLE_CHOICE';

// Display name (e.g. shown to the author)
export const name = 'Multiple Choice';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (config): ElementData => {
  const isGradable = config?.isGradable ?? true;
  return {
    isGradable,
    embeds: {},
    question: [],
    answers: ['', '', '', ''],
    hint: '',
    feedback: {},
    ...(isGradable && { correct: [] }),
  };
};

// Can be loaded from package.json
export const version = '1.0';

export const isEmpty = (data: ElementData): boolean =>
  !data.question?.length ||
  !(data.answers ?? []).some((answer) => !!answer?.trim());

export const mocks: ElementMocks = {
  displayContexts: [
    { name: 'No answer', data: {} },
    {
      name: 'Correct answer',
      data: { response: [0], isCorrect: true, isSubmitted: true },
    },
    {
      name: 'Wrong answer',
      data: { response: [1], isCorrect: false, isSubmitted: true },
    },
  ],
};

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-order-bool-ascending-variant',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const ai: AiConfig = {
  Schema: {
    type: 'json_schema',
    name: 'ce_multiple_choice',
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string' },
        answers: { type: 'array', items: { type: 'string' } },
        correct: { type: 'array', items: { type: 'integer' } },
        feedback: {
          type: 'object',
          // OpenAI does not support pattern properties
          properties: times(4).reduce(
            (acc, it) => ({ ...acc, [it]: { type: 'string' } }),
            {},
          ),
          required: times(4, String),
          additionalProperties: false,
        },
        hint: { type: 'string' },
      },
      required: ['question', 'answers', 'correct', 'feedback', 'hint'],
      additionalProperties: false,
    },
  },
  getPrompt: () => `
    Generate multiple choice question as an object with the following properties:
    {
      "question": "",
      "correct": [],
      "answers": [],
      "hint": "",
      "feedback": {}
    }
    where:
      - 'question' is the question prompt
      - 'answers' is an array of possible answers. Define 4 possible answers.
      - 'correct' is an array of indexes of the correct answers (one or more
        answers can be correct)
      - 'hint' is an optional hint for the correct solution
      - 'feedback' is an object with feedback for each answer, using indexes as
        keys. Feedback is optional and should provide more information
        about the answers.
  `,
  processResponse: (val: any = {}) => {
    const questionId = uuid();
    const question = {
      id: questionId,
      data: { content: val.question },
      embedded: true,
      position: 1,
      type: 'TIPTAP_HTML',
    };
    return {
      isGradable: true,
      ...pick(val, ['correct', 'answers', 'hint', 'feedback']),
      question: [questionId],
      embeds: { [questionId]: question },
    };
  },
};

const manifest: ElementManifest = {
  type,
  version,
  name,
  isComposite: true,
  isQuestion: true,
  showAnswerFeedback: true,
  ssr: false,
  initState,
  isEmpty,
  ui,
  ai,
  mocks,
};

export default manifest;
export * from './interfaces';
