import React, { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CONTENT = {
  tabs: [
    { id: "cosmeticos", label: "Lojas de cosmetico" },
    { id: "shopping", label: "Shopping e Mercados" },
    { id: "cosmeticos2", label: "Lojas de cosmetico" },
  ],

  slides: [
    {
      id: "s1",
      image:
        "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202025-12-19T105212.326.jpg",
      title: "Lojas de cosmeticos",
      description:
        "Ideal para montras e vitrinas inteligentes, destacando produtos sem ocultá-los.",
    },
    {
      id: "s2",
      image:
        "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202025-12-19T111038.202.jpg",
      title: "Shopping e Mercados",
      description:
        "Perfeito para áreas de grande fluxo, com campanhas visíveis sem bloquear a visão.",
    },
    {
      id: "s3",
      image:
        "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202025-12-19T114812.256.jpg",
      title: "Lojas de cosmetico",
      description:
        "Experiência premium com campanhas rotativas e animações suaves.",
    },
  ],

  autoplayMs: 4500,
};

export default function CarouselShop() {
  const data = CONTENT;

  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id || "");
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const slides = data.slides;
  const total = slides.length;

  const timerRef = useRef(null);
  const hoveringRef = useRef(false);

  const [bgA, setBgA] = useState(slides[0]?.image || "");
  const [bgB, setBgB] = useState("");
  const [showA, setShowA] = useState(true);

  const [textKey, setTextKey] = useState(0);

  const lightboxSlides = useMemo(
    () => slides.map((s) => ({ src: s.image })),
    [slides]
  );

  const goTo = (i) => {
    const next = (i + total) % total;
    setIndex(next);
  };

  const next = () => goTo(index + 1);

  useEffect(() => {
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };

    stop();
    timerRef.current = setInterval(() => {
      if (!hoveringRef.current) next();
    }, data.autoplayMs);

    return stop;
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  const active = slides[index];

  useEffect(() => {
    setTextKey((k) => k + 1);

    if (showA) {
      setBgB(active.image);
      requestAnimationFrame(() => setShowA(false));
    } else {
      setBgA(active.image);
      requestAnimationFrame(() => setShowA(true));
    }
  }, [index]);

  return (
    <>
      {/* LIGHTBOX */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={index}
        slides={lightboxSlides}
      />

      <div className="section tekup-section-padding">
        <div className="section-carousel container">
          <section
            className="wl-hero position-relative overflow-hidden"
            onMouseEnter={() => (hoveringRef.current = true)}
            onMouseLeave={() => (hoveringRef.current = false)}
          >
            {/* Background */}
            <div className="wl-bg-stack">
              <div
                className={`wl-bg ${showA ? "is-on" : "is-off"}`}
                style={{ backgroundImage: `url(${bgA})` }}
              />
              <div
                className={`wl-bg ${showA ? "is-off" : "is-on"}`}
                style={{ backgroundImage: `url(${bgB})` }}
              />
            </div>

            <div className="wl-overlay" />
            <div className="wl-bottom-shadow" />

            {/* Tabs */}
            <div className="wl-top container-fluid px-4 pt-4">
              <div className="d-flex gap-3">
                {data.tabs.map((t) => (
                  <button
                    key={t.id}
                    className={`wl-pill ${
                      activeTab === t.id
                        ? "wl-pill--active"
                        : "wl-pill--idle"
                    }`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div className="wl-stage container-fluid px-4">
              <div className="wl-copy" key={textKey}>
                <h2 className="wl-title">{active.title}</h2>
                <p className="wl-desc">{active.description}</p>
              </div>

              <button
                className="wl-bg-click"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Abrir imagem"
              />
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .wl-hero{height:680px;border-radius:10px}
        .wl-bg{position:absolute;inset:0;background-size:cover;opacity:0;transition:.7s}
        .wl-bg.is-on{opacity:1}
        .wl-overlay{position:absolute;inset:0;background:rgba(0,0,0,.45)}
        .wl-copy{position:absolute;left:40px;bottom:40px;color:#fff}
        .wl-title{font-size:42px;font-weight:900}
        .wl-desc{font-size:18px;max-width:800px}
        .wl-pill{border-radius:999px;padding:10px 16px}
        .wl-pill--active{background:#fff;color:#000}
        .wl-pill--idle{background:#0006;color:#fff}
        .wl-bg-click{position:absolute;inset:0;background:none;border:0}
      `}</style>
    </>
  );
}
