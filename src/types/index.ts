/** 견적 문의(리드) 상태 */
export type LeadStatus = "신규" | "진행중" | "견적완료" | "계약완료";

/** 견적 문의(리드) */
export interface Lead {
  id: number;
  clientName: string;
  phone: string;
  email: string;
  message: string;
  businessType: string;
  area: string;
  budget: string;
  estimateMin?: number;
  estimateMax?: number;
  status: LeadStatus;
  date: string;
  createdAt?: string;
}

/** 포트폴리오 프로젝트 */
export interface Portfolio {
  id: number;
  name: string;
  location: string;
  area: string;
  budget: string;
  industry: string;
  style: string;
  duration: string;
  imageUrl: string;
  createdAt?: string;
}

/** 랜딩/포트폴리오 카드용 (태그 등) */
export interface PortfolioCard extends Portfolio {
  image: string;
  tags?: string[];
  price?: string;
  title?: string;
}

/** 리뷰 */
export interface Review {
  id?: number;
  name: string;
  business: string;
  rating: number;
  comment: string;
  image: string;
}

/** 견적 제출 시 넣는 데이터 */
export interface CreateLeadInput {
  clientName: string;
  phone: string;
  email: string;
  message: string;
  businessType: string;
  area: number;
  estimateMin: number;
  estimateMax: number;
  options?: Record<string, boolean>;
}

/** 포트폴리오 추가 시 넣는 데이터 */
export interface CreatePortfolioInput {
  name: string;
  location: string;
  area: string;
  budget: string;
  industry: string;
  style: string;
  duration: string;
  imageUrl: string;
}
