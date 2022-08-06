import React, { useEffect, useState } from "react";
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  'https://i.giphy.com/media/MDJ9IbxxvDUQM/giphy.webp',
  'https://i.giphy.com/media/jp2KXzsPtoKFG/giphy.webp',
  'https://i.giphy.com/media/6MWahPArixa6I/giphy.webp',
  'https://i.giphy.com/media/zZMTVkTeEfeEg/giphy.webp'

]

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!')

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.log(error)
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.')
    }
  }
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button"
      onClick={connectWallet}> Connect to wallet </button>
  )

  const renderConnectedContainer = () => {
    return (
      <div className="connected-container">
        <form onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}>
          <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
          <button type="submit" className="cta-button submit-gif-button"> Submit </button>
        </form>
        <div className="gif-grid">
          {gifList.map(gif => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    )
  };


  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...')
      // Call Solana program here

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);



  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* This was solely added for some styling fanciness */}
          <div className={walletAddress ? "authed-container" : "container"}>
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
