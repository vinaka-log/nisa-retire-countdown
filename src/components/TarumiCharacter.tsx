"use client";

export type MascotMood = "start" | "focus" | "cheer" | "happy" | "celebrate";

export type TarumiPose = "idle" | "run";

type Props = {
  mood: MascotMood;
  pose?: TarumiPose;
  size?: number;
  runFrame?: 0 | 1;
  alluring?: boolean;
  /** Square frame with object-fit cover (companion circle / runner). */
  fill?: boolean;
  className?: string;
};

const IDLE_SRC = "/characters/tarumi-idle.png";
const RUN_SRC = "/characters/tarumi-run.png";
/** Bump when replacing public/characters assets (safe on plain <img>). */
const ASSET_V = "20260710-2140";

/** Portrait assets are 3:4; fill mode uses a square cover crop. */
const ASPECT = 1536 / 1024;

function moodFilter(mood: MascotMood, alluring: boolean): string {
  if (alluring) {
    return "brightness(1.08) saturate(1.18) contrast(1.05) hue-rotate(-6deg)";
  }
  switch (mood) {
    case "celebrate":
      return "brightness(1.1) saturate(1.2) contrast(1.05)";
    case "happy":
      return "brightness(1.06) saturate(1.12)";
    case "cheer":
      return "brightness(1.04) saturate(1.08)";
    case "focus":
      return "brightness(0.98) saturate(0.95) contrast(1.02)";
    case "start":
    default:
      return "brightness(1) saturate(1)";
  }
}

export function TarumiCharacter({
  mood,
  pose = "idle",
  size = 120,
  runFrame = 0,
  alluring = false,
  fill = false,
  className = "",
}: Props) {
  const running = pose === "run";
  const src = `${running ? RUN_SRC : IDLE_SRC}?v=${ASSET_V}`;
  const height = fill ? size : Math.round(size * ASPECT);
  const showSparkles = mood === "celebrate" || alluring || mood === "happy";

  return (
    <span
      className={[
        "tarumi-character",
        running ? "tarumi-running" : "",
        alluring ? "tarumi-alluring" : "",
        fill ? "tarumi-fill" : "",
        `tarumi-mood-${mood}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height,
        minWidth: size,
        minHeight: height,
        ["--tarumi-mood-filter" as string]: moodFilter(mood, alluring),
      }}
      data-run-frame={running ? runFrame : undefined}
      aria-hidden
    >
      {/* Plain <img>: next/image rejects cache-bust query strings unless localPatterns is configured. */}
      <img
        key={src}
        src={src}
        alt=""
        width={1024}
        height={1536}
        className="tarumi-photo"
        draggable={false}
        decoding="async"
        fetchPriority={pose === "idle" ? "high" : "auto"}
      />
      {showSparkles && (
        <>
          <span className="tarumi-sparkle tarumi-sparkle-tl">✦</span>
          <span className="tarumi-sparkle tarumi-sparkle-tr tarumi-sparkle-delay">♡</span>
          <span className="tarumi-sparkle tarumi-sparkle-top">✧</span>
        </>
      )}
      {(alluring || mood === "celebrate") && (
        <span className="tarumi-blush-veil" />
      )}
    </span>
  );
}
