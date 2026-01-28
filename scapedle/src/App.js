import { useState, useEffect } from 'react';
import './App.css';

// Seeded random number generator using date string
const seededRandom = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function App() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [gameMode, setGameMode] = useState('daily');

  // Daily mode state
  const [dailyTarget, setDailyTarget] = useState(null);
  const [dailyGuesses, setDailyGuesses] = useState([]);
  const [dailyWon, setDailyWon] = useState(false);

  // Unlimited mode state
  const [unlimitedTarget, setUnlimitedTarget] = useState(null);
  const [unlimitedGuesses, setUnlimitedGuesses] = useState([]);
  const [unlimitedWon, setUnlimitedWon] = useState(false);

  useEffect(() => {
    // Randomly select a background class
    const backgroundClasses = [
      'bg-old', 'bg-farming', 'bg-construction', 'bg-hunter', 'bg-halloween',
      'bg-halloween-2019', 'bg-christmas-old', 'bg-monkey-madness', 'bg-chambers',
      'bg-inferno', 'bg-fossil-island', 'bg-dragon-slayer', 'bg-tob', 'bg-kebos',
      'bg-sote', 'bg-sins', 'bg-kingdom-divided', 'bg-nex', 'bg-shattered-relics',
      'bg-toa', 'bg-dt2', 'bg-varlamore', 'bg-wgs', 'bg-varlamore-rising',
      'bg-yama', 'bg-varlamore-final', 'bg-sailing'
    ];
    const randomClass = backgroundClasses[Math.floor(Math.random() * backgroundClasses.length)];
    document.querySelector('.App-header').classList.add(randomClass);

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

            // Remove god book pages (e.g., "Ancient page 1", "Bandos page 2")
            if (/page [1-4]$/i.test(item.name)) return false;

            return true;
          });

        setAllItems(tradeable);

        // Set daily target using seeded random
        const today = getTodayString();
        const dailyIndex = seededRandom(today) % tradeable.length;
        setDailyTarget(tradeable[dailyIndex]);
        console.log('Daily Answer:', tradeable[dailyIndex].name);

        // Set unlimited target randomly
        const unlimitedIndex = Math.floor(Math.random() * tradeable.length);
        setUnlimitedTarget(tradeable[unlimitedIndex]);
        console.log('Unlimited Answer:', tradeable[unlimitedIndex].name);

        // Load daily progress from localStorage
        const savedDate = localStorage.getItem('scapedle-daily-date');
        if (savedDate === today) {
          const savedGuessIds = JSON.parse(localStorage.getItem('scapedle-daily-guesses') || '[]');
          const savedWon = localStorage.getItem('scapedle-daily-won') === 'true';
          const restoredGuesses = savedGuessIds
            .map(id => tradeable.find(item => item.id === id))
            .filter(Boolean);
          setDailyGuesses(restoredGuesses);
          setDailyWon(savedWon);
        } else {
          // New day - clear old data
          localStorage.setItem('scapedle-daily-date', today);
          localStorage.setItem('scapedle-daily-guesses', '[]');
          localStorage.setItem('scapedle-daily-won', 'false');
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  // Get current mode's state
  const targetItem = gameMode === 'daily' ? dailyTarget : unlimitedTarget;
  const guesses = gameMode === 'daily' ? dailyGuesses : unlimitedGuesses;
  const gameWon = gameMode === 'daily' ? dailyWon : unlimitedWon;

  const suggestions = inputValue.length > 1
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !guesses.find(g => g.id === item.id)
      ).slice(0, 8)
    : [];

  const handleGuess = (item) => {
    if (guesses.find(g => g.id === item.id)) return;

    if (gameMode === 'daily') {
      const newGuesses = [...dailyGuesses, item];
      setDailyGuesses(newGuesses);
      localStorage.setItem('scapedle-daily-guesses', JSON.stringify(newGuesses.map(g => g.id)));

      if (item.id === dailyTarget.id) {
        setDailyWon(true);
        localStorage.setItem('scapedle-daily-won', 'true');
      }
    } else {
      const newGuesses = [...unlimitedGuesses, item];
      setUnlimitedGuesses(newGuesses);

      if (item.id === unlimitedTarget.id) {
        setUnlimitedWon(true);
      }
    }

    setInputValue('');
  };

  const handlePlayAgain = () => {
    const randomIndex = Math.floor(Math.random() * allItems.length);
    setUnlimitedTarget(allItems[randomIndex]);
    setUnlimitedGuesses([]);
    setUnlimitedWon(false);
    console.log('New Unlimited Answer:', allItems[randomIndex].name);
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="game-container">
          <h1>Scapedle</h1>

          <div className="tab-container">
            <button
              className={`tab ${gameMode === 'daily' ? 'active' : ''}`}
              onClick={() => setGameMode('daily')}
            >
              Daily
            </button>
            <button
              className={`tab ${gameMode === 'unlimited' ? 'active' : ''}`}
              onClick={() => setGameMode('unlimited')}
            >
              Unlimited
            </button>
          </div>

          {gameWon ? (
            <div className="win-message">
              <h2>
                You got it!{' '}
                <img
                  src={`data:image/png;base64,${targetItem.icon}`}
                  alt={targetItem.name}
                  className="item-icon"
                />
                {targetItem.name}
              </h2>
              <p>Guesses: {guesses.length}</p>
              {gameMode === 'unlimited' && (
                <button className="play-again-btn" onClick={handlePlayAgain}>
                  Play Again
                </button>
              )}
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
                <div className="cell">Daily Trade Volume</div>
                <div className="cell">Equippable</div>
                <div className="cell">Item Slot</div>
                <div className="cell">Buy Limit</div>
                <div className="cell">Release Date</div>
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
