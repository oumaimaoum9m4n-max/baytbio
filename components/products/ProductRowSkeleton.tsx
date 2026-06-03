export default function ProductRowSkeleton({ layout }: { layout: "a" | "b" | "pack" }) {
  const isPack = layout === "pack";
  const gridClass =
    layout === "b"
      ? "grid-cols-1 md:grid-cols-[1fr_1.15fr]"
      : layout === "pack"
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-[1.15fr_1fr]";

  return (
    <>
      <div className={`grid min-h-[60vh] ${gridClass} max-md:min-h-0`}>
        <div
          className={`min-h-[280px] animate-pulse bg-linen/60 ${layout === "b" ? "max-md:order-2" : ""}`}
        />
        <div
          className={`flex animate-pulse flex-col justify-center px-20 py-[72px] max-md:px-6 max-md:py-12 ${
            isPack ? "bg-[#3a2810]/20" : "bg-cream/80"
          } ${layout === "b" ? "max-md:order-1" : ""}`}
        >
          <div className="mb-7 h-0.5 w-14 bg-linen" />
          <div className="mb-4 h-4 w-32 bg-linen" />
          <div className="mb-3 h-10 w-3/4 max-w-md bg-linen" />
          <div className="mb-6 h-4 w-48 bg-linen" />
          <div className="mb-2 h-3 w-full max-w-sm bg-linen" />
          <div className="mb-2 h-3 w-full max-w-sm bg-linen" />
          <div className="mb-8 h-3 w-2/3 max-w-xs bg-linen" />
          <div className="flex gap-6">
            <div className="h-12 w-24 bg-linen" />
            <div className="h-12 w-40 bg-linen" />
          </div>
        </div>
      </div>
      <div className="mx-[72px] h-px bg-linen max-md:mx-6" />
    </>
  );
}
