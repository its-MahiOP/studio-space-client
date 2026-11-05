"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import { cn } from "cn";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";

import { ButtonLink } from "@/components/shared/button-link";

const slides = [
  {
    index: "01",
    eyebrow: "Photography · Brooklyn, NY",
    title: "Make something",
    accent: "worth the room.",
    description:
      "Cyc walls, daylight rooms and production-ready sets, booked directly from the people who keep them.",
    image: "/images/hero/hero-cyc.jpg",
    alt: "Moody photography studio with a seamless backdrop and two softboxes.",
    feature: "The Cyclorama House",
    price: "$85 / hr",
    href: "/studios?category=photo-studios",
  },
  {
    index: "02",
    eyebrow: "Sound stage · Los Angeles, CA",
    title: "Your next scene",
    accent: "already has a stage.",
    description:
      "Gridded lighting, sound-treated walls and crews who know how to make a shoot day move.",
    image: "/images/hero/hero-stage.jpg",
    alt: "Large dark sound stage with dramatic blue lighting and a lit floor.",
    feature: "Northlight Stage",
    price: "$175 / hr",
    href: "/studios?category=sound-stages",
  },
  {
    index: "03",
    eyebrow: "Podcast room · Montreal, QC",
    title: "A room that",
    accent: "listens back.",
    description:
      "Broadcast-ready microphones, proper acoustic treatment and a little bit of atmosphere.",
    image: "/images/hero/hero-podcast.jpg",
    alt: "Warm, dark podcast studio with two cream armchairs and microphones.",
    feature: "The Listening Room",
    price: "$52 / hr",
    href: "/studios?category=podcast-rooms",
  },
];

export function HeroSlider() {
  const swiperRef = useRef<Swiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const element = document.querySelector<HTMLElement>(".hero-swiper");
    if (!element) return;

    const swiper = new Swiper(element, {
      modules: [A11y, Autoplay, Keyboard],
      loop: true,
      speed: 900,
      slidesPerView: 1,
      grabCursor: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      on: {
        slideChange(instance) {
          setActiveIndex(instance.realIndex);
        },
        autoplayStart() {
          setPlaying(true);
        },
        autoplayStop() {
          setPlaying(false);
        },
      },
    });

    swiperRef.current = swiper;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swiper.autoplay?.stop();
      // Intentional one-time sync with the user's motion preference.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaying(false);
    }

    return () => {
      swiper.destroy(true, true);
      swiperRef.current = null;
    };
  }, []);

  const goTo = (index: number) => {
    swiperRef.current?.slideToLoop(index);
    setActiveIndex(index);
  };

  const toggleAutoplay = () => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;
    if (playing) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
  };

  return (
    <section
      className="grain grain-dark relative isolate overflow-hidden bg-ink text-paper"
      aria-labelledby="hero-heading"
    >
      <div className="hero-swiper h-[min(860px,calc(100svh-70px))] min-h-165 w-full">
        <div className="swiper-wrapper">
          {slides.map((slide, index) => (
            <div className="swiper-slide" key={slide.index}>
              <div className="relative flex h-full min-h-165 w-full items-end">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/78 to-ink/18" />
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-ink/20" />

                <div className="shell relative z-10 w-full pt-28 pb-36 sm:pb-40 lg:pb-36">
                  <div className="max-w-195">
                    <p className="eyebrow flex items-center gap-3 text-paper/58">
                      <span className="inline-block size-1.5 bg-sodium" />
                      {slide.eyebrow}
                    </p>
                    <h1
                      id={index === 0 ? "hero-heading" : undefined}
                      className="display-xl mt-6 text-paper"
                    >
                      {slide.title}{" "}
                      <span className="block italic text-sodium">
                        {slide.accent}
                      </span>
                    </h1>
                    <p className="mt-6 max-w-[46ch] text-[14px] leading-7 text-paper/68 sm:text-[15px]">
                      {slide.description}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <ButtonLink
                        href="/studios"
                        variant="accent"
                        size="lg"
                        className="justify-between sm:justify-center"
                      >
                        Explore Studios
                        <ArrowUpRightIcon />
                      </ButtonLink>
                      <ButtonLink
                        href="/register?intent=host"
                        variant="outline-light"
                        size="lg"
                      >
                        Host Your Space
                      </ButtonLink>
                    </div>
                  </div>
                </div>

                <div className="absolute right-8 bottom-32 z-10 hidden w-56 rounded-2xl border border-paper/18 bg-ink/35 p-4 backdrop-blur-md lg:block">
                  <p className="eyebrow text-paper/45">Featured space</p>
                  <p className="mt-3 font-display text-2xl leading-tight text-paper">
                    {slide.feature}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-paper/18 pt-3">
                    <span className="text-[12px] text-paper/60">{slide.price}</span>
                    <a
                      href={slide.href}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-sodium transition-colors hover:text-paper"
                    >
                      View
                      <ArrowUpRightIcon className="size-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="shell flex items-center justify-between gap-5 border-t border-paper/18 py-5">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.14em] text-paper/75">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.feature}`}
                  aria-current={index === activeIndex}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500 focus-visible:ring-2 focus-visible:ring-sodium/60",
                    index === activeIndex
                      ? "w-12 bg-sodium"
                      : "w-6 bg-paper/25 hover:bg-paper/50",
                  )}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] tracking-[0.14em] text-paper/38">
              / 03
            </span>
          </div>

          <div className="hidden items-center gap-2.5 text-paper/40 md:flex">
            <span className="eyebrow">Scroll to explore</span>
            <ArrowDownIcon className="size-3.5" />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="grid size-9 place-items-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-paper/45 hover:text-paper focus-visible:ring-2 focus-visible:ring-sodium/60"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={toggleAutoplay}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              aria-pressed={!playing}
              className="grid size-9 place-items-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-paper/45 hover:text-paper focus-visible:ring-2 focus-visible:ring-sodium/60"
            >
              {playing ? (
                <PauseIcon className="size-3.5" />
              ) : (
                <PlayIcon className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="grid size-9 place-items-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-paper/45 hover:text-paper focus-visible:ring-2 focus-visible:ring-sodium/60"
            >
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
