import { Button } from "antd";
import { useState, useRef, useEffect, FC } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RouletteItem {
  value: string;
  label: string;
  color: string;
}

export interface RouletteSpinnerProps {
  items: RouletteItem[];
  onResult?: (item: RouletteItem) => void;
}

// ─── Canvas Drawing ───────────────────────────────────────────────────────────

function drawWheel(
  canvas: HTMLCanvasElement,
  items: RouletteItem[],
  rotation: number,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  const center = size / 2;
  const radius = center - 10;
  const arc = (2 * Math.PI) / items.length;

  ctx.clearRect(0, 0, size, size);

  // Drop shadow base
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 8;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.restore();

  items.forEach((item, i) => {
    const startAngle = rotation + i * arc;
    const endAngle = startAngle + arc;

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner translucent glow ring
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius * 0.3, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();

    // Label
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.font = `bold ${size * 0.032}px 'Segoe UI', sans-serif`;
    ctx.fillText(item.label, radius - 14, 5);
    ctx.restore();
  });

  // Center metallic circle
  const grad = ctx.createRadialGradient(
    center,
    center - 5,
    2,
    center,
    center,
    radius * 0.28,
  );
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.4, "#e0e0e0");
  grad.addColorStop(1, "#999");
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.22, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(center, center, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();
}

// ─── Component ────────────────────────────────────────────────────────────────

const RouletteSpinner: FC<RouletteSpinnerProps> = ({ items, onResult }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);

  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<RouletteItem | null>(null);

  // Initial draw & redraw on items change
  useEffect(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, items, rotationRef.current);
    }
  }, [items]);

  // Cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const spin = (): void => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.random() * 5;
    const extraAngle = Math.random() * 2 * Math.PI;
    const totalRotation = extraSpins * 2 * Math.PI + extraAngle;
    const duration = 4000 + Math.random() * 1000;
    const startTime = performance.now();
    const startRot = rotationRef.current;

    const easeOut = (t: number): number => 1 - Math.pow(1 - t, 4);

    const animate = (now: number): void => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const current = startRot + totalRotation * easeOut(t);

      rotationRef.current = current;
      if (canvasRef.current) {
        drawWheel(canvasRef.current, items, current);
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);

        // Determine winning segment (pointer at top)
        const arc = (2 * Math.PI) / items.length;
        const normalized =
          ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle =
          (2 * Math.PI - normalized + (3 * Math.PI) / 2) % (2 * Math.PI);
        const index = Math.floor(pointerAngle / arc) % items.length;
        const winner = items[index];

        setResult(winner);
        onResult?.(winner);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      {/* Wheel wrapper + pointer */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          <svg width="28" height="36" viewBox="0 0 28 36">
            <polygon points="14,36 0,0 28,0" fill="#FFD700" />
            <polygon points="14,34 2,2 26,2" fill="#FFA500" opacity="0.5" />
          </svg>
        </div>

        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          style={{
            borderRadius: "50%",
            boxShadow:
              "0 0 60px rgba(255,200,100,0.2), 0 20px 60px rgba(0,0,0,0.6)",
            display: "block",
            maxWidth: "min(480px, 90vw)",
            maxHeight: "min(480px, 90vw)",
          }}
        />
      </div>

      {/* Spin button */}
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Berputar..." : "PUTAR!"}
      </Button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RouletteSpinner;
