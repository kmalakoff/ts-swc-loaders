import { hasReliableRegisterHooks, hasRequireModule } from './compat.ts';

export const supportsRequireTypeScript = hasRequireModule && hasReliableRegisterHooks;
