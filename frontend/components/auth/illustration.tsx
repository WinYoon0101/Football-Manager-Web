export function RocketIllustration() {
  return (
    <svg
      viewBox="0 0 300 400"
      className="h-96 w-96 text-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Sun */}
      <circle cx="200" cy="80" r="30" />
      <line x1="200" y1="40" x2="200" y2="20" strokeWidth="3" />
      <line x1="240" y1="80" x2="260" y2="80" strokeWidth="3" />
      <line x1="200" y1="120" x2="200" y2="140" strokeWidth="3" />
      <line x1="160" y1="80" x2="140" y2="80" strokeWidth="3" />
      <line x1="235" y1="45" x2="250" y2="30" strokeWidth="3" />
      <line x1="235" y1="115" x2="250" y2="130" strokeWidth="3" />
      <line x1="165" y1="45" x2="150" y2="30" strokeWidth="3" />
      <line x1="165" y1="115" x2="150" y2="130" strokeWidth="3" />

      {/* Rocket Body */}
      <ellipse cx="150" cy="180" rx="20" ry="40" />

      {/* Rocket Window */}
      <circle cx="150" cy="160" r="8" fill="currentColor" />

      {/* Rocket Arms */}
      <line x1="130" y1="170" x2="90" y2="160" strokeWidth="3" />
      <line x1="170" y1="170" x2="210" y2="160" strokeWidth="3" />

      {/* Rocket Left Leg */}
      <line x1="130" y1="210" x2="100" y2="280" strokeWidth="3" />
      <line x1="100" y1="280" x2="95" y2="310" strokeWidth="2" />
      <line x1="100" y1="280" x2="110" y2="310" strokeWidth="2" />

      {/* Rocket Right Leg */}
      <line x1="170" y1="210" x2="200" y2="280" strokeWidth="3" />
      <line x1="200" y1="280" x2="195" y2="310" strokeWidth="2" />
      <line x1="200" y1="280" x2="210" y2="310" strokeWidth="2" />

      {/* Rocket Flames - Left */}
      <path d="M 130 220 L 120 260 L 135 240 Z" fill="currentColor" />

      {/* Rocket Flames - Right */}
      <path d="M 170 220 L 180 260 L 165 240 Z" fill="currentColor" />

      {/* Head */}
      <circle cx="150" cy="110" r="18" />

      {/* Hair/Head detail */}
      <path d="M 140 95 Q 145 90 150 92" strokeWidth="2" />
      <path d="M 150 90 Q 155 88 160 92" strokeWidth="2" />

      {/* Smile */}
      <path d="M 145 115 Q 150 118 155 115" strokeWidth="2" />

      {/* Eyes */}
      <circle cx="145" cy="108" r="1.5" fill="currentColor" />
      <circle cx="155" cy="108" r="1.5" fill="currentColor" />
    </svg>
  )
}
