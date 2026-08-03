export function OrbitalHero() {
  const nodes = [
    [50, 11],
    [81, 26],
    [88, 58],
    [65, 82],
    [29, 80],
    [11, 51],
    [23, 23],
  ]
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[40rem]"
      aria-label="ASRRO research constellation: space, robotics, AI, electronics, and IoT"
    >
      <style>{`@keyframes orbit-spin{to{transform:rotate(360deg)}}@keyframes signal-pulse{50%{opacity:.32;transform:scale(.86)}}@media(prefers-reduced-motion:reduce){.orbit-motion,.signal-motion{animation:none!important}}`}</style>
      <svg
        viewBox="0 0 100 100"
        className="size-full overflow-visible"
        role="img"
      >
        <defs>
          <radialGradient id="core">
            <stop offset="0" stopColor="#57e6e6" stopOpacity=".75" />
            <stop offset="1" stopColor="#3d8bff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="#203551"
          strokeWidth=".3"
        />
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="#203551"
          strokeWidth=".35"
          strokeDasharray="1 2"
        />
        <g
          className="orbit-motion"
          style={{
            transformOrigin: "50px 50px",
            animation: "orbit-spin 32s linear infinite",
          }}
        >
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="22"
            fill="none"
            stroke="#3d8bff"
            strokeWidth=".7"
            transform="rotate(-24 50 50)"
          />
          <circle cx="91" cy="33" r="1.5" fill="#ffb84d" />
        </g>
        <g
          className="orbit-motion"
          style={{
            transformOrigin: "50px 50px",
            animation: "orbit-spin 44s linear infinite reverse",
          }}
        >
          <ellipse
            cx="50"
            cy="50"
            rx="42"
            ry="15"
            fill="none"
            stroke="#57e6e6"
            strokeOpacity=".6"
            strokeWidth=".5"
            transform="rotate(31 50 50)"
          />
          <circle cx="16" cy="32" r="1.2" fill="#57e6e6" />
        </g>
        <path
          d={
            nodes
              .map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`)
              .join(" ") + " Z"
          }
          fill="none"
          stroke="#57e6e6"
          strokeOpacity=".25"
          strokeWidth=".35"
        />
        {nodes.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r="2.5"
              fill="#06101f"
              stroke={index % 3 === 0 ? "#ffb84d" : "#57e6e6"}
              strokeWidth=".6"
            />
            <circle
              className="signal-motion"
              style={{
                transformOrigin: `${x}px ${y}px`,
                animation: `signal-pulse ${2 + index * 0.15}s ease-in-out infinite`,
              }}
              cx={x}
              cy={y}
              r=".8"
              fill={index % 3 === 0 ? "#ffb84d" : "#57e6e6"}
            />
          </g>
        ))}
        <circle cx="50" cy="50" r="18" fill="url(#core)" opacity=".55" />
        <circle
          cx="50"
          cy="50"
          r="7"
          fill="#08172a"
          stroke="#57e6e6"
          strokeWidth=".8"
        />
        <path d="M47 53l3-8 3 8-3-1.5z" fill="#57e6e6" />
      </svg>
      <div className="absolute top-[43%] left-0 font-mono text-[9px] tracking-[.18em] text-[#71869e] uppercase">
        23.4607° N<br />
        91.9710° E
      </div>
      <div className="absolute right-[2%] bottom-[5%] border-l border-[#ffb84d] pl-3 font-mono text-[9px] tracking-[.18em] text-[#a8b9ca] uppercase">
        7 disciplines
        <br />
        <span className="text-[#ffb84d]">1 shared orbit</span>
      </div>
    </div>
  )
}
