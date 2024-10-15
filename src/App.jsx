import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";

function App()  {
  const [inputData, setInputData] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const searchImage = async (newSearch = false) => {
    if (!inputData.trim()) return;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      const results = response.data.results;

      if (newSearch) {
        setImages(results);
      } else {
        setImages((prevImages) => [...prevImages, ...results]);
        console.log(images)
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("An error occurred while fetching images. Please try again later.");
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    searchImage(true);
  };

  const handelInfiniteScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      searchImage();
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, []);

  return (
    <div className="app-container">
      <header>
        <h2>GeekGallery</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            id="search-input"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Search for images..."
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <div id="image-container">
        {images.map((image, index) => (
          <div className="search-result" key={index}>
            <img loading="lazy" src={image.urls.small} alt={image.alt_description} />
            <div className="image-des">
              <a href={image.links.html} target="_blank" rel="noopener noreferrer">
                {image.alt_description || "View on Unsplash"}
              </a>
              <p>{image.created_at}</p>
            </div>
           
          </div>
        ))}
      </div>

      {loading && <div className="loader">Loading...</div>}

      <footer>Developed by Deepesh and Team!</footer>
    </div>
  );
}

export default App;
