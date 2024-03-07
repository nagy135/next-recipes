"use client";

import { useCallback, useEffect, useRef, MouseEvent } from "react";

// const letters = [
//   [1, 0],
//   [0, 0],
// ];

// const letters = [
//   [1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1],
//   [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
//   [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
//   [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1],
//   [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1],
//   [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
// ]

const letters = [
  [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1],
]

const width = letters[0]!.length;
const height = letters.length;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 150;
const spacingX = CANVAS_WIDTH / width;
const spacingY = CANVAS_HEIGHT / height;
const RADIUS = 6;
const GLOBAL_MARGIN = 100;
const UPDATE_TICK = 2; // ms
const RENDERING_WIDTH = CANVAS_WIDTH + GLOBAL_MARGIN * 2;
const RENDERING_HEIGHT = CANVAS_HEIGHT + GLOBAL_MARGIN * 2;
const MOUSE_RADIUS = 60;

const isInRadius = (pX: number, pY: number, x: number, y: number, r: number): boolean => {
  return Math.sqrt(Math.pow(pX - x, 2) + Math.pow(pY - y, 2)) < r;
}

const mouseMove = (e: MouseEvent, canvasRect: [number, number]) => {
  const x = Math.max(0, e.clientX - canvasRect[0]);
  const y = Math.max(0, e.clientY - canvasRect[1]);

  for (const point of points) {
    if (isInRadius(point.x, point.y, x, y, MOUSE_RADIUS)) {

      const distanceX = point.x - x;
      const pushX = (1 - (RADIUS - distanceX) / RADIUS) * 2;
      const distanceY = point.y - y;
      const pushY = (1 - (RADIUS - distanceY) / RADIUS) * 2;

      point.dx += pushX;
      point.dy += pushY;
    }
  }
};



class Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  dx: number;
  dy: number;
  constructor(x: number, y: number) {
    this.originX = x;
    this.originY = y;
    this.x = x + Math.floor(Math.random() * 25);
    this.y = y + Math.floor(Math.random() * 25);

    this.dx = this.originX - this.x;
    this.dy = this.originY - this.y;

  }
}

const points = new Array<Point>();

for (let iY = 0; iY < height; iY++) {
  for (let iX = 0; iX < width; iX++) {
    if (letters[iY]?.[iX]) {
      const x = iX * spacingX + GLOBAL_MARGIN;
      const y = iY * spacingY + GLOBAL_MARGIN;
      points.push(new Point(x, y));
    }
  }
}

export default function AboutLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastUpdate = useRef<number>(0);
  const canvasRect = useRef<[number, number]>([0, 0]);

  const loop = useCallback(() => {
    if (!canvasRef.current) return;

    const cRect = canvasRef.current.getBoundingClientRect();
    canvasRect.current = [cRect.left, cRect.top];

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, RENDERING_WIDTH, RENDERING_HEIGHT);

    const now = Date.now();
    if (now - lastUpdate.current > UPDATE_TICK) {
      lastUpdate.current = now;
      update();
    }

    for (const point of points) {
      drawCircle(ctx, point.x, point.y);
    }


    requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    requestAnimationFrame(loop);
  }, [])


  const update = useCallback(() => {
    for (const point of points) {
      point.x += point.dx;
      point.y += point.dy;

      const distanceX = point.originX - point.x;
      const distanceY = point.originY - point.y;

      point.dx += distanceX * 0.1;
      point.dy += distanceY * 0.1;

      point.dx *= 0.50;
      point.dy *= 0.50;
    }
  }, [])

  const drawCircle = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  return <>
    <canvas
      onMouseMove={(e) => mouseMove(e, [canvasRect.current[0], canvasRect.current[1]])}
      className="mx-auto mt-5" ref={canvasRef} width={RENDERING_WIDTH} height={RENDERING_HEIGHT} >
    </canvas>
  </>;
}
