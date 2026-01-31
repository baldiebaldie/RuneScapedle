import { useState, useRef, useEffect } from 'react';
import { musicTracks, WIKI_AUDIO_BASE_URL } from './musicTracks';

function MusicGame({ dailySong, unlimitedSong, yesterdaySong, setUnlimitedSong, initialDailyGuesses, initialDailyWon }) {
  const [musicMode, setMusicMode] = useState('daily');
  const [dailySongGuesses, setDailySongGuesses] = useState(initialDailyGuesses || []);
  const [unlimitedSongGuesses, setUnlimitedSongGuesses] = useState([]);
  const [dailySongWon, setDailySongWon] = useState(initialDailyWon || false);
  const [unlimitedSongWon, setUnlimitedSongWon] = useState(false);
  const [songInputValue, setSongInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  // Update state when props change (for localStorage restore)
  useEffect(() => {
    if (initialDailyGuesses) setDailySongGuesses(initialDailyGuesses);
    if (initialDailyWon !== undefined) setDailySongWon(initialDailyWon);
  }, [initialDailyGuesses, initialDailyWon]);

  const currentSong = musicMode === 'daily' ? dailySong : unlimitedSong;
  const songGuesses = musicMode === 'daily' ? dailySongGuesses : unlimitedSongGuesses;
  const songWon = musicMode === 'daily' ? dailySongWon : unlimitedSongWon;

  const songSuggestions = songInputValue.length > 1
    ? musicTracks.filter(track =>
        track.name.toLowerCase().includes(songInputValue.toLowerCase()) &&
        !songGuesses.includes(track.name)
      ).slice(0, 8)
    : [];

  const handleSongGuess = (track) => {
    if (songGuesses.includes(track.name)) return;

    if (musicMode === 'daily') {
      const newGuesses = [...dailySongGuesses, track.name];
      setDailySongGuesses(newGuesses);
      localStorage.setItem('scapedle-daily-song-guesses', JSON.stringify(newGuesses));

      if (track.name === dailySong?.name) {
        setDailySongWon(true);
        localStorage.setItem('scapedle-daily-song-won', 'true');
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    } else {
      const newGuesses = [...unlimitedSongGuesses, track.name];
      setUnlimitedSongGuesses(newGuesses);

      if (track.name === unlimitedSong?.name) {
        setUnlimitedSongWon(true);
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    }

    setSongInputValue('');
  };

  const togglePlay = () => {
    if (!currentSong) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(progress || 0);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioProgress(0);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const audioUrl = WIKI_AUDIO_BASE_URL + currentSong.url;
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
      }
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  const handleSongPlayAgain = () => {
    const randomIndex = Math.floor(Math.random() * musicTracks.length);
    const newSong = musicTracks[randomIndex];
    setUnlimitedSong(newSong);
    setUnlimitedSongGuesses([]);
    setUnlimitedSongWon(false);
    setIsPlaying(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    console.log('New Unlimited Song:', newSong.name);
  };

  const getLocationForGuess = (guessName) => {
    const track = musicTracks.find(t => t.name === guessName);
    return track?.location || 'Unknown';
  };

  return (
    <>
      <div className="tab-container">
        <button
          className={`tab ${musicMode === 'daily' ? 'active' : ''}`}
          onClick={() => setMusicMode('daily')}
        >
          Daily
        </button>
        <button
          className={`tab ${musicMode === 'unlimited' ? 'active' : ''}`}
          onClick={() => setMusicMode('unlimited')}
        >
          Unlimited
        </button>
      </div>

      {musicMode === 'daily' && yesterdaySong && (
        <div className="yesterday-word">
          <span>Yesterday's song:</span>
          <span>{yesterdaySong.name}</span>
        </div>
      )}

      <div className="audio-player">
        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="audio-progress">
          <div className="progress-bar" style={{ width: `${audioProgress}%` }} />
        </div>
        <button className="replay-btn" onClick={replayAudio}>
          ↺
        </button>
      </div>

      {songWon ? (
        <div className="win-message">
          <h2>{currentSong?.name}</h2>
          <p className="location-hint">Unlocks: {currentSong?.location}</p>
          <p>Guesses: {songGuesses.length}</p>
          {musicMode === 'unlimited' && (
            <button className="play-again-btn" onClick={handleSongPlayAgain}>
              Play Again
            </button>
          )}
        </div>
      ) : (
        <div className="search-container">
          <input
            type="text"
            value={songInputValue}
            onChange={(e) => setSongInputValue(e.target.value)}
            placeholder="Guess the song..."
          />
          {songSuggestions.length > 0 && (
            <div className="suggestions">
              {songSuggestions.map(track => (
                <div key={track.name} className="suggestion" onClick={() => handleSongGuess(track)}>
                  {track.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {songGuesses.length > 0 && !songWon && (
        <div className="song-guesses">
          <h4>Wrong guesses:</h4>
          {songGuesses.map((guess, idx) => (
            <div key={idx} className="song-guess-row">
              <span className="wrong-icon">✗</span>
              <span>{guess}</span>
              <span className="location-hint">(Unlocks: {getLocationForGuess(guess)})</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default MusicGame;
