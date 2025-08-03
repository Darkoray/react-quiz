function FinishedScreen({ points, maxPossiblePoints, highscore, dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;
  const { emoji, text } =
    percentage === 100
      ? { emoji: '🥇', text: 'Nice! Play Again?' }
      : percentage >= 80
      ? { emoji: '🥈', text: 'Almost! Try Again?' }
      : percentage >= 50
      ? { emoji: '🥉', text: 'Good Try! Give It Another Shot' }
      : percentage > 20
      ? { emoji: '🎉', text: 'Let’s Go Again!' }
      : { emoji: '🤨', text: 'Start Over...' };

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{' '}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>
        {text}
      </button>
    </>
  );
}

export default FinishedScreen;
