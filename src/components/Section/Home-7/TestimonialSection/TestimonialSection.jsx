"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialSection = () => {
  const blurRef = useRef(null);
  const sliderWrapRef = useRef(null);

  // ================== CONFIG (AUTO-FIT SEM ACHATAR) ==================
  const CARD_MIN_W = 320; // mínimo do card
  const GAP_X = 18; // meio-gap (gap total = *2)

  const [slidesToShow, setSlidesToShow] = useState(3);
  const [loadingData, setLoadingData] = useState([]);

  // ================== AUTO-FIT: quantos cards cabem ==================
  useEffect(() => {
    if (!sliderWrapRef.current) return;
    const el = sliderWrapRef.current;

    const calc = (w) => {
      const perSlide = CARD_MIN_W + GAP_X * 2;
      return Math.max(1, Math.floor(w / perSlide));
    };

    const ro = new ResizeObserver((entries) => {
      const w = entries?.[0]?.contentRect?.width ?? el.clientWidth ?? 0;
      setSlidesToShow(calc(w));
    });

    ro.observe(el);
    setSlidesToShow(calc(el.clientWidth ?? 0));
    return () => ro.disconnect();
  }, [CARD_MIN_W, GAP_X]);

  // ================== EFEITO BLUR DA SECÇÃO (mantém o teu) ==================
  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".blur-slide-screen");
      const blurElement = blurRef.current;
      if (!section || !blurElement) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight || 1;
      const scrollY = window.scrollY;

      const progress = Math.min(
        Math.max((scrollY - sectionTop) / sectionHeight, 0),
        1
      );

      const blurValue = progress * 25;
      blurElement.style.backdropFilter = `blur(${blurValue}px) brightness(71.42%)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================== API ==================
  const protocol =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "https"
      : "http";

  const BaseUrl =
    protocol === "https"
      ? "https://waveledserver1.vercel.app"
      : "http://localhost:4000";

  useEffect(() => {
    async function loadData() {
      try {
        const response = await axios.get(BaseUrl + "/api/featured", {
          withCredentials: true,
        });
        const data = response?.data?.data ? response.data.data : [];
        setLoadingData(data);
      } catch (error) {
        console.log(error);
      }
    }
    loadData();
  }, [BaseUrl]);

  // ================== SLICK SETTINGS ==================
  const settings = useMemo(() => {
    const total = loadingData.length || 0;

    return {
      dots: true, // ✅ dots ON
      arrows: false, // ✅ remove arrows
      infinite: true, // ✅ infinite
      speed: 700, // ✅ transição smooth
      cssEase: "ease-in-out", // ✅ smooth
      autoplay: true, // ✅ autoplay
      autoplaySpeed: 4000, // ✅ 4s
      pauseOnHover: true,
      pauseOnFocus: true,
      swipeToSlide: true,
      slidesToScroll: 1,

      // auto-fit sem achatar
      slidesToShow: Math.min(slidesToShow, Math.max(total, 1)),

      // evita “saltos” quando há poucos itens
      // (slick em infinite precisa de >= slidesToShow; aqui garantimos no render)
      responsive: [
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };
  }, [slidesToShow, loadingData.length]);

  // ================== RENDER ==================
  const totalSlides = loadingData.length;
  const effectiveSlidesToShow = Math.min(slidesToShow, Math.max(totalSlides, 1));
  const shouldInfinite = totalSlides > effectiveSlidesToShow; // ✅ evita bug quando itens <= slidesToShow

  const finalSettings = {
    ...settings,
    slidesToShow: effectiveSlidesToShow,
    infinite: shouldInfinite,
    autoplay: shouldInfinite, // se não houver slides suficientes, desliga autoplay
  };

  return (
    <>
      <div
        className="section dark-bg blur-slide-screen"
        style={{ position: "relative" }}
      >
        <div className="image-wall">
          <img
            src="https://ik.imagekit.io/fsobpyaa5i/happy-diverse-friends-celebrating-with-sparklers-o-2025-02-13-00-11-44-utc.jpg"
            alt="waveled"
          />
        </div>

        <section className="over-product-blur" ref={blurRef}>
          {loadingData.length >= 1 ? (
            <div className="products-slide" ref={sliderWrapRef}>
              <Slider {...finalSettings} className="slick-wrapper">
                {loadingData.map((item, index) => {
                  const product = item?.wl_product;

                  const imagePath =
                    product?.wl_images && product.wl_images.length > 0
                      ? product.wl_images[0]
                      : null;

                  const imageUrl = imagePath
                    ? imagePath.startsWith("http")
                      ? imagePath
                      : BaseUrl + imagePath
                    : "";

                  const name = product?.wl_name || "";
                  const specs = product?.wl_specs_text || "";

                  const truncatedName =
                    name.length > 40 ? name.substring(0, 40) + "..." : name;

                  const truncatedSpecs =
                    specs.length > 90 ? specs.substring(0, 90) + "..." : specs;

                  return (
                    <div key={product?._id || index} className="slick-item">
                      <article className="slider-card">
                        <div className="image-area">
                          {imageUrl && (
                            <img src={imageUrl} alt={truncatedName || "Produto"} />
                          )}
                        </div>

                        <div className="text">
                          <Link href={`single-shop?product=${product?._id || ""}`}>
                            <h4>{truncatedName}</h4>
                          </Link>
                          <p>{truncatedSpecs}</p>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </Slider> 
            </div>
          ) : null}
          
        </section>
      </div>

      <style jsx global>{` 
        .products-slide {
          width: 100%;
          padding: 0 24px;
          box-sizing: border-box;
        }
 
        .slick-item {
          padding: 0 ${GAP_X}px;
          box-sizing: border-box;
        }

        .products-slide .slick-list {
          margin: 0 -${GAP_X}px;
        }

       
        .slider-card {
          min-width: ${CARD_MIN_W}px;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: transparent;  
          backdrop-filter: none;  
        }

        @media (max-width: 640px) {
          .products-slide {
            padding: 0 14px;
          }
          .slick-item {
            padding: 0 10px;
          }
          .products-slide .slick-list {
            margin: 0 -10px;
          }
          .slider-card {
            min-width: 0;
          }
        }

        .image-area {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 14px; /* fica bonito sem fundo */
        }

        .image-area img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .text {
          padding: 14px 2px 0; 
        }

        .text h4 {
          font-size: 16px;
          margin: 0 0 6px;
          color: #e5e7eb;
        }

        .text p {
          font-size: 13px;
          margin: 0;
          color: #9ca3af;
        }

       
        .slick-dots { 
          margin-top: 16px;
        }

        .slick-dots li button:before {
          font-size: 10px;
          opacity: 0.55;
        }

        .slick-dots li.slick-active button:before {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default TestimonialSection;
