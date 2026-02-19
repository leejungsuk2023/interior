import { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, MapPin, DollarSign, Ruler, Tag } from "lucide-react";
import { getPortfolios } from "../../lib/api";

type ProjectItem = {
  image: string;
  name: string;
  location: string;
  area: string;
  budget: string;
  industry: string;
  style: string;
  duration: string;
};

export function PortfolioPage() {
  const [filters, setFilters] = useState({
    industry: "전체",
    budget: "전체",
    area: "전체",
    style: "전체",
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolios()
      .then((list) => {
        setPortfolioProjects(
          list.map((p) => ({
            image: p.imageUrl.startsWith("http") ? p.imageUrl : `https://images.unsplash.com/photo-1676716244847-3fae1a2afb5b?w=1080`,
            name: p.name,
            location: p.location,
            area: p.area,
            budget: p.budget,
            industry: p.industry,
            style: p.style,
            duration: p.duration,
          }))
        );
      })
      .catch(() => setPortfolioProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter((p) => {
      if (filters.industry !== "전체" && p.industry !== filters.industry) return false;
      if (filters.style !== "전체" && p.style !== filters.style) return false;
      return true;
    });
  }, [portfolioProjects, filters]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredProjects.length));
  };

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Tag className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">500+ 완료 프로젝트</span>
            </div>
            <h1 className="text-6xl md:text-7xl mb-6 tracking-tight">포트폴리오</h1>
            <p className="text-xl text-gray-400">성공적인 프로젝트를 확인하고 영감을 얻으세요</p>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Industry Type Filter */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-2">업종</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-xl appearance-none bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-all cursor-pointer text-sm"
                  value={filters.industry}
                  onChange={(e) => setFilters({...filters, industry: e.target.value})}
                >
                  <option>전체</option>
                  <option>카페</option>
                  <option>레스토랑</option>
                  <option>오피스</option>
                  <option>리테일</option>
                  <option>호텔</option>
                </select>
                <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Budget Range Filter */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-2">예산</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-xl appearance-none bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-all cursor-pointer text-sm"
                  value={filters.budget}
                  onChange={(e) => setFilters({...filters, budget: e.target.value})}
                >
                  <option>전체</option>
                  <option>5천만원 미만</option>
                  <option>5천만원~1억</option>
                  <option>1억~2억</option>
                  <option>2억 이상</option>
                </select>
                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Floor Area Filter */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-2">면적</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-xl appearance-none bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-all cursor-pointer text-sm"
                  value={filters.area}
                  onChange={(e) => setFilters({...filters, area: e.target.value})}
                >
                  <option>전체</option>
                  <option>30평 미만</option>
                  <option>30평~50평</option>
                  <option>50평~100평</option>
                  <option>100평 이상</option>
                </select>
                <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Style Filter */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-2">스타일</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-xl appearance-none bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-all cursor-pointer text-sm"
                  value={filters.style}
                  onChange={(e) => setFilters({...filters, style: e.target.value})}
                >
                  <option>전체</option>
                  <option>모던</option>
                  <option>미니멀</option>
                  <option>럭셔리</option>
                  <option>인더스트리얼</option>
                  <option>빈티지</option>
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-gray-600">
            {loading ? "로딩 중..." : `총 ${filteredProjects.length}개의 프로젝트`}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              최신순
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              가격순
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && visibleProjects.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">등록된 프로젝트가 없습니다.</div>
          )}
          {visibleProjects.map((project, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
            >
              {/* Project Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-xs font-semibold rounded-full">
                    {project.industry}
                  </span>
                  <span className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {project.style}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-8">
                <h3 className="text-2xl mb-3 group-hover:text-yellow-600 transition-colors">{project.name}</h3>
                
                {/* Meta Information Grid */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ruler className="w-4 h-4 flex-shrink-0" />
                    <span>면적 {project.area} · 공사 기간 {project.duration}</span>
                  </div>
                </div>

                {/* Budget - Prominent */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">총 시공비</div>
                  <div className="text-3xl font-light text-black">{project.budget}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-16">
            <button className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:scale-105" onClick={loadMore}>
              더 많은 프로젝트 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}