import {newsData} from "../config/mongoCollections.js";
import dotenv from "dotenv";
dotenv.config();

export async function getNews(cryptoName) {
    const API_KEY = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/everything?q=${cryptoName}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
    
        if (!data.articles) return [];
    
        const articles = data.articles.slice(0, 5).map(article => ({        
        title: article.title,
        url: article.url,
        source: article.source.name
        }));
    
        return articles;
    } catch (err) {
        console.error("Error fetching news:", err);
        return []; // fallback to an empty list on error
    }
    }


