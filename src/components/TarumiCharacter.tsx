"use client";

import { useId } from "react";

export type MascotMood = "start" | "focus" | "cheer" | "happy" | "celebrate";

export type TarumiPose = "idle" | "run";

type Props = {
  mood: MascotMood;
  pose?: TarumiPose;
  size?: number;
  runFrame?: 0 | 1;
  alluring?: boolean;
  className?: string;
};

function mouthPath(mood: MascotMood, alluring: boolean): string {
  if (alluring) return "M 100 143 Q 120 156 140 143 Q 120 150 100 143 Z";
  if (mood === "celebrate" || mood === "happy") {
    return "M 96 142 Q 120 160 144 142 Q 120 154 96 142 Z";
  }
  if (mood === "cheer") return "M 100 143 Q 120 154 140 143";
  return "M 106 144 Q 120 151 134 144";
}

function eyeScale(mood: MascotMood, alluring: boolean): number {
  if (alluring) return 1.1;
  if (mood === "celebrate" || mood === "happy") return 1.1;
  if (mood === "cheer") return 1.06;
  return 1;
}

function Eye({
  x,
  eyeS,
  wink,
  heart,
  uid,
}: {
  x: number;
  eyeS: number;
  wink: boolean;
  heart: boolean;
  uid: string;
}) {
  if (wink) {
    return (
      <g transform={`translate(${x} 108)`}>
        <path
          d={`M ${-14 * eyeS} 0 Q 0 ${8 * eyeS} ${14 * eyeS} 0`}
          stroke="#4C1D47"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path d={`M ${-10 * eyeS} -2 L ${-4 * eyeS} 2`} stroke="#4C1D47" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <g transform={`translate(${x} 108)`}>
      <ellipse cx="0" cy="0" rx={15 * eyeS} ry={19 * eyeS} fill="#FFFFFF" />
      {heart ? (
        <path
          d={`M 0 ${4 * eyeS} C ${-8 * eyeS} ${-4 * eyeS}, ${-12 * eyeS} ${4 * eyeS}, 0 ${12 * eyeS} C ${12 * eyeS} ${4 * eyeS}, ${8 * eyeS} ${-4 * eyeS}, 0 ${4 * eyeS} Z`}
          fill={`url(#${uid}-lip)`}
        />
      ) : (
        <>
          <ellipse cx="1" cy="2" rx={10 * eyeS} ry={13 * eyeS} fill={`url(#${uid}-eye)`} />
          <circle cx="5" cy="-5" r={4.5 * eyeS} fill="#FFFFFF" opacity="0.95" />
          <circle cx="-3" cy="7" r={2.5 * eyeS} fill="#FFFFFF" opacity="0.75" />
        </>
      )}
      <path
        d={`M ${-17 * eyeS} ${-13 * eyeS} Q 0 ${-22 * eyeS} ${17 * eyeS} ${-13 * eyeS}`}
        stroke="#4C1D47"
        strokeWidth="2.8"
        fill="none"
      />
      <path
        d={`M ${-15 * eyeS} ${10 * eyeS} Q 0 ${16 * eyeS} ${15 * eyeS} ${10 * eyeS}`}
        stroke="#4C1D47"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
    </g>
  );
}

export function TarumiCharacter({
  mood,
  pose = "idle",
  size = 120,
  runFrame = 0,
  alluring = false,
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const flirty = mood === "cheer" || mood === "happy" || mood === "celebrate" || alluring;
  const heartEyes = alluring || mood === "happy" || mood === "celebrate";
  const winkRight = flirty && !heartEyes && pose === "idle";
  const eyeS = eyeScale(mood, alluring);
  const running = pose === "run";
  const legA = runFrame === 0;
  const smiling = flirty;

  return (
    <svg
      viewBox="0 0 240 300"
      width={size}
      height={size * (300 / 240)}
      className={`tarumi-character ${running ? "tarumi-running" : ""} ${alluring ? "tarumi-alluring" : ""} ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD4B8" />
          <stop offset="50%" stopColor="#F0A878" />
          <stop offset="100%" stopColor="#E08B5A" />
        </linearGradient>
        <linearGradient id={`${uid}-hair`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8C9" />
          <stop offset="40%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
        <linearGradient id={`${uid}-hair-shadow`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id={`${uid}-eye`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
        <linearGradient id={`${uid}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9EB5" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id={`${uid}-skirt`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDA4D6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id={`${uid}-lip`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <radialGradient id={`${uid}-cheek`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4D8D" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF4D8D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-gloss`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#9D174D" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter={`url(#${uid}-soft)`} transform={running ? "translate(10 8) rotate(5 118 150)" : "translate(4 0)"}>
        <g className="tarumi-hair-back">
          <ellipse cx="62" cy="120" rx="30" ry="58" fill={`url(#${uid}-hair-shadow)`} />
          <ellipse cx="178" cy="120" rx="30" ry="58" fill={`url(#${uid}-hair-shadow)`} />
          <path d="M 38 86 C 22 122 26 176 48 210 C 56 194 52 142 64 106 Z" fill={`url(#${uid}-hair)`} />
          <path d="M 202 86 C 218 122 214 176 192 210 C 184 194 188 142 176 106 Z" fill={`url(#${uid}-hair)`} />
        </g>

        {running ? (
          <g className="tarumi-legs">
            {legA ? (
              <>
                <path d="M 102 236 Q 98 258 94 278 L 108 280 L 116 238 Z" fill={`url(#${uid}-skin)`} />
                <path d="M 134 236 Q 152 262 158 278 L 144 280 L 128 238 Z" fill={`url(#${uid}-skin)`} />
              </>
            ) : (
              <>
                <path d="M 102 236 Q 84 260 78 278 L 92 280 L 116 238 Z" fill={`url(#${uid}-skin)`} />
                <path d="M 134 236 Q 140 258 144 278 L 130 280 L 128 238 Z" fill={`url(#${uid}-skin)`} />
              </>
            )}
            <ellipse cx="98" cy="279" rx="12" ry="5" fill="#FFF" />
            <ellipse cx="142" cy="279" rx="12" ry="5" fill="#FFF7ED" />
          </g>
        ) : (
          <g className="tarumi-legs" transform="translate(-6 0)">
            <path d="M 104 238 Q 100 262 98 284 L 114 286 L 120 240 Z" fill={`url(#${uid}-skin)`} />
            <path d="M 136 236 Q 148 264 154 286 L 138 288 L 128 238 Z" fill={`url(#${uid}-skin)`} />
            <ellipse cx="104" cy="285" rx="13" ry="5" fill="#FFFFFF" />
            <ellipse cx="148" cy="285" rx="13" ry="5" fill="#FFF1F2" />
          </g>
        )}

        <path
          d="M 84 206 C 88 224 104 232 120 234 C 136 232 152 224 156 206 L 148 192 L 92 192 Z"
          fill={`url(#${uid}-skirt)`}
        />
        <path d="M 92 206 L 148 206" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" />

        <ellipse cx="120" cy="198" rx="22" ry="5" fill={`url(#${uid}-skin)`} opacity="0.9" />

        <path
          d="M 88 168 C 90 182 102 190 120 192 C 138 190 150 182 152 168 C 150 158 136 150 120 150 C 104 150 90 158 88 168 Z"
          fill={`url(#${uid}-top)`}
        />
        <path d="M 96 154 C 104 146 136 146 144 154 L 140 164 C 132 158 108 158 100 164 Z" fill={`url(#${uid}-skin)`} />
        <path d="M 108 168 L 120 180 L 132 168" stroke="#FFF1F2" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />

        {mood === "celebrate" ? (
          <>
            <path d="M 86 178 C 66 154 54 138 48 118" stroke={`url(#${uid}-skin)`} strokeWidth="13" strokeLinecap="round" fill="none" />
            <path d="M 154 178 C 174 154 186 138 192 118" stroke={`url(#${uid}-skin)`} strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="114" r="10" fill={`url(#${uid}-skin)`} />
            <circle cx="194" cy="114" r="10" fill={`url(#${uid}-skin)`} />
          </>
        ) : running ? (
          <>
            <path
              d={legA ? "M 88 180 C 70 172 58 162 52 150" : "M 88 180 C 72 186 60 180 54 168"}
              stroke={`url(#${uid}-skin)`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={legA ? "M 152 180 C 170 186 182 180 188 168" : "M 152 180 C 168 172 180 162 188 150"}
              stroke={`url(#${uid}-skin)`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <path d="M 86 178 C 72 194 66 210 70 224" stroke={`url(#${uid}-skin)`} strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 154 178 C 176 170 186 156 180 142" stroke={`url(#${uid}-skin)`} strokeWidth="12" strokeLinecap="round" fill="none" />
            <ellipse cx="182" cy="138" rx="9" ry="8" fill={`url(#${uid}-skin)`} />
            <circle cx="178" cy="142" r="2.5" fill="#F472B6" />
            <circle cx="184" cy="140" r="2.5" fill="#EC4899" />
            <circle cx="186" cy="136" r="2.5" fill="#FB7185" />
          </>
        )}

        <ellipse cx="118" cy="116" rx="52" ry="56" fill={`url(#${uid}-skin)`} />
        <path d="M 92 148 Q 118 168 146 148" stroke="#E08B5A" strokeWidth="1.5" fill="none" opacity="0.45" />
        <ellipse cx="84" cy="130" rx="18" ry="12" fill={`url(#${uid}-cheek)`} />
        <ellipse cx="152" cy="130" rx="18" ry="12" fill={`url(#${uid}-cheek)`} />
        {alluring && (
          <>
            <ellipse cx="78" cy="126" rx="10" ry="7" fill={`url(#${uid}-cheek)`} opacity="0.7" />
            <ellipse cx="158" cy="126" rx="10" ry="7" fill={`url(#${uid}-cheek)`} opacity="0.7" />
          </>
        )}

        <Eye x={120 - 36 * eyeS} eyeS={eyeS} wink={false} heart={heartEyes} uid={uid} />
        <Eye x={120 + 36 * eyeS} eyeS={eyeS} wink={winkRight} heart={heartEyes} uid={uid} />

        <ellipse cx="120" cy="136" rx="2.5" ry="2" fill="#E08B5A" opacity="0.5" />
        <path d={mouthPath(mood, alluring)} fill={`url(#${uid}-lip)`} />
        <ellipse cx="114" cy="144" rx="8" ry="3" fill={`url(#${uid}-gloss)`} opacity={smiling ? 0.9 : 0.55} className="tarumi-lip-gloss" />
        {smiling && (
          <path d="M 102 141 Q 120 148 138 141" stroke="#FFFFFF" strokeWidth="2.2" fill="none" opacity="0.7" strokeLinecap="round" />
        )}

        <g className="tarumi-hair-front">
          <path
            d="M 62 90 C 76 52 102 38 120 38 C 138 38 164 52 178 90 C 170 66 146 52 120 52 C 94 52 70 66 62 90 Z"
            fill={`url(#${uid}-hair)`}
          />
          <path d="M 84 74 C 94 58 108 52 118 58 C 106 70 98 84 90 98 Z" fill={`url(#${uid}-hair-shadow)`} opacity="0.4" />
          <path d="M 156 74 C 146 58 132 52 122 58 C 134 70 142 84 150 98 Z" fill={`url(#${uid}-hair-shadow)`} opacity="0.4" />
        </g>

        <circle cx="78" cy="68" r="8" fill="#FBCFE8" stroke="#EC4899" strokeWidth="2" />
        <circle cx="78" cy="68" r="3" fill="#FFFFFF" />
        <circle cx="162" cy="68" r="8" fill="#E9D5FF" stroke="#C084FC" strokeWidth="2" />
        <circle cx="162" cy="68" r="3" fill="#FFFFFF" />
        <circle cx="70" cy="116" r="5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="170" cy="116" r="5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />

        {(mood === "celebrate" || alluring) && (
          <>
            <text x="28" y="82" fontSize="20" className="tarumi-sparkle">
              💋
            </text>
            <text x="188" y="86" fontSize="18" className="tarumi-sparkle tarumi-sparkle-delay">
              💖
            </text>
            <text x="104" y="30" fontSize="16" className="tarumi-sparkle">
              ✨
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
