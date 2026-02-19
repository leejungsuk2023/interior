import { useState, useEffect } from "react";
import { TrendingUp, FileText, DollarSign, Phone, Mail, MapPin, Clock, MoreVertical, Plus, Send, Sparkles, AlertCircle, X, Image as ImageIcon, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getLeads, getPortfolios, createPortfolio, getSiteSetting, setSiteSetting } from "../../lib/api";
import { isAdminLoggedIn, setAdminLoggedIn, clearAdminSession, checkAdminCredentials } from "../../lib/adminAuth";
import type { Lead, Portfolio } from "../../types";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageSaving, setHeroImageSaving] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    location: "",
    area: "",
    budget: "",
    industry: "",
    style: "",
    duration: "",
    imageUrl: "",
  });

  useEffect(() => {
    setIsAuthenticated(isAdminLoggedIn());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([getLeads(), getPortfolios(), getSiteSetting("hero_image_url")])
      .then(([leadsData, portfoliosData, heroUrl]) => {
        setLeads(leadsData);
        setPortfolios(portfoliosData);
        setHeroImageUrl(heroUrl || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginId.trim() || !loginPassword) {
      setLoginError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    if (checkAdminCredentials(loginId.trim(), loginPassword)) {
      setAdminLoggedIn();
      setIsAuthenticated(true);
      setLoginId("");
      setLoginPassword("");
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  const monthlyData = [
    { month: "8월", inquiries: 32 },
    { month: "9월", inquiries: 45 },
    { month: "10월", inquiries: 38 },
    { month: "11월", inquiries: 52 },
    { month: "12월", inquiries: 61 },
    { month: "1월", inquiries: 48 },
    { month: "2월", inquiries: 15 },
  ];

  const stats = [
    {
      title: "신규 문의",
      value: "8",
      subtext: "오늘",
      icon: AlertCircle,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      badge: true,
    },
    {
      title: "견적 대기",
      value: "12",
      subtext: "처리 필요",
      icon: Clock,
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      badge: false,
    },
    {
      title: "진행중 프로젝트",
      value: "23",
      subtext: "시공중",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      badge: false,
    },
    {
      title: "이달 매출",
      value: "4.2억",
      subtext: "+18% vs 지난달",
      icon: DollarSign,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      badge: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "신규":
        return "bg-red-50 text-red-700 border border-red-200";
      case "진행중":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "견적완료":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "계약완료":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const handleAddPortfolio = async () => {
    if (!newPortfolio.name || !newPortfolio.location) {
      alert("프로젝트명과 위치는 필수 입력 항목입니다.");
      return;
    }

    try {
      const created = await createPortfolio({
        name: newPortfolio.name,
        location: newPortfolio.location,
        area: newPortfolio.area,
        budget: newPortfolio.budget,
        industry: newPortfolio.industry,
        style: newPortfolio.style,
        duration: newPortfolio.duration,
        imageUrl: newPortfolio.imageUrl,
      });
      setPortfolios((prev) => [created, ...prev]);
      setShowPortfolioModal(false);
      setNewPortfolio({
        name: "",
        location: "",
        area: "",
        budget: "",
        industry: "",
        style: "",
        duration: "",
        imageUrl: "",
      });
      alert("포트폴리오가 성공적으로 추가되었습니다!");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-semibold text-black text-center mb-2">관리자 로그인</h1>
          <p className="text-gray-600 text-center mb-8">아이디와 비밀번호를 입력하세요.</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                placeholder="아이디"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                placeholder="비밀번호"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-2xl font-medium hover:bg-gray-900 transition-all"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <h1 className="text-4xl md:text-5xl tracking-tight">대시보드</h1>
            </div>
            <p className="text-xl text-gray-600">비즈니스 현황을 한눈에 확인하세요</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="relative bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all group overflow-hidden">
              {stat.badge && (
                <div className="absolute top-6 right-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
              
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              
              <div className="text-3xl md:text-5xl mb-2 font-light">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-900 font-medium mb-1">{stat.title}</div>
              <div className="text-[10px] md:text-xs text-gray-500">{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* 빠른 작업 - 상단에 배치해 항상 보이도록 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setShowHeroModal(true)}
              className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all text-left group shadow-sm min-h-[75px]"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors shrink-0">
                <ImageIcon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium">Hero 섹션 이미지 변경</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPortfolioModal(true)}
              className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all text-left group shadow-sm min-h-[75px]"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors shrink-0">
                <Plus className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium">포트폴리오 추가</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all text-left group shadow-sm min-h-[75px]"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors shrink-0">
                <Send className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium">SMS 견적 발송</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl mb-2">최근 문의 내역</h2>
                <p className="text-sm text-gray-600">총 {leads.length}건의 문의</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                <Plus className="w-4 h-4" />
                신규 등록
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-gray-500">로딩 중...</div>
              ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      고객명
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      업종
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      면적
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      예산
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      날짜
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{lead.clientName}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{lead.businessType}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{lead.area}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{lead.budget}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{lead.date}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl mb-6 font-semibold">월별 문의 추이</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      color: '#fff',
                      padding: '12px 16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar 
                    dataKey="inquiries" 
                    fill="#000" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Contact Info */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-sm p-8">
              <h3 className="text-xl mb-6 font-semibold text-black">회사 정보</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">주소</div>
                    <div className="text-gray-900">서울시 강남구 테헤란로 123</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">대표 전화</div>
                    <div className="text-gray-900">1588-0000</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">이메일</div>
                    <div className="text-gray-900">contact@interiorpro.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero 이미지 변경 모달 */}
      {showHeroModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-3xl font-semibold mb-1">Hero 섹션 이미지 변경</h2>
                <p className="text-sm text-gray-600">랜딩 페이지 상단 배경 이미지 URL을 입력하세요</p>
              </div>
              <button
                onClick={() => setShowHeroModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">이미지 URL</label>
                <input
                  type="url"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                />
              </div>
              {heroImageUrl && (
                <div className="rounded-2xl overflow-hidden border-2 border-gray-200 aspect-video bg-gray-100">
                  <img
                    src={heroImageUrl}
                    alt="Hero 미리보기"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex gap-3 rounded-b-3xl border-t border-gray-200">
              <button
                onClick={() => setShowHeroModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-all font-medium"
              >
                취소
              </button>
              <button
                disabled={heroImageSaving}
                onClick={async () => {
                  setHeroImageSaving(true);
                  try {
                    await setSiteSetting("hero_image_url", heroImageUrl);
                    alert("저장되었습니다. 랜딩 페이지를 새로고침하면 적용됩니다.");
                    setShowHeroModal(false);
                  } catch (err) {
                    console.error(err);
                    alert("저장에 실패했습니다.");
                  } finally {
                    setHeroImageSaving(false);
                  }
                }}
                className="flex-1 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {heroImageSaving ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-3xl font-semibold mb-1">포트폴리오 추가</h2>
                <p className="text-sm text-gray-600">새로운 프로젝트를 등록하세요</p>
              </div>
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  프로젝트명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  placeholder="예: 브루클린 카페"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  위치 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPortfolio.location}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, location: e.target.value })}
                  placeholder="예: 서울 강남구"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">면적</label>
                  <input
                    type="text"
                    value={newPortfolio.area}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, area: e.target.value })}
                    placeholder="예: 35평"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">예산</label>
                  <input
                    type="text"
                    value={newPortfolio.budget}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, budget: e.target.value })}
                    placeholder="예: 6,200만원"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">업종</label>
                  <select
                    value={newPortfolio.industry}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, industry: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                  >
                    <option value="">선택하세요</option>
                    <option value="카페">카페</option>
                    <option value="레스토랑">레스토랑</option>
                    <option value="오피스">오피스</option>
                    <option value="리테일">리테일</option>
                    <option value="호텔">호텔</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">스타일</label>
                  <select
                    value={newPortfolio.style}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, style: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                  >
                    <option value="">선택하세요</option>
                    <option value="모던">모던</option>
                    <option value="미니멀">미니멀</option>
                    <option value="럭셔리">럭셔리</option>
                    <option value="인더스트리얼">인더스트리얼</option>
                    <option value="빈티지">빈티지</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">시공 기간</label>
                <input
                  type="text"
                  value={newPortfolio.duration}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, duration: e.target.value })}
                  placeholder="예: 3주"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    이미지 URL
                  </div>
                </label>
                <input
                  type="text"
                  value={newPortfolio.imageUrl}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, imageUrl: e.target.value })}
                  placeholder="예: https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                />
                {newPortfolio.imageUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={newPortfolio.imageUrl} 
                      alt="미리보기" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex gap-3 rounded-b-3xl border-t border-gray-200">
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-all font-medium"
              >
                취소
              </button>
              <button
                onClick={handleAddPortfolio}
                className="flex-1 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}