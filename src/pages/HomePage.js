import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/global.css';

const HomePage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get('/api/cryptos');
        setCryptos(response.data);
      } catch (err) {
        setError("Error fetching cryptocurrencies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  if (loading) return <div>Loading cryptocurrencies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="homepage">
      <Header />
      <main>
        <h1>Popular Cryptocurrencies</h1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Sustainability Score</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto, index) => (
              <tr key={crypto._id}>
                <td>{index + 1}</td>
                <td>{crypto.name}</td>
                <td>{crypto.symbol}</td>
                <td>{crypto.sustainabilityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;