import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import "./NewsCarousel.css"; 

const NewsCarousel = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error("❌ Error fetching posts for carousel:", error);
      }
    };

    fetchPosts();
  }, []);

  const getMainImage = (content) => {
    if (!content) return "images/placeholder.jpg";
    try {
      const div = document.createElement("div");
      div.innerHTML = content;
      const imgElement = div.querySelector("img");
      return imgElement ? imgElement.src : "images/placeholder.jpg";
    } catch (error) {
      console.error("Error parsing post content for image:", error);
      return "images/placeholder.jpg";
    }
  };

  const settings = {
    dots: false,
    infinite: posts.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const latestPosts = Array.isArray(posts) ? posts.slice(0, 10) : [];

  return (
    <section className="news-carousel-section">
     
      <Slider {...settings}>
        {latestPosts.map((post) => (
          <div key={post.id} className="news-slide">
            <Link to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
              <div
                className="news-slide-bg"
                style={{
                  backgroundImage: `url(${getMainImage(post.content)})`,
                }}
              >
                <div className="news-slide-overlay">
                  <p className="news-date">
                    {new Date(post.updatedAt).toLocaleDateString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="news-title-home">{post.title}</h2>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
       <div className="view-more-wrapper">
        <Link to="/posts" className="btn btn-warning mb-2 btn-sm mx-auto text-center w-50 wow fadeInDown">
          ВСІ НОВИНИ ...  <i className="icofont-plus me-2"></i>
          
        </Link>
       
      </div>
    </section>
  );
};

export default NewsCarousel;
