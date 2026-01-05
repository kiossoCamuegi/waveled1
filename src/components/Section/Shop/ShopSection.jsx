"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Slider from "react-slick/lib/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoPlay } from "react-icons/io5";

function FiveSolutionsSlider({ items }) {
  const Settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 3500,
    autoplaySpeed: 3500,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true },
      },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="categorie-five-sliders">
      <div className="container">
        <div className="space-div">
          <div>
            <h3 className="text-light">Soluções pensadas para atrair clientes</h3>
          </div>
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus fugiat quis saepe
              perspiciatis, veritatis nesciunt?
            </p>
          </div>
        </div>

        <Slider {...Settings}>
          {items.map((item, index) => (
            <article key={index}>
              <div className="inner-item">
                <div className="image">
                  <img src={item.image} alt={item.title} />
                </div>
                <strong className="text-light">{item.title}</strong>

                <Link href={item.link}>
                  <button className="tekup-default-btn" type="button">
                    Saiba mais
                  </button>
                </Link>
              </div>

              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </article>
          ))}
        </Slider>
      </div>
    </div>
  );
}

function MainItemCategoryPage({ item }) {
  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <div className="categorie-main-item">
      <div className="image-slider">
        <Slider {...settings}>
          {item?.images.map((image, index) => (
            <div className="image" key={index}>
              <img src={image} alt={item?.title} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="text-content">
        <h2>{item?.title}</h2>
        <p>{item?.description}</p>
        <div className="mt-2 mb-2">
          <hr />
        </div>
        <br />

        <Link href={item?.link}>
          <button className="tekup-default-btn" type="button">
            Saiba mais
          </button>
        </Link>
      </div>
    </div>
  );
}

function HeaderCategorieAndTitle({ title, categories, active }) {
  return (
    <aside className="catgorie-page-header">
      <div className="category-page-title">
        <h3>Venda , aluguer e montagem de ecrãs LED</h3>
        <h5 className="text-primary">{title}</h5>
      </div>
      <hr />
      <div className="category-page-cats">
        <ul>
          {categories.map((item, index) => (
            <Link href={item?.link} key={index}>
              {/* ✅ FIX: usa active correto */}
              <li className={`link-badge ${item?.id === active ? "active" : ""}`}>
                {item?.title}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function CardSliderVertical({ item }) {
  return (
    <div className="card-slider-vertical">
      <article className="card-inner">
        <div className="image">
          <div className="over-image">
            <small>{item?.solution}</small>
            <Link href={item?.link}>
              <h5>{item?.title}</h5>
            </Link>
            <button className="bg-primary text-light" type="button">
              Saiba mais
            </button>
          </div>
          <img src={item?.image} alt={item?.title} />
        </div>
      </article>
    </div>
  );
}

function TwoNiceProducts({ items }) {
  return (
    <div className="categorie-page-two">
      {items.map((item, index) => (
        <article key={index}>
          <img src={item?.image} alt={item.title} />
          <Link href={item?.link}>
            <button className="tekup-default-btn" type="button">
              Saiba mais
            </button>
          </Link>
        </article>
      ))}
    </div>
  );
}

function VideoSolutionsSlick() {
  const videos = useMemo(
    () => [
      { id: "W0T-1cJf1Dw", title: "Displays LED Transparentes", desc: "Impacto visual sem bloquear a montra.", tag: "Transparent LED" },
      { id: "6yQmGbdqHl8", title: "Painéis LED Modulares", desc: "Soluções flexíveis e escaláveis.", tag: "Modular" },
      { id: "DCKDisbzpCI", title: "Experiências Imersivas", desc: "Ambientes digitais envolventes.", tag: "Immersive" },
      { id: "kKRhtLj0Leg", title: "Eventos & Palcos", desc: "Ecrãs LED para grandes eventos.", tag: "Events" },
      { id: "prdCz7tP0NQ", title: "LED Indoor & Outdoor", desc: "Alta luminosidade e fiabilidade.", tag: "Indoor / Outdoor" },
    ],
    []
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const openLightbox = (index) => {
    setLbIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const ytPoster = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const ytEmbed = (id) =>
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    accessibility: false,
    focusOnSelect: false,
    afterChange: (i) => setActiveSlide(i),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 680, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const y = window.scrollY;
      sliderRef.current?.slickNext?.();

      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }

      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: "auto" });
      });
    }, 1500);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  return (
    <section className="categorie-videos vs-wrap">
      <header className="vs-header">
        <h2>Veja as nossas soluções em ação</h2>
        <p>Displays LED transparentes, modulares e experiências imersivas</p>
      </header>
      <br />

      <Slider ref={sliderRef} {...settings} className="vs-slider">
        {videos.map((v, i) => (
          <div key={v.id}>
            <button
              className={`vs-card ${activeSlide === i ? "active" : ""}`}
              onClick={() => openLightbox(i)}
              type="button"
            >
              <div className="vs-thumb">
                <img src={ytPoster(v.id)} alt={v.title} />
                <div className="vs-over">
                  <div className="vs-play">
                    <IoPlay />
                  </div>
                </div>
                <span className="vs-tag">{v.tag}</span>
              </div>

              <div className="vs-info">
                <strong>{v.title}</strong>
                <span>{v.desc}</span>
              </div>
            </button>
          </div>
        ))}
      </Slider>

      {lightboxOpen && (
        <div
          className="vs-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            className="vs-close"
            onClick={closeLightbox}
            aria-label="Fechar vídeo"
            title="Fechar"
            type="button"
          >
            ✕
          </button>

          <div className="vs-video" onMouseDown={(e) => e.stopPropagation()}>
            <iframe
              key={videos[lbIndex].id}
              src={ytEmbed(videos[lbIndex].id)}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={videos[lbIndex]?.title}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .vs-wrap {
          padding: 80px 20px;
          background: #f2f3fc;
          margin: 50px 0px;
        }
        .vs-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .vs-header h2 {
          margin: 10px 0 4px;
        }
        .vs-header p {
          opacity: 0.7;
        }
        .vs-card {
          border: none;
          background: transparent;
          padding: 0 10px;
          cursor: pointer;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }
        .vs-card.active {
          transform: scale(1);
        }
        .vs-thumb {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        .vs-thumb img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
        }
        .vs-over {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vs-play {
          width: 60px;
          height: 60px;
          background: #0019ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .vs-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: white;
          padding: 6px 10px;
          border-radius: 999px;
        }
        .vs-info {
          margin-top: 12px;
          text-align: left;
        }
        .vs-info strong {
          display: block;
        }
        .vs-info span {
          opacity: 0.7;
        }
        .vs-modal {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(0, 0, 0, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .vs-close {
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 1000000;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          font-weight: 900;
          font-size: 18px;
          backdrop-filter: blur(6px);
        }
        .vs-close:hover {
          background: rgba(255, 255, 255, 0.22);
        }
        .vs-video {
          width: min(1100px, 100%);
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          background: transparent;
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);
        }
        .vs-video iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: #000;
        }
        @media (max-width: 720px) {
          .vs-close {
            top: 12px;
            right: 12px;
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </section>
  );
}

function MoreProducts({ items }) {
  return (
    <div className="categorie-page-products">
      <h2>Soluções mais utilizadas</h2>
      <div className="items-wrap">
        {items?.map((item, index) => (
          <article key={index}>
            <div className="image">
              <img src={item?.image} alt="" />
              <div className="over-image">
                <Link href={item?.link}>
                  <button className="tekup-default-btn" type="button">
                    Saiba mais
                  </button>
                </Link>
              </div>
            </div>
            <Link href={item?.link}>
              <strong className="text-dark">{item?.title}</strong>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ShopSection() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const isBrowser = typeof window !== "undefined";
  const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const API_BASE = protocol === "https" ? "https://waveledserver1.vercel.app" : "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [categories, setCategories] = useState([]);

  const verticalSliderSettings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 1200,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    // ✅ FIX: se não houver category, não fica preso em loading
    if (!categoryId) {
      setLoading(false);
      setPage(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [pageRes, catsRes] = await Promise.all([
          axios.get(API_BASE + `/api/cms/category-pages/${categoryId}`),
          axios.get(API_BASE + `/api/categories`),
        ]);

        setPage(pageRes.data?.data || null);
        setCategories(catsRes.data?.data || []);
      } catch (e) {
        console.error("Erro ao carregar categoria", e);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryId, API_BASE]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>A carregar categoria…</p>
      </div>
    );
  }

  // ✅ Mensagem quando não vem query param
  if (!categoryId) {
    return (
      <div className="container py-5 text-center">
        <p>Escolhe uma categoria para ver os produtos.</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-5 text-center">
        <p>Categoria não encontrada.</p>
      </div>
    );
  }

  const topVerticalSolutions =
    page.top_solutions?.map((x) => ({
      solution: x.solution?.wl_title,
      title: x.solution?.wl_title,
      image: x.solution?.wl_image,
      link: x.solution?.wl_product?.wl_link || "#",
    })) || [];

  const mainItem = {
    images: page.featured_product?.images || [],
    title: page.featured_product?.title || "",
    description: page.featured_product?.description || "",
    link: page.featured_product?.product?.wl_link || "#",
  };

  const sliderSolutions =
    page.slider_solutions?.map((s) => ({
      title: s.title,
      image: s.image,
      link: s.product?.wl_link || "#",
    })) || [];

  const twoSpecial =
    page.two_special_products?.map((s) => ({
      image: s.image,
      link: s.product?.wl_link || "#",
    })) || [];

  const mostUsed =
    page.most_used_solutions?.map((x) => ({
      title: x.solution?.wl_title,
      image: x.solution?.wl_image,
      link: x.solution?.wl_product?.wl_link || "#",
    })) || [];

  return (
    <div className="categorie-page">
      <div className="container">
        <HeaderCategorieAndTitle
          title={page.wl_category?.wl_name || ""}
          categories={categories.map((c) => ({
            title: c.wl_name,
            link: `/shop?category=${c._id}`,
            id: c._id,
          }))}
          active={categoryId}
        />

        {topVerticalSolutions.length > 0 && (
          <aside className="card-slides-vertical">
            <Slider {...verticalSliderSettings}>
              {topVerticalSolutions.map((item, index) => (
                <CardSliderVertical key={index} item={item} />
              ))}
            </Slider>
          </aside>
        )}

        {mainItem.images?.length > 0 && (
          <aside>
            <MainItemCategoryPage item={mainItem} />
          </aside>
        )}
      </div>

      {sliderSolutions.length > 0 && (
        <aside>
          <FiveSolutionsSlider items={sliderSolutions} />
        </aside>
      )}

      {twoSpecial.length > 0 && (
        <div className="container">
          <aside>
            <TwoNiceProducts items={twoSpecial} />
          </aside>
        </div>
      )}

      <aside>
        <VideoSolutionsSlick />
      </aside>

      {mostUsed.length > 0 && (
        <div className="container">
          <aside>
            <MoreProducts items={mostUsed} />
          </aside>
        </div>
      )}
    </div>
  );
}
