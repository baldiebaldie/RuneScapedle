import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [allItems, setAllItems] = useState([]);
  const [targetItem, setTargetItem] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(true);

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
