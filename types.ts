export type ContentType = 'dashboard' | 'caption' | 'bio' | 'hashtags' | 'reel_script' | '30_day_plan' | 'export';
export type PlatformType = 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'whatsapp';

export interface BaseResponse {
  meta?: {
    language: string;
    timestamp: string;
  };
  platform?: PlatformType;
  locked?: boolean;
  unlock_instructions?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  country: string;
  gender: string;
  avatarUrl: string;
}

export type PlanType = 'free' | 'monthly' | 'quarterly' | 'yearly';

export interface CaptionVariant {
  id: number;
  text: string;
  length: 'short' | 'medium' | 'long';
  tone: string;
}

export interface CaptionResponse extends BaseResponse {
  type: 'caption';
  variants: CaptionVariant[];
  suggested_hashtags: string[];
  usage_hint: string;
}

export interface BioVariant {
  id: number;
  text: string;
  length: 'short' | 'medium' | 'long';
  tone: string;
}

export interface BioResponse extends BaseResponse {
  type: 'bio';
  category: 'personal' | 'business' | 'creator' | 'brand';
  variants: BioVariant[];
}

export interface HashtagResponse extends BaseResponse {
  type: 'hashtags';
  core_tags: string[];
  longtail_tags: string[];
  intent: 'reach' | 'niche' | 'engagement';
}

export interface ReelShot {
  t: string;
  action: string;
  caption_on_screen: string;
}

export interface ReelScriptResponse extends BaseResponse {
  type: 'reel_script';
  duration_sec: number;
  shots: ReelShot[];
  hook: string;
}

export interface PlanDay {
  day: number;
  idea: string;
  format: 'reel' | 'carousel' | 'post' | 'story';
  caption_hint: string;
}

export interface ContentPlanResponse extends BaseResponse {
  type: '30_day_plan';
  niche: string;
  days: PlanDay[];
  unlockable_assets: { name: string; locked: boolean }[];
}

export type AppResponse = CaptionResponse | BioResponse | HashtagResponse | ReelScriptResponse | ContentPlanResponse;