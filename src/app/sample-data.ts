import { question } from './utils';

const questions: question[] = [
  {
    question: 'Wer sind Sie?',
    questionInternalName: 'hello1',
    type: 'Text',
    options: [],
  },
  {
    question: 'Welche dieser Marken kennen Sie nicht?',
    questionInternalName: 'hello2',
    type: 'MultiChoice',
    options: ['Marke X', 'Marke Y', 'Marke Z'],
  },
  {
    question: 'Wohin gehen Sie?',
    questionInternalName: 'hello2',
    type: 'Choice',
    options: ['Nach Hause', 'Nach Hamburg', 'Ganz weit weg'],
  },
];

export { questions };
