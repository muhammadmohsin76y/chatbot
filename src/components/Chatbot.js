"use client";

import { useState } from "react";
import axios from "axios";
import styles from "../styles/Chatbot.module.css";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");
    setImage("");

    try {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          srsearch: question,
          format: "json",
          origin: "*",
        },
      });

      const searchResults = response.data.query.search;

      if (searchResults && searchResults.length > 0) {
        const pageTitle = searchResults[0].title;

        const pageResponse = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
        );

        const pageData = pageResponse.data;
        setAnswer(pageData.extract || "No explanation available.");
      } else {
        setAnswer("No results found.");
      }

      const imageResponse = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          prop: "pageimages",
          piprop: "original",
          titles: question,
          format: "json",
          origin: "*",
        },
      });

      const pages = imageResponse.data.query.pages;
      const page = Object.values(pages)[0];
      setImage(page?.original?.source || "");
    } catch (error) {
      console.error(error);
      setAnswer("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
       <h1 className={styles.title}>This geography chat-bot is made by MHZ developers</h1>
      <br /><br /> {/* Add two line breaks */}
      <h2 className={styles.chatbotTitle}>Chatbot</h2>
      <textarea
        className={styles.textarea}
        placeholder="Ask me about any question regarding educaton/study"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleSearch} className={styles.button}>
        {loading ? "Loading..." : "Get Explanation"}
      </button>
      {answer && (
        <div className={styles.responseContainer}>
          <h2 className={styles.responseTitle}>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
      {image && (
        <div className={styles.imageContainer}>
          <h3>Related Image:</h3>
          <img src={image} alt="Relevant topic" className={styles.image} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;