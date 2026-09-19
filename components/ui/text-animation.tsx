"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Lightweight class name combiner
export function cn(...inputs: (string | number | boolean | undefined | null)[]): string {
  return inputs
    .filter((val): val is string => typeof val === "string" && val.trim().length > 0)
    .join(" ");
}

const STYLE_ID = "text-animation-block-reveal-styles";
const CSS = `
.tr-line-wrapper {
  position: relative;
  width: fit-content;
  max-width: 100%;
  display: block;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
.tr-line {
  position: relative;
  display: block;
  width: 100%;
  box-sizing: border-box;
}
.tr-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 101%;
  height: 101%;
  pointer-events: none;
  will-change: transform;
  z-index: 1;
}
`;

export function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

export function getFontSize(size: string = "display"): string {
  switch (size) {
    case "sm":
      return "clamp(0.875rem, 1.5vw, 1.125rem)";
    case "base":
      return "clamp(1rem, 2vw, 1.375rem)";
    case "lg":
      return "clamp(1.375rem, 3vw, 2rem)";
    case "xl":
      return "clamp(1.75rem, 4vw, 2.75rem)";
    case "2xl":
    case "display":
      return "clamp(2rem, 5.5vw, 4.25rem)";
    case "huge":
      return "clamp(2.5rem, 7vw, 5.5rem)";
    default:
      return size;
  }
}

export function getLineHeight(size: string = "display"): number {
  switch (size) {
    case "sm":
      return 1.6;
    case "base":
      return 1.5;
    case "lg":
      return 1.35;
    case "xl":
    case "2xl":
    case "display":
    case "huge":
    default:
      return 1.15;
  }
}

export interface TextAnimationProps {
  text?: string;
  children?: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "display" | "huge" | (string & {});
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
}

export const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  children,
  delay = 0,
  blockColor = "#00f59b",
  stagger = 0.1,
  duration = 0.85,
  size = "display",
  as: ComponentTag = "h2",
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLElement[]>([]);
  const blocksRef = useRef<HTMLElement[]>([]);
  const hasPlayed = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    injectStyles();
    setReady(true);
  }, []);

  useGSAP(
    () => {
      if (!ready || !containerRef.current) return;
      const container = containerRef.current;

      // Clean up previous elements
      container.querySelectorAll(".tr-line-wrapper").forEach((wrapper) => {
        const w = wrapper as HTMLElement;
        const first = w.firstChild as HTMLElement | null;
        if (first && w.parentNode) {
          w.parentNode.insertBefore(first, w);
          w.remove();
        }
      });
      linesRef.current = [];
      blocksRef.current = [];

      const elements = Array.from(container.children) as HTMLElement[];
      elements.forEach((element) => {
        const wrapper = document.createElement("div");
        wrapper.className = "tr-line-wrapper";
        const parent = element.parentNode as HTMLElement;
        if (parent) {
          parent.insertBefore(wrapper, element);
          wrapper.appendChild(element);

          const block = document.createElement("div");
          block.className = "tr-block";
          block.style.backgroundColor = blockColor;
          wrapper.appendChild(block);

          linesRef.current.push(element);
          blocksRef.current.push(block);
        }
      });

      if (hasPlayed.current) {
        gsap.set(linesRef.current, { opacity: 1 });
        gsap.set(blocksRef.current, { scaleX: 0 });
        return;
      }

      gsap.set(linesRef.current, { opacity: 0 });
      gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left center" });

      const playLine = (block: HTMLElement, line: HTMLElement, index: number) =>
        gsap
          .timeline({ delay: delay + index * stagger })
          .to(block, { scaleX: 1, duration, ease: "power4.inOut" })
          .set(line, { opacity: 1 })
          .set(block, { transformOrigin: "right center" })
          .to(block, { scaleX: 0, duration, ease: "power4.inOut" });

      hasPlayed.current = true;
      blocksRef.current.forEach((block, i) =>
        playLine(block, linesRef.current[i], i)
      );
    },
    {
      scope: containerRef,
      dependencies: [ready, delay, blockColor, stagger, duration],
    }
  );

  const fontSize = getFontSize(size);
  const lineHeight = getLineHeight(size);

  const content =
    text || typeof children === "string" ? (
      <ComponentTag
        style={{
          fontSize,
          lineHeight,
          letterSpacing: "-0.025em",
          margin: 0,
          fontWeight: 700,
          textAlign: "center",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          maxWidth: "100%",
        }}
      >
        {text || children}
      </ComponentTag>
    ) : (
      children
    );

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center",
        className
      )}
      style={{
        width: "100%",
        maxWidth: "min(92vw, 68rem)",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box",
        overflowX: "hidden",
        ...style,
      }}
    >
      {content}
    </div>
  );
};

export const TextReveal = TextAnimation;
export default TextAnimation;
