import homeImage from "@/assets/home.jpeg";

/** Branded loading screen shown only while the homepage data loads. */
export function HomeLoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[99999999] grid place-items-center bg-background"
      aria-busy="true"
      aria-label="جاري تحميل الصفحة الرئيسية"
    >
      <div className="flex flex-col items-center gap-4 px-8 text-center">
        <img
          src={homeImage}
          alt="نحلة"
          className="anim-float h-44 w-44 rounded-[2rem] object-cover shadow-card sm:h-56 sm:w-56"
        />
        <p className="text-lg font-extrabold text-primary-dark">جاري التحميل... 🐝</p>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="anim-dot h-2.5 w-2.5 rounded-full bg-primary"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
