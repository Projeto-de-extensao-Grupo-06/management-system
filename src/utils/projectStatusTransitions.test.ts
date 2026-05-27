import { describe, it, expect } from 'vitest';
import { validateStatusTransition } from './projectStatusTransitions';

describe('Project Status Transitions (Frontend Logic)', () => {
  
  describe('Blocked Transitions', () => {
    it('should block all transitions from COMPLETED (Terminal State)', () => {
      const states = ['NEW', 'PRE_BUDGET', 'INSTALLED', 'NEGOTIATION_FAILED'];
      states.forEach((target: any) => {
        const result = validateStatusTransition('COMPLETED', target);
        expect(result.type).toBe('blocked');
        expect((result as any).message).toContain('status final');
      });
    });

    it('should block all manual transitions from AWAITING_RETRY', () => {
      const result = validateStatusTransition('AWAITING_RETRY', 'RETRYING' as any);
      expect(result.type).toBe('blocked');
      expect((result as any).message).toContain('único passo possível é aguardar');
    });
  });

  describe('Warning Transitions (Pre-conditions)', () => {
    it('should return a warning when transitioning from NEW to SCHEDULED_TECHNICAL_VISIT', () => {
      const result = validateStatusTransition('NEW', 'SCHEDULED_TECHNICAL_VISIT');
      expect(result.type).toBe('warning');
      expect((result as any).message).toContain('necessário que haja uma visita técnica cadastrada');
    });

    it('should return a warning when transitioning from INSTALLED to COMPLETED', () => {
      const result = validateStatusTransition('INSTALLED', 'COMPLETED');
      expect(result.type).toBe('warning');
      expect((result as any).message).toContain('documento de homologação precisa estar anexado');
    });
  });

  describe('Allowed Transitions', () => {
    it('should allow transitioning from NEW to PRE_BUDGET', () => {
      const result = validateStatusTransition('NEW', 'PRE_BUDGET');
      expect(result.type).toBe('allowed');
    });

    it('should allow transitioning from CLIENT_AWAITING_CONTACT to NEGOTIATION_FAILED', () => {
      const result = validateStatusTransition('CLIENT_AWAITING_CONTACT', 'NEGOTIATION_FAILED');
      expect(result.type).toBe('allowed');
    });
  });

  describe('Identity Transition', () => {
    it('should return allowed if current and target status are the same', () => {
      const result = validateStatusTransition('NEW', 'NEW');
      expect(result.type).toBe('allowed');
    });
  });
});
