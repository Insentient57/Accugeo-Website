"use client";

import React, { useEffect, useRef } from "react";

type Direction = "diagonal" | "up" | "right" | "down" | "left";

type SquaresProps = {
  speed?: number; // multiplier; 1 is baseline speed
  squareSize?: number; // in CSS pixels
  direction?: Direction;
  borderColor?: string;
  hoverFillColor?: string; // reserved for interactive mode (not enabled by default)
  interactive?: boolean; // if true, enables pointer interactions (hover)
};

/**
 * Squares - lightweight, robust canvas background
 *
 * - Respects prefers-reduced-motion: will render a single static frame if reduction is requested.
 * - Uses ResizeObserver and devicePixelRatio-aware sizing to avoid blurriness and size mismatch.
 * - Minimal footprint and no external dependencies.
 * - Non-interactive by default (pointer-events: none). Set `interactive` to true to enable hover behavior.
 */
export default function Squares({
  speed = 0.5,
  squareSize = 40,
  direction = "diagonal",
  borderColor = "#271E37",
  hoverFillColor = "#222222",
  interactive = false,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;

    // Use non-null asserted local references so nested functions don't see nullable types.
    const canvasEl = canvas;
    const ctx = ctxRaw as CanvasRenderingContext2D;

    // helper: set canvas size to match CSS layout and DPR
    function resizeCanvas(rect?: DOMRect) {
      const r = rect || canvasEl.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(r.width));
      const cssH = Math.max(1, Math.floor(r.height));
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      // backing store size
      canvasEl.width = Math.max(1, Math.floor(cssW * dpr));
      canvasEl.height = Math.max(1, Math.floor(cssH * dpr));
      // keep CSS size stable
      canvasEl.style.width = `${cssW}px`;
      canvasEl.style.height = `${cssH}px`;

      // normalize drawing to CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Draw one frame based on offsetRef and hoverRef
    function drawFrame() {
      const rect = canvasEl.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      if (w === 0 || h === 0) return;

      // clear
      ctx.clearRect(0, 0, w, h);

      // subtle vignette background so squares read on dark backgrounds
      const gradient = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.sqrt(w * w + h * h) / 2,
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // very subtle wash to lift grid off pure black
      ctx.save();
      ctx.globalAlpha = 0.02;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // compute start offsets in CSS pixels
      const startX = -squareSize + (offsetRef.current.x % squareSize);
      const startY = -squareSize + (offsetRef.current.y % squareSize);

      const cols = Math.ceil(w / squareSize) + 2;
      const rows = Math.ceil(h / squareSize) + 2;

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const x = startX + col * squareSize;
          const y = startY + row * squareSize;

          // faint tile fill to be visible on solid black
          ctx.save();
          ctx.globalAlpha = 0.03;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, squareSize, squareSize);
          ctx.restore();

          // hover fill when interactive
          if (interactive && hoverRef.current) {
            const mx = hoverRef.current.x;
            const my = hoverRef.current.y;
            if (
              mx >= x &&
              mx < x + squareSize &&
              my >= y &&
              my < y + squareSize
            ) {
              ctx.save();
              ctx.globalAlpha = 0.6;
              ctx.fillStyle = String(hoverFillColor);
              ctx.fillRect(x, y, squareSize, squareSize);
              ctx.restore();
            }
          }

          // subtle highlight then border
          ctx.save();
          ctx.globalAlpha = 0.06;
          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(x + 0.5, y + 0.5, squareSize - 1, squareSize - 1);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.6;
          ctx.strokeStyle = String(borderColor);
          ctx.strokeRect(x + 0.5, y + 0.5, squareSize - 1, squareSize - 1);
          ctx.restore();
        }
      }
    }

    // animation step
    let last = performance.now();
    function step(now: number) {
      const dt = Math.max(0, (now - last) / 1000);
      last = now;

      const effectiveSpeed = Math.max(0, speed) * 60; // px/sec baseline
      const move = effectiveSpeed * dt;

      switch (direction) {
        case "left":
          offsetRef.current.x =
            (offsetRef.current.x - move + squareSize) % squareSize;
          break;
        case "right":
          offsetRef.current.x = (offsetRef.current.x + move) % squareSize;
          break;
        case "up":
          offsetRef.current.y =
            (offsetRef.current.y - move + squareSize) % squareSize;
          break;
        case "down":
          offsetRef.current.y = (offsetRef.current.y + move) % squareSize;
          break;
        case "diagonal":
        default:
          offsetRef.current.x = (offsetRef.current.x + move) % squareSize;
          offsetRef.current.y = (offsetRef.current.y + move) % squareSize;
          break;
      }

      drawFrame();
      rafRef.current = requestAnimationFrame(step);
    }

    // respect prefers-reduced-motion: draw a single static frame and don't animate
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // sizing + start
    resizeCanvas();
    drawFrame();

    if (!prefersReduced) {
      last = performance.now();
      rafRef.current = requestAnimationFrame(step);
    }

    // ResizeObserver to handle layout changes
    if (typeof ResizeObserver !== "undefined") {
      roRef.current = new ResizeObserver((entries) => {
        for (const e of entries) {
          if (e.target === canvasEl) {
            resizeCanvas(e.contentRect as DOMRect);
            drawFrame();
          }
        }
      });
      roRef.current.observe(canvasEl);
    } else {
      // fallback window resize listener
      const onWinResize = () => {
        resizeCanvas();
        drawFrame();
      };
      window.addEventListener("resize", onWinResize);
      // cleanup will remove this
      return () => {
        window.removeEventListener("resize", onWinResize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (roRef.current) {
          roRef.current.disconnect();
          roRef.current = null;
        }
      };
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
    };
  }, [direction, speed, squareSize, borderColor, hoverFillColor, interactive]);

  // pointer interactions (only meaningful if interactive=true)
  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // use a local non-null asserted reference for event handlers
    const canvasEl = canvas as HTMLCanvasElement;

    function onMove(e: MouseEvent) {
      const rect = canvasEl.getBoundingClientRect();
      hoverRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() {
      hoverRef.current = null;
    }

    canvasEl.addEventListener("mousemove", onMove);
    canvasEl.addEventListener("mouseleave", onLeave);

    // touch support
    function onTouch(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvasEl.getBoundingClientRect();
      hoverRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    canvasEl.addEventListener("touchstart", onTouch, { passive: true });
    canvasEl.addEventListener("touchmove", onTouch, { passive: true });
    canvasEl.addEventListener("touchend", onLeave);

    return () => {
      canvasEl.removeEventListener("mousemove", onMove);
      canvasEl.removeEventListener("mouseleave", onLeave);
      canvasEl.removeEventListener("touchstart", onTouch);
      canvasEl.removeEventListener("touchmove", onTouch);
      canvasEl.removeEventListener("touchend", onLeave);
    };
  }, [interactive, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // absolutely positioned; parent should control stacking. pointer-events none by default so it won't block UI.
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        border: "none",
        background: "transparent",
        zIndex: 0,
        pointerEvents: interactive ? undefined : "none",
      }}
    />
  );
}
