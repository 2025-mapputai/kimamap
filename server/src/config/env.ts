import dotenv from 'dotenv';
import path from 'path';

// .envファイルの読み込み
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * 環境変数の型定義
 */
export interface Env {
  PORT: number;
  NODE_ENV: 'development' | 'production';
  GOOGLE_MAPS_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

/**
 * 環境変数を取得して型安全にアクセスする
 */
class EnvConfig {
  private env: Env;

  constructor() {
    this.env = this.loadEnv();
    this.validate();
  }

  /**
   * 環境変数を読み込む
   */
  private loadEnv(): Env {
    return {
      PORT: this.parseNumber(process.env.PORT, 3000),
      NODE_ENV: this.parseNodeEnv(process.env.NODE_ENV),
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    };
  }

  /**
   * 環境変数のバリデーション
   */
  private validate(): void {
    // 必須の環境変数をチェック
    const requiredEnvVars: (keyof Env)[] = ['PORT', 'NODE_ENV'];

    for (const envVar of requiredEnvVars) {
      if (this.env[envVar] === undefined || this.env[envVar] === null) {
        throw new Error(`環境変数 ${envVar} が設定されていません`);
      }
    }

    // 本番環境では警告を出す（将来的に必要になる環境変数）
    if (this.env.NODE_ENV === 'production') {
      if (!this.env.GOOGLE_MAPS_API_KEY) {
        console.warn('警告: GOOGLE_MAPS_API_KEY が設定されていません（将来必要になります）');
      }
    }
  }

  /**
   * 数値をパースする（デフォルト値対応）
   */
  private parseNumber(value: string | undefined, defaultValue: number): number {
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * NODE_ENVをパースする
   */
  private parseNodeEnv(value: string | undefined): 'development' | 'production' {
    if (value === 'production') {
      return 'production';
    }
    return 'development';
  }

  /**
   * 環境変数を取得する
   */
  public get(): Env {
    return this.env;
  }

  /**
   * 開発環境かどうかを判定する
   */
  public isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }

  /**
   * 本番環境かどうかを判定する
   */
  public isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }
}

// シングルトンインスタンス
const envConfig = new EnvConfig();

export default envConfig;
