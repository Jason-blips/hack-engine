/** Shared app constants - Hack Engine */

export const APP_NAME = 'Hack Engine';
export const AUTH_KEY = 'hack_engine_auth';

/** 仅用于开发/演示；生产环境必须改为后端校验，前端不可写死真实验证码或支付密码 */
export const DEMO_VERIFICATION_CODE = '040322';
export const DEMO_PAYMENT_PASSWORD = '040322';

/** 验证码/重发冷却等 */
export const VERIFICATION_CODE_LENGTH = 6;
export const RESEND_COOLDOWN_SEC = 60;
export const PAYMENT_PASSWORD_LENGTH = 6;

/** 网络安全 / 黑客主题：深色 + 绿色/青色 */
export const THEME = {
  primary: '#00d26a',
  primaryDark: '#00b859',
  secondary: '#0d9488',
  secondaryDark: '#0f766e',
  gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)',
  gradientButton: 'linear-gradient(to right, #00d26a, #0d9488)',
  gradientButtonHover: 'linear-gradient(to right, #00b859, #0f766e)',
  focusRing: 'rgba(0, 210, 106, 0.3)',
  error: '#ef4444',
  success: '#22c55e',
};
