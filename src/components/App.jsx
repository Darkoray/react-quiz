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

import { useQuiz } from './contexts/QuizContext';

export default function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen />}
        {status === 'active' && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}

        {status === 'finished' && <FinishedScreen />}
      </Main>
    </div>
  );
}
