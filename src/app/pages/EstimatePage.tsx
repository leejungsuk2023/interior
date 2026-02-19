import React, { useState } from "react";
import { Check, Coffee, Utensils, Briefcase, Store, ArrowRight, ArrowLeft, Sparkles, X, Phone, Mail, User, MessageSquare } from "lucide-react";
import { createLead } from "../../lib/api";

type BusinessType = "cafe" | "restaurant" | "office" | "retail" | null;

interface EstimateData {
  businessType: BusinessType;
  area: number;
  options: {
    flooring: boolean;
    lighting: boolean;
    hvac: boolean;
    furniture: boolean;
    signage: boolean;
  };
}

interface ContactData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function EstimatePage() {
  const [step, setStep] = useState(1);
  const [estimateData, setEstimateData] = useState<EstimateData>({
    businessType: null,
    area: 30,
    options: {
      flooring: false,
      lighting: false,
      hvac: false,
      furniture: false,
      signage: false,
    },
  });

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const businessTypes = [
    { id: "cafe" as BusinessType, name: "카페", icon: Coffee, basePrice: 180 },
    { id: "restaurant" as BusinessType, name: "레스토랑", icon: Utensils, basePrice: 200 },
    { id: "office" as BusinessType, name: "오피스", icon: Briefcase, basePrice: 150 },
    { id: "retail" as BusinessType, name: "리테일", icon: Store, basePrice: 170 },
  ];

  const additionalOptions = [
    { id: "flooring", name: "바닥재 시공", price: 30 },
    { id: "lighting", name: "조명 설치", price: 25 },
    { id: "hvac", name: "냉난방 시스템", price: 50 },
    { id: "furniture", name: "가구 제작", price: 40 },
    { id: "signage", name: "간판/사인물", price: 35 },
  ];

  const calculateEstimate = () => {
    if (!estimateData.businessType) return { min: 0, max: 0 };
    
    const selectedBusiness = businessTypes.find(b => b.id === estimateData.businessType);
    const basePrice = selectedBusiness?.basePrice || 0;
    
    let optionsPrice = 0;
    additionalOptions.forEach(option => {
      if (estimateData.options[option.id as keyof typeof estimateData.options]) {
        optionsPrice += option.price;
      }
    });

    const totalPricePerPyeong = basePrice + optionsPrice;
    const min = Math.floor((totalPricePerPyeong * estimateData.area) / 10) * 10;
    const max = Math.floor((totalPricePerPyeong * estimateData.area * 1.3) / 10) * 10;

    return { min, max };
  };

