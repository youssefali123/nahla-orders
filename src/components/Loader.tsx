/**
 * Fullscreen loading overlay (SSR-safe: pure CSS concentric spinning rings
 * in brand green — no spinner library, so it can render on server and client).
 */
const RING_SIZES = [120, 92, 64];

export default function Loader() {
  return (
    <div
      style={{
        backdropFilter: "blur(3px)",
        backgroundColor: "#000000a0",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999999,
      }}
      className="flex items-center justify-center"
      role="status"
      aria-label="جاري التحميل"
    >
      <span className="relative grid place-items-center" aria-hidden>
        {RING_SIZES.map((size, i) => (
          <span
            key={size}
            className="anim-puff-ring absolute rounded-full border-4 border-transparent"
            style={{
              width: size,
              height: size,
              borderTopColor: "#0fe45a",
              borderRightColor: i === 0 ? "#0fe45a55" : "transparent",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
