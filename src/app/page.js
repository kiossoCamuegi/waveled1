"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import AccordionSection from "~/components/Section/Home-4/AccordionSection";
import HeroSection from "~/components/Section/Home-4/HeroSection";
import ItSolutionSection from "~/components/Section/Home-4/ItSolutionSection";
import TestimonialSection from "~/components/Section/Home-7/TestimonialSection";
import ServiceSection from "~/components/Section/Home-4/ServiceSection";
import RecentProjectsSection from "~/components/Section/Home-4/RecentProjectsSection";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import FooterFour from "~/components/Section/Common/FooterFour";
import CtaThreeSection from "~/components/Section/Common/CtaThree/CtaThreeSection";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --------- ENV ---------
const isBrowser = typeof window !== "undefined";
const protocol =
  isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";
const IMG_HOST =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";

// --------- Helpers ---------
const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${IMG_HOST}${u}`) : "");
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);
const pickImage = (it) =>
  it?.image ||
  it?.cover ||
  it?.coverUrl ||
  it?.img ||
  it?.thumbnail ||
  it?.thumbUrl ||
  it?.photo;

const isMobileUA = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Ordena: primeiro por mais antigas (ASC), depois acrescenta as mais recentes (DESC) sem duplicar
const orderFirstOldestThenNewest = (arr) => {
  const items = Array.isArray(arr) ? arr.slice() : [];
  const getTime = (x) => {
    const d = x?.createdAt ? new Date(x.createdAt) : null;
    const t = d && !isNaN(d.getTime()) ? d.getTime() : 0;
    return t;
  };
  const oldestAsc = items.slice().sort((a, b) => getTime(a) - getTime(b));
  const newestDesc = items.slice().sort((a, b) => getTime(b) - getTime(a));

  const seen = new Set();
  const merged = [];
  for (const it of [...oldestAsc, ...newestDesc]) {
    const id = String(it?._id || "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    merged.push(it);
  }
  return merged;
};

// Repete itens quando há poucos, para o loop ficar “bonito” e sem espaços vazios
function repeatToMin(items, minCount) {
  const src = Array.isArray(items) ? items : [];
  if (src.length === 0) return [];
  if (src.length >= minCount) return src;

  const out = [];
  while (out.length < minCount) out.push(...src);
  return out.slice(0, minCount);
}

// --------- Axios client ---------
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// --------- Skeleton Card (shimmer) ---------
const SkeletonCard = () => (
  <div className="card-slider-vertical" aria-hidden="true">
    <article className="card-inner skeleton-card-vertical">
      <div className="image">
        <div className="skeleton-box skeleton-media" />
      </div>
    </article>
  </div>
);

const SKELETON_ITEMS = Array.from({ length: 8 }).map((_, i) => i);

function CardSliderVertical({ item }) {
  const title = safeText(item?.title, "Solução");
  const image = item?.image;
  const productId = item?._id;

  return (
    <div className="card-slider-vertical">
      <article className="card-inner">
        <div className="image">
          <div className="over-image">
            <small>
              {item?.category?.length > 24
                ? item?.category?.substring(0, 24) + " ..."
                : item?.category}
            </small>

            {productId ? (
              <Link href={`single-shop?product=${productId}`}>
                <h5>{item?.title}</h5>
              </Link>
            ) : (
              <h5 style={{ cursor: "default" }}>{title}</h5>
            )}

            {productId ? (
              <Link href={`single-shop?product=${productId}`}>
                <button className="bg-primary text-light">Saiba mais</button>
              </Link>
            ) : (
              <button
                className="bg-primary text-light"
                disabled
                style={{ opacity: 0.6 }}
              >
                Saiba mais
              </button>
            )}
          </div>

          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="skeleton-box skeleton-media" />
          )}
        </div>
      </article>
    </div>
  );
}

const HomeFour = ({ deviceType: deviceTypeProp }) => {
  const deviceType = deviceTypeProp || (isMobileUA() ? "mobile" : "desktop");

  // --------------------------
  // "Explorar todas as soluções"
  // --------------------------
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // --------------------------
  // Vertical Solutions (FAVORITOS)
  // --------------------------
  const [VerticalSolutionsItems, SetVerticalSolutionsItems] = useState([]);
  const [verticalLoading, setVerticalLoading] = useState(true);
  const [verticalErr, setVerticalErr] = useState(null);

  // ==========================
  // FETCH: Favoritos do CMS
  // ==========================
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setVerticalLoading(true);
        setVerticalErr(null);

        const { data } = await api.get("/api/cms/vertical-solutions", {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });

        const list = Array.isArray(data?.data) ? data.data : [];

        const featured = list
          .filter((it) => !!it?.wl_featured_megamenu)
          .map((it) => {
            const productId = it?.wl_product?._id || it?.wl_product || "";
            return {
              solution: "Favoritos",
              category: safeText(it?.wl_product?.wl_name, "#"),
              title: safeText(it?.wl_title, "Solução"),
              image: withHost(it?.wl_image),
              _id: productId,
            };
          });

        SetVerticalSolutionsItems(featured);
      } catch (e) {
        if (axios.isCancel(e)) return;
        const status = e?.response?.status;
        const statusText = e?.response?.statusText;
        const msg = status
          ? `HTTP ${status}${statusText ? ` — ${statusText}` : ""}`
          : e?.message || "Erro ao carregar favoritos";
        console.error("Erro a obter /api/cms/vertical-solutions:", e);
        setVerticalErr(msg);
        SetVerticalSolutionsItems([]);
      } finally {
        setVerticalLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // ==========================
  // FETCH: /api/solutions
  // ==========================
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const { data } = await api.get("/api/solutions", {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });

        const list = Array.isArray(data?.data) ? data.data : [];
        const ordered = orderFirstOldestThenNewest(list);
        setSolutions(ordered);
      } catch (e) {
        if (axios.isCancel(e)) return;
        const status = e?.response?.status;
        const statusText = e?.response?.statusText;
        const msg = status
          ? `HTTP ${status}${statusText ? ` — ${statusText}` : ""}`
          : e?.message || "Erro ao carregar soluções";
        console.error("Erro a obter /api/solutions:", e);
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // memo para render rápido (mantido)
  const cards = useMemo(() => {
    return (solutions || []).map((item) => {
      const id = String(item?._id || "");
      const title = safeText(item?.title, "Solução");
      const img = withHost(pickImage(item));
      const href = `/solutions?sl=${encodeURIComponent(id)}`;
      return { id, title, img, href };
    });
  }, [solutions]);

  // ==========================
  // Autoplay smooth + infinite sem “buracos”
  // - Se houver poucos itens, repetimos para garantir loop natural
  // - Autoplay contínuo usa autoplaySpeed: 0 e speed alto com cssEase linear
  // ==========================
  const verticalBaseCount = VerticalSolutionsItems.length;

  const verticalForLoop = useMemo(() => {
    // Precisamos de “massa” suficiente para o infinite não parecer que “abre espaço”
    // 4.5 cards no desktop -> mínimo ~12 itens deixa o loop suave.
    const min = 12;
    return repeatToMin(VerticalSolutionsItems, min);
  }, [VerticalSolutionsItems]);

  const shouldInfinite = verticalBaseCount > 4;
  const shouldAutoplay =
    deviceType !== "mobile" && shouldInfinite && verticalBaseCount > 4;

  const VerticalSliderSettings = useMemo(
    () => ({
      dots: true,
      arrows: false,
      infinite: shouldInfinite,
      autoplay: shouldAutoplay,
      autoplaySpeed: 0,
      speed: 9000,
      cssEase: "linear",
      pauseOnHover: true,
      pauseOnFocus: true,
      swipeToSlide: true,
      touchMove: true,

      // Mantém o look “4.5” mas sem saltos (scroll 1 a 1)
      slidesToShow: 4.5,
      slidesToScroll: 1,

      responsive: [
        {
          breakpoint: 1584,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: verticalBaseCount > 4,
            autoplay:
              deviceType !== "mobile" && verticalBaseCount > 4 ? true : false,
            autoplaySpeed: 0,
            speed: 9000,
            cssEase: "linear",
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: verticalBaseCount > 3,
            autoplay:
              deviceType !== "mobile" && verticalBaseCount > 3 ? true : false,
            autoplaySpeed: 0,
            speed: 8000,
            cssEase: "linear",
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: verticalBaseCount > 2,
            autoplay:
              deviceType !== "mobile" && verticalBaseCount > 2 ? true : false,
            autoplaySpeed: 0,
            speed: 7000,
            cssEase: "linear",
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: verticalBaseCount > 1,
            autoplay:
              deviceType !== "mobile" && verticalBaseCount > 1 ? true : false,
            autoplaySpeed: 0,
            speed: 6500,
            cssEase: "linear",
            dots: true,
            arrows: false,
          },
        },
      ],
    }),
    [shouldInfinite, shouldAutoplay, verticalBaseCount, deviceType]
  );

  return (
    <div>
      <HeaderFour />
      <HeroSection />

      <section>
        <div className="section home-featured-items tekup-section-padding2 pt-5 pb-3">
          <div className="container-fluid">
            <div className="tekup-section-title text-center">
              <h2 className="text-dark">
                Conheça soluções pensadas para vender mais
              </h2>
              <p className="text-muted">
                Projetos e aplicações reais dos nossos produtos.
              </p>
            </div>

            <div
              className="row-featured"
              aria-live="polite"
              aria-busy={verticalLoading ? "true" : "false"}
            >
              <aside className="card-slides-vertical">
                {verticalLoading ? (
                  <Slider {...VerticalSliderSettings}>
                    {SKELETON_ITEMS.map((i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </Slider>
                ) : VerticalSolutionsItems.length ? (
                  <Slider {...VerticalSliderSettings}>
                    {verticalForLoop.map((item, index) => (
                      <CardSliderVertical
                        item={item}
                        key={`${item?._id || "it"}-${index}`}
                      />
                    ))}
                  </Slider>
                ) : (
                  <div className="wl-empty-vertical text-center">
                    <strong className="text-dark">
                      Sem favoritos no Megamenu
                    </strong>
                    <div className="text-muted small">
                      Marca soluções verticais como <b>Favorito</b> para
                      aparecerem aqui.
                    </div>
                    {verticalErr ? (
                      <div className="text-danger small" style={{ marginTop: 6 }}>
                        {verticalErr}
                      </div>
                    ) : null}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>

      <ServiceSection />
      <ItSolutionSection />
      <RecentProjectsSection />
      <TestimonialSection />
      <AccordionSection />
      <CtaThreeSection />
      <FooterFour />

      <style jsx>{`
        /* Skeleton base */
        .skeleton-box {
          position: relative;
          overflow: hidden;
          background: #e9ecef;
        }
        .skeleton-box::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.2s infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        /* Skeleton vertical */
        .skeleton-card-vertical .image {
          border-radius: 14px;
          overflow: hidden;
        }
        .skeleton-media {
          width: 100%;
          height: 260px;
          border-radius: 14px;
        }

        .wl-empty-vertical {
          padding: 22px 10px;
          border-radius: 14px;
          background: #f8f9fb;
        }
      `}</style>

      {/* Ajustes globais para o react-slick ficar realmente “smooth” */}
      <style jsx global>{`
        /* Remove "saltos" visuais: garante GPU + evita flicker */
        .card-slides-vertical .slick-track {
          display: flex !important;
          align-items: stretch;
          will-change: transform;
        }
        .card-slides-vertical .slick-slide > div {
          height: 100%;
        }

        /* Evita espaçamento estranho à volta e deixa o loop contínuo mais bonito */
        .card-slides-vertical .slick-list {
          overflow: hidden;
        }

        /* Opcional: dots um pouco mais estáveis */
        .card-slides-vertical .slick-dots {
          bottom: -28px;
        }
      `}</style>
    </div>
  );
};

export default HomeFour;
