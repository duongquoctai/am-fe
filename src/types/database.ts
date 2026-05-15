export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PostStatus = 'idle' | 'posting' | 'posted' | 'failed';
export type PlatformType = 'instagram' | 'facebook' | 'tiktok' | 'douyin' | 'xiaohongshu';

export interface Database {
  public: {
    Tables: {
      crawl_jobs: {
        Row: {
          id: string;
          keyword: string;
          platform: PlatformType;
          status: JobStatus;
          target_count: number;
          found_count: number;
          saved_count: number;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          keyword: string;
          platform?: PlatformType;
          status?: JobStatus;
          target_count?: number;
          found_count?: number;
          saved_count?: number;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          keyword?: string;
          platform?: PlatformType;
          status?: JobStatus;
          target_count?: number;
          found_count?: number;
          saved_count?: number;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          job_id: string | null;
          keyword: string;
          platform: PlatformType;
          source_id: string;
          source_url: string;
          author_username: string | null;
          original_caption: string | null;
          storage_url: string;
          thumbnail_url: string | null;
          duration: number | null;
          post_status: PostStatus;
          affiliate_link: string | null;
          posted_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          keyword: string;
          platform: PlatformType;
          source_id: string;
          source_url: string;
          author_username?: string | null;
          original_caption?: string | null;
          storage_url: string;
          thumbnail_url?: string | null;
          duration?: number | null;
          post_status?: PostStatus;
          affiliate_link?: string | null;
          posted_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string | null;
          keyword?: string;
          platform?: PlatformType;
          source_id?: string;
          source_url?: string;
          author_username?: string | null;
          original_caption?: string | null;
          storage_url?: string;
          thumbnail_url?: string | null;
          duration?: number | null;
          post_status?: PostStatus;
          affiliate_link?: string | null;
          posted_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
