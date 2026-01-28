import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [allItems, setAllItems] = useState([]);
  const [targetItem, setTargetItem] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [background, setBackground] = useState('');

  useEffect(() => {
    const backgrounds = [
      'Login_background_(old).png',
      'Login_background_(Farming).png',
      'Login_background_(Construction).png',
      'Login_background_(Hunter).png',
      'Login_background_(Halloween).png',
      'Login_background_(Halloween_2019).png',
      'Login_background_(Christmas_Old).png',
      'Login_background_(Monkey_Madness_II).png',
      'Login_background_(Chambers_of_Xeric).png',
      'Login_background_(The_Inferno).png',
      'Login_background_(Fossil_Island).png',
      'Login_background_(Dragon_Slayer_II).png',
      'Login_background_(Theatre_of_Blood).png',
      'Login_background_(Kebos_Lowlands).png',
      'Login_background_(Song_of_the_Elves).png',
      'Login_background_(Sins_of_the_Father).png',
      'Login_background_(A_Kingdom_Divided).png',
      'Login_background_(Nex).png',
      'Login_background_(Shattered_Relics_League).png',
      'Login_background_(Tombs_of_Amascut).png',
      'Login_background_(Desert_Treasure_II_-_The_Fallen_Empire).png',
      'Login_background_(Varlamore).png',
      'Login_background_(While_Guthix_Sleeps).png',
      'Login_background_(Varlamore_The_Rising_Darkness).png',
      'Login_background_(Yama).png',
      'Login_background_(Varlamore_The_Final_Dawn).png',
      'Login_background_(Sailing).png'
    ];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const encodedPath = encodeURI(`${process.env.PUBLIC_URL}/Login_backgrounds/${randomBg}`);
    console.log('Selected background:', randomBg);
    console.log('Encoded path:', encodedPath);
    setBackground(encodedPath);

    Promise.all([
      fetch('https://raw.githubusercontent.com/0xNeffarion/osrsreboxed-db/master/docs/items-complete.json').then(r => r.json()),
      fetch('https://prices.runescape.wiki/api/v1/osrs/latest').then(r => r.json()),
      fetch('https://prices.runescape.wiki/api/v1/osrs/volumes').then(r => r.json())
    ])
      .then(([itemData, priceData, volumeData]) => {
        const prices = priceData.data;
        const volumes = volumeData.data;
        // Filter to tradeable items and merge with live GE prices
        const tradeable = Object.values(itemData)
          .filter(item => item.tradeable_on_ge && item.name && !item.noted && !item.placeholder)
          .map(item => ({
            ...item,
            ge_price: prices[item.id]?.high ?? null,
            volume: volumes[item.id] ?? 0
          }))
          .filter(item => {
            // Keep if volume >= 400 OR price >= 100k (expensive rare items)
            const hasVolume = item.volume >= 400;
            const isExpensive = item.ge_price >= 100000;
            if (!hasVolume && !isExpensive) return false;

            // Remove potion doses under 4: "(1)", "(2)", "(3)"
            if (/\([1-3]\)$/.test(item.name)) return false;

            // Remove broken Barrows items
            if (item.name.includes(' 0')) return false;

            return true;
          });
        setAllItems(tradeable);
        const randomIndex = Math.floor(Math.random() * tradeable.length);
        setTargetItem(tradeable[randomIndex]);
        console.log('Answer:', tradeable[randomIndex].name);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  const suggestions = inputValue.length > 1
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !guesses.find(g => g.id === item.id)
      ).slice(0, 8)
    : [];

  const handleGuess = (item) => {
    if (guesses.find(g => g.id === item.id)) return;
    setGuesses([...guesses, item]);
    setInputValue('');
    if (item.id === targetItem.id) setGameWon(true);
  };

  const getIndicator = (guessVal, targetVal) => {
    if (guessVal === targetVal) return { match: true };
    if (guessVal < targetVal) return { match: false, arrow: '↑' };
    return { match: false, arrow: '↓' };
  };

  const getYear = (dateStr) => {
    if (!dateStr) return 0;
    return new Date(dateStr).getFullYear();
  };

  const renderGuessRow = (guess) => {
    const geValue = getIndicator(guess.ge_price, targetItem.ge_price);
    const volume = getIndicator(guess.volume, targetItem.volume);
    const weight = getIndicator(guess.weight, targetItem.weight);
    const buyLimit = getIndicator(guess.buy_limit, targetItem.buy_limit);
    const releaseYear = getIndicator(getYear(guess.release_date), getYear(targetItem.release_date));

    const guessEquippable = !!guess.equipment?.slot;
    const targetEquippable = !!targetItem.equipment?.slot;
    const equippableMatch = guessEquippable === targetEquippable;

    const guessSlot = guess.equipment?.slot || null;
    const targetSlot = targetItem.equipment?.slot || null;
    let slotClass, slotText;
    if (guessSlot && targetSlot) {
      slotClass = guessSlot === targetSlot ? 'correct' : 'partial';
      slotText = guessSlot;
    } else if (!guessSlot && !targetSlot) {
      slotClass = 'correct';
      slotText = '-';
    } else {
      slotClass = 'wrong';
      slotText = guessSlot || '-';
    }

    return (
      <div key={guess.id} className="guess-row">
        <div className="cell item-cell">
          <img
            src={`data:image/png;base64,${guess.icon}`}
            alt={guess.name}
            className="item-icon"
          />
          {guess.name}
        </div>
        <div className={`cell ${geValue.match ? 'correct' : 'wrong'}`}>
          {guess.ge_price?.toLocaleString()} gp {!geValue.match && geValue.arrow}
        </div>
        <div className={`cell ${volume.match ? 'correct' : 'wrong'}`}>
          {guess.volume?.toLocaleString()} {!volume.match && volume.arrow}
        </div>
        <div className={`cell ${weight.match ? 'correct' : 'wrong'}`}>
          {guess.weight} kg {!weight.match && weight.arrow}
        </div>
        <div className={`cell ${equippableMatch ? 'correct' : 'wrong'}`}>
          {guessEquippable ? 'Yes' : 'No'}
        </div>
        <div className={`cell ${slotClass}`}>
          {slotText}
        </div>
        <div className={`cell ${buyLimit.match ? 'correct' : 'wrong'}`}>
          {guess.buy_limit} {!buyLimit.match && buyLimit.arrow}
        </div>
        <div className={`cell ${releaseYear.match ? 'correct' : 'wrong'}`}>
          {getYear(guess.release_date)} {!releaseYear.match && releaseYear.arrow}
        </div>
      </div>
    );
  };

  if (loading) return <div className="App"><header className="App-header"><p>Loading items...</p></header></div>;

  // console.log('Rendering with background:', background);
  // console.log('Full CSS url:', `url(${background})`);

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundImage: `url("${background}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="game-container">
          <h1>Scapedle</h1>

          {gameWon ? (
            <div className="win-message">
              <h2>You got it! {targetItem.name}</h2>
              <p>Guesses: {guesses.length}</p>
            </div>
          ) : (
            <div className="search-container">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Guess an item..."
              />
              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map(item => (
                    <div key={item.id} className="suggestion" onClick={() => handleGuess(item)}>
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {guesses.length > 0 && (
            <div className="guess-table">
              <div className="guess-row header">
                <div className="cell item-cell">Item</div>
                <div className="cell">GE Value</div>
                <div className="cell">Volume</div>
                <div className="cell">Weight</div>
                <div className="cell">Equippable</div>
                <div className="cell">Slot</div>
                <div className="cell">Buy Limit</div>
                <div className="cell">Released</div>
              </div>
              {guesses.map(renderGuessRow)}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
