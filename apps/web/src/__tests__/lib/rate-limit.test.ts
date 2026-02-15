import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getIdentifier } from '../../lib/rate-limit/memory';

describe('Rate Limiting', () => {
  describe('checkRateLimit', () => {
    beforeEach(() => {
      // Tests run with fresh rate limit state
    });

    it('should allow requests within limit', async () => {
      const result = await checkRateLimit('test-id', 10, 10000);
      
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(9);
    });

    it('should track remaining requests', async () => {
      const id = 'test-track-' + Date.now();
      
      await checkRateLimit(id, 3, 10000);
      await checkRateLimit(id, 3, 10000);
      const result = await checkRateLimit(id, 3, 10000);
      
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('should block requests over limit', async () => {
      const id = 'test-block-' + Date.now();
      const limit = 2;
      
      await checkRateLimit(id, limit, 10000);
      await checkRateLimit(id, limit, 10000);
      const result = await checkRateLimit(id, limit, 10000);
      
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', async () => {
      const id = 'test-reset-' + Date.now();
      const windowMs = 100;
      
      const first = await checkRateLimit(id, 1, windowMs);
      expect(first.success).toBe(true);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const second = await checkRateLimit(id, 1, windowMs);
      expect(second.success).toBe(true);
    });
  });

  describe('getIdentifier', () => {
    it('should get IP from x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }
      });
      
      expect(getIdentifier(request)).toBe('1.2.3.4');
    });

    it('should get IP from x-real-ip', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '1.2.3.4' }
      });
      
      expect(getIdentifier(request)).toBe('1.2.3.4');
    });

    it('should fallback to localhost', () => {
      const request = new Request('http://localhost');
      
      expect(getIdentifier(request)).toBe('127.0.0.1');
    });
  });
});
