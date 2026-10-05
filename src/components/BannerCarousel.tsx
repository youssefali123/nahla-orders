import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Banner } from "@/lib/catalog";

export type BannerTarget =
  | { kind: "category"; categoryId: string }
  | { kind: "subcategory"; categoryId: string; subId: string }
  | { kind: "product"; productId: string }
  | { kind: "url"; url: string }
  | { kind: "none" };

export type ResolvedBanner = {
  banner: Banner;
  target: BannerTarget;
};

function BannerLink({ target, title, children }: { target: BannerTarget; title: string; children: ReactNode }) {
  if (target.kind === "category") {
    return (
      <Link to="/category/$categoryId" params={{ categoryId: target.categoryId }} className="relative block" aria-label={title}>
        {children}
      </Link>
    );
  }
  if (target.kind === "subcategory") {
    return (
      <Link
        to="/category/$categoryId/$subId"
        params={{ categoryId: target.categoryId, subId: target.subId }}
        className="relative block"
        aria-label={title}
      >
        {children}
      </Link>
    );
  }
  if (target.kind === "product") {
    return (
      <Link to="/product/$productId" params={{ productId: target.productId }} className="relative block" aria-label={title}>
        {children}
      </Link>
    );
  }
  if (target.kind === "url") {
    return (
      <a href={target.url} target="_blank" rel="noreferrer" className="relative block" aria-label={title}>
        {children}
      </a>
    );
  }
  return (
    <Link to="/" className="relative block" aria-label={title}>
      {children}
    </Link>
  );
}

export function BannerCarousel({ items }: { items: ResolvedBanner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: "rtl" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {items.map(({ banner, target }, index) => (
            <div key={banner.id} className="min-w-0 flex-[0_0_100%]">
              <BannerLink target={target} title={banner.title ?? ""}>
                <img
                  src={banner.image_url}
                  alt={banner.title ?? ""}
                  width={1280}
                  height={720}
                  {...(index === 0 ? {} : { loading: "lazy" as const })}
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-y-0 left-0 flex w-[45%] flex-col justify-center gap-1 p-4 text-right">
                  <p className="text-base font-extrabold leading-tight text-primary-dark sm:text-2xl">
                    {banner.title}
                  </p>
                </div>
              </BannerLink>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {items.map(({ banner }, i) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`الصورة ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${i === selected ? "w-6 bg-primary" : "w-2 bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
