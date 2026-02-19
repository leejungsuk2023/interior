import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router";
import { MapPin, Ruler, DollarSign, Tag, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getPortfolio } from "../../lib/api";

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<Awaited<ReturnType<typeof getPortfolio>>>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const numId = id ? parseInt(id, 10) : NaN;
    if (!id || Number.isNaN(numId)) {
      setPortfolio(null);
      setLoading(false);
      return;
    }
    getPortfolio(numId)
      .then(setPortfolio)
      .catch(() => setPortfolio(null))
      .finally(() => setLoading(false));
  }, [id]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightboxIndex((prev) => prev !== null ? prev + 1 : null);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => prev !== null ? prev - 1 : null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, closeLightbox]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">프로젝트를 찾을 수 없습니다.</p>
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-black font-medium hover:underline">
            <ArrowLeft className="w-5 h-5" /> 포트폴리오 목록으로
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImage = `https://images.unsplash.com/photo-1676716244847-3fae1a2afb5b?w=1080`;
  const normalizeUrl = (url: string) => (url.startsWith("http") ? url : fallbackImage);
  const galleryImages: string[] =
    portfolio.imageUrls?.length ? portfolio.imageUrls : [portfolio.imageUrl].filter(Boolean);
  const displayImages = galleryImages.map(normalizeUrl);

  const safeIndex = lightboxIndex !== null
    ? ((lightboxIndex % displayImages.length) + displayImages.length) % displayImages.length
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-10 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> 포트폴리오 목록
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="space-y-4">
            {displayImages.length > 0 && (
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="w-full aspect-[16/10] overflow-hidden rounded-t-3xl cursor-zoom-in block"
              >
                <img
                  src={displayImages[0]}
                  alt={`${portfolio.name} - 1`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            )}
            {displayImages.length > 1 && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayImages.slice(1).map((src, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setLightboxIndex(i + 1)}
                      className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 cursor-zoom-in block"
                    >
                      <img
                        src={src}
                        alt={`${portfolio.name} - ${i + 2}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {portfolio.industry}
              </span>
              <span className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-full">
                {portfolio.style}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-black mb-8 tracking-tight">
              {portfolio.name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">위치</div>
                  <div className="text-lg font-medium text-black">{portfolio.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Ruler className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">면적 · 시공 기간</div>
                  <div className="text-lg font-medium text-black">
                    {portfolio.area} · {portfolio.duration}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl sm:col-span-2">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">총 시공비</div>
                  <div className="text-2xl font-semibold text-black">{portfolio.budget}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Tag className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">업종 · 스타일</div>
                  <div className="text-lg font-medium text-black">
                    {portfolio.industry} · {portfolio.style}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* 라이트박스 */}
      {safeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* 닫기 */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* 이전 */}
          {displayImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(safeIndex - 1); }}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
          )}

          {/* 이미지 */}
          <img
            src={displayImages[safeIndex]}
            alt={`${portfolio.name} - ${safeIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 다음 */}
          {displayImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(safeIndex + 1); }}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </button>
          )}

          {/* 카운터 */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
              {safeIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
