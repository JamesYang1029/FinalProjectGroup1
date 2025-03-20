import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/global.css';

const CryptoSustainabilityNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news');
        setNews(response.data);
      } catch (err) {
        setError("Error fetching news articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading news...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-page">
      <Header />
      <main>
        <h1>Crypto Sustainability News</h1>
        {news.length === 0 ? (
          <p>No news available at this time.</p>
        ) : (
          news.map(article => (
            <article key={article._id} className="news-article">
              <h2>{article.headline}</h2>
              <p>{article.summary}</p>
              <p>
                <em>
                  Published on: {new Date(article.published_date).toLocaleDateString()}
                </em>
              </p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read Full Article
              </a>
            </article>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CryptoSustainabilityNews;