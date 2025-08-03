import { useEffect, useReducer } from 'react';

import Loader from './utilities/Loader';
import Error from './utilities/Error';

import Header from './layouts/Header';
import Main from './layouts/Main';
import Footer from './layouts/Footer';
import StartScreen from './layouts/StartScreen';
import FinishedScreen from './layouts/FinishedScreen';

import Progress from './screen/Progress';
import Question from './screen/Question';
import NextButton from './screen/NextButton';
import Timer from './screen/Timer';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading', // loading, error, ready, active, finished
  index: 0,
  answer: null,
  points: 0,
  highscore: JSON.parse(localStorage.getItem('highscore')) || 0,
  secondsRemaining: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };

    case 'dataFailed':
      return { ...state, status: 'error' };

    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };

    case 'finished':
      const newHighscore =
        state.points > state.highscore ? state.points : state.highscore;
      localStorage.setItem('highscore', JSON.stringify(newHighscore));
      return {
        ...state,
        status: 'finished',
        highscore: newHighscore,
      };

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };

    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
      };

    default:
      throw new Error('Unknown');
  }
};

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(() => {
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data.questions }))
      .catch(() => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestion={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}

        {status === 'finished' && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
