/**
 * Password strength and weak-password check for Hack Engine.
 * Strength: 0–4 (very weak → strong). Weak list is common demo/leaked passwords.
 */

const WEAK_PASSWORDS = new Set([
  '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', '111111',
  '1234567', 'dragon', '123123', 'baseball', 'abc123', 'football', 'monkey', 'letmein',
  '696969', 'shadow', 'master', '666666', 'qwertyuiop', '123321', 'mustang', '1234567890',
  'michael', '654321', 'pussy', 'superman', '1qaz2wsx', '7777777', 'fuckyou', '121212',
  '000000', 'qazwsx', '123qwe', 'killer', 'trustno1', 'jordan', 'jennifer', 'zxcvbnm',
  'asdfgh', 'hunter', 'buster', 'soccer', 'harley', 'batman', 'andrew', 'tigger',
  'sunshine', 'iloveyou', 'fuckme', '2000', 'charlie', 'robert', 'thomas', 'hockey',
  'ranger', 'daniel', 'starwars', 'klaster', '112233', 'george', 'asshole', 'computer',
  'michelle', 'jessica', 'pepper', '1111', 'zxcvbn', '555555', '11111111', '131313',
  'freedom', '777777', 'pass', 'fuck', 'maggie', '159753', 'aaaaaa', 'ginger', 'princess',
  'joshua', 'cheese', 'amanda', 'summer', 'love', 'ashley', '6969', 'nicole', 'chelsea',
  'biteme', 'matthew', 'access', 'yankees', '987654321', 'dallas', 'austin', 'thunder',
  'taylor', 'matrix', 'william', 'corvette', 'hello', 'martin', 'heather', 'secret',
  'fucker', 'merlin', 'diamond', '1234qwer', 'gfhjkm', 'hammer', 'silver', '222222',
  '88888888', 'anthony', 'justin', 'test', 'bailey', 'q1w2e3r4t5', 'patrick', 'internet',
  'scooter', 'orange', '11111', 'golfer', 'cookie', 'richard', 'samantha', 'bigdog',
  'guitar', 'jackson', 'whatever', 'mickey', 'chicken', 'sparky', 'snoopy', 'maverick',
]);

export function getPasswordStrength(password) {
  if (!password || password.length === 0) return { level: 0, label: '', score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const level = Math.min(4, Math.max(0, score));
  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  return { level, label: labels[level], score };
}

export function isWeakPassword(password) {
  if (!password) return false;
  const normalized = password.toLowerCase().trim();
  return WEAK_PASSWORDS.has(normalized) || WEAK_PASSWORDS.has(password);
}

export function getPasswordStrengthColor(level) {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
  return colors[level] ?? colors[0];
}
