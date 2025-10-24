// Step 1 ビルドテスト用の仮エントリーポイント
// Step 5 で実装予定

import envConfig from './config/env';
import { planRequestSchema } from './types/api';

console.log('Environment configuration loaded');
console.log('PORT:', envConfig.get().PORT);
console.log('NODE_ENV:', envConfig.get().NODE_ENV);

// 型定義とスキーマが正しく読み込めることを確認
console.log('API types and schemas loaded successfully');