  const estimate = calculateEstimate();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactData.name || !contactData.phone || !contactData.email) {
      alert("이름, 연락처, 이메일은 필수 입력 항목입니다.");
      return;
    }
    if (!estimateData.businessType) return;

    setSubmitting(true);
    try {
      const businessName = businessTypes.find((b) => b.id === estimateData.businessType)?.name ?? estimateData.businessType;
      await createLead({
        clientName: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
        message: contactData.message,
        businessType: businessName,
        area: estimateData.area,
        estimateMin: estimate.min,
        estimateMax: estimate.max,
      });
      alert("견적 요청이 완료되었습니다. 곧 연락드리겠습니다.");
      setShowContactModal(false);
      setContactData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("요청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-900 font-medium">1분 완성</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
              인테리어 견적<br />계산기
            </h1>
            <p className="text-xl text-gray-600">
              간단한 정보 입력으로 예상 견적을<br />확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Input Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                {/* Step 1: Business Type Selection */}
                {step === 1 && (
                  <div>
                    <h2 className="text-3xl mb-8">어떤 업종인가요?</h2>
                    <div className="mb-10">
                      <select
                        value={estimateData.businessType || ''}
                        onChange={(e) => setEstimateData({...estimateData, businessType: e.target.value as BusinessType})}
                        className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-all bg-white hover:border-gray-300"
                      >
                        <option value="">업종을 선택하세요</option>
                        {businessTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name} (평당 {type.basePrice}만원~)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-10 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!estimateData.businessType}
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105"
                      >
                        다음 단계 <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Area Input */}
                {step === 2 && (
                  <div>
                    <h2 className="text-3xl mb-8">공간의 면적은 얼마나 되나요?</h2>
                    <div className="mb-10">
                      <div className="text-center mb-8">
                        <div className="text-7xl font-light mb-4">{estimateData.area}<span className="text-4xl text-gray-400 ml-2">평</span></div>
                        <div className="text-lg text-gray-600">약 {Math.round(estimateData.area * 3.3)}㎡</div>
                      </div>
                      
                      <div className="px-4">
                        <input
                          type="range"
                          value={estimateData.area}
                          onChange={(e) => setEstimateData({...estimateData, area: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                          min="10"
                          max="200"
                          step="5"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-3">
                          <span>10평</span>
                          <span>200평</span>
                        </div>
                      </div>

                      <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                        <div className="text-sm text-gray-600 mb-2">💡 참고사항</div>
                        <div className="text-gray-700">1평 = 약 3.3㎡ (제곱미터)</div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 px-8 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" /> 이전
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        다음 단계 <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Options */}
                {step === 3 && (
                  <div>
                    <h2 className="text-3xl mb-8">추가 옵션 선택</h2>
                    <div className="space-y-4 mb-10">
                      {additionalOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${
                            estimateData.options[option.id as keyof typeof estimateData.options]
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            estimateData.options[option.id as keyof typeof estimateData.options]
                              ? 'bg-black border-black'
                              : 'border-gray-300'
                          }`}>
                            {estimateData.options[option.id as keyof typeof estimateData.options] && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={estimateData.options[option.id as keyof typeof estimateData.options]}
                            onChange={(e) => setEstimateData({
                              ...estimateData,
                              options: {
                                ...estimateData.options,
                                [option.id]: e.target.checked,
                              }
                            })}
                            className="sr-only"
                          />
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-lg">{option.name}</div>
                            <div className="text-sm text-gray-600">평당 +{option.price}만원</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 px-8 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" /> 이전
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Estimate Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8 sticky top-[150px]">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-black">실시간 견적 요약</h3>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="pb-6 border-b border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">업종</div>
                    <div className="font-semibold text-lg text-black">
                      {estimateData.businessType 
                        ? businessTypes.find(b => b.id === estimateData.businessType)?.name
                        : <span className="text-gray-400">미선택</span>}
                    </div>
                  </div>

                  <div className="pb-6 border-b border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">면적</div>
                    <div className="font-semibold text-lg text-black">{estimateData.area}평</div>
                  </div>

                  <div className="pb-6 border-b border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">선택한 옵션</div>
                    <div className="text-sm">
                      {Object.entries(estimateData.options).filter(([_, v]) => v).length === 0 ? (
                        <span className="text-gray-400">선택된 옵션 없음</span>
                      ) : (
                        <div className="space-y-2">
                          {additionalOptions.map(option => 
                            estimateData.options[option.id as keyof typeof estimateData.options] && (
                              <div key={option.id} className="flex items-center gap-2 text-gray-700">
                                <Check className="w-4 h-4 text-yellow-600" />
                                <span>{option.name}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-3">예상 견적 범위</div>
                  {estimateData.businessType ? (
                    <>
                      <div className="text-4xl font-light mb-2 bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                        {estimate.min.toLocaleString()}만원
                      </div>
                      <div className="text-lg text-gray-600 mb-8">
                        ~ {estimate.max.toLocaleString()}만원
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl text-gray-300 mb-8">-</div>
                  )}

                  <button 
                    disabled={!estimateData.businessType}
                    className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black rounded-full transition-all font-semibold disabled:from-gray-200 disabled:to-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 shadow-lg hover:shadow-xl hover:scale-105"
                    onClick={() => setShowContactModal(true)}
                  >
                    정확한 견적 요청하기
                  </button>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    * 실제 견적은 현장 상황에 따라 달라질 수 있습니다
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-3xl font-semibold mb-1">정확한 견적 요청</h2>
                <p className="text-sm text-gray-600">연락처 정보를 입력해주세요</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote}>
              <div className="p-8 space-y-6">
                {/* 견적 요약 */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">예상 견적</h3>
                  </div>
                  <div className="text-3xl font-light mb-1 text-gray-900">
                    {estimate.min.toLocaleString()}만원 ~ {estimate.max.toLocaleString()}만원
                  </div>
                  <div className="text-sm text-gray-600">
                    {businessTypes.find(b => b.id === estimateData.businessType)?.name} • {estimateData.area}평
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      이름 <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      연락처 <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      이메일 <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      추가 요청사항
                    </div>
                  </label>
                  <textarea
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    placeholder="프로젝트에 대한 추가 정보나 요청사항을 입력해주세요"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors resize-none"
                    rows={4}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-sm text-blue-900">
                    💡 담당자가 영업일 기준 1~2일 내에 연락드립니다
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex gap-3 rounded-b-3xl border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-all font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black rounded-full transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? "전송 중..." : "견적 요청하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}