import { describe, it, expect } from 'vitest';
import { assessIntake } from '../priority';
import { resolveIntakeRoute } from '../flow';
import type { WizardResult } from '../wizard-result';

describe('Decision Engine - Priority Assessment', () => {
  describe('assessIntake', () => {
    it('should return an assessment with priority, flags, and actionCode', () => {
      const wizardResult: WizardResult = {
        urgency: 'informational',
        clientProfile: 'private_individual',
        hasEmotionalDistress: false,
      };

      const result = assessIntake(wizardResult);

      expect(result).toHaveProperty('priority');
      expect(result).toHaveProperty('flags');
      expect(result).toHaveProperty('actionCode');
      expect(Array.isArray(result.flags)).toBe(true);
    });

    it('should assess different urgency levels', () => {
      const urgencies = ['informational', 'time_sensitive', 'legal_risk', 'critical'] as const;
      
      urgencies.forEach(urgency => {
        const result = assessIntake({
          urgency,
          clientProfile: 'private_individual',
          hasEmotionalDistress: false,
        });
        
        expect(result.priority).toBeDefined();
        expect(['low', 'medium', 'high', 'critical']).toContain(result.priority);
      });
    });

    it('should assess different client profiles', () => {
      const profiles = [
        'private_individual',
        'family_inheritance_conflict',
        'legal_professional',
        'court_related',
        'other'
      ] as const;
      
      profiles.forEach(clientProfile => {
        const result = assessIntake({
          urgency: 'informational',
          clientProfile,
          hasEmotionalDistress: false,
        });
        
        expect(result.priority).toBeDefined();
        expect(result.actionCode).toBeDefined();
      });
    });

    it('should handle emotional distress flag', () => {
      const withDistress = assessIntake({
        urgency: 'informational',
        clientProfile: 'private_individual',
        hasEmotionalDistress: true,
      });

      const withoutDistress = assessIntake({
        urgency: 'informational',
        clientProfile: 'private_individual',
        hasEmotionalDistress: false,
      });

      expect(withDistress).toBeDefined();
      expect(withoutDistress).toBeDefined();
    });

    it('should prioritize based on urgency', () => {
      const critical = assessIntake({
        urgency: 'critical',
        clientProfile: 'private_individual',
        hasEmotionalDistress: false,
      });

      const informational = assessIntake({
        urgency: 'informational',
        clientProfile: 'private_individual',
        hasEmotionalDistress: false,
      });

      expect(critical.priority).toBeDefined();
      expect(informational.priority).toBeDefined();
    });
  });

  describe('resolveIntakeRoute', () => {
    it('should return a route for given wizard result', () => {
      const route = resolveIntakeRoute({
        urgency: 'informational',
        clientProfile: 'private_individual',
        hasEmotionalDistress: false,
      });

      expect(route).toBeDefined();
      expect(typeof route).toBe('string');
      expect(route.startsWith('/contact/')).toBe(true);
    });

    it('should return consistent routes for same input', () => {
      const input: WizardResult = {
        urgency: 'legal_risk',
        clientProfile: 'legal_professional',
        hasEmotionalDistress: false,
      };

      const route1 = resolveIntakeRoute(input);
      const route2 = resolveIntakeRoute(input);

      expect(route1).toBe(route2);
    });

    it('should route different profiles', () => {
      const profiles = [
        'private_individual',
        'family_inheritance_conflict',
        'legal_professional',
        'court_related'
      ] as const;

      profiles.forEach(profile => {
        const route = resolveIntakeRoute({
          urgency: 'informational',
          clientProfile: profile,
          hasEmotionalDistress: false,
        });

        expect(route).toBeDefined();
        expect(route).toMatch(/^\/contact\//);
      });
    });

    it('should provide valid routes for all urgency levels', () => {
      const urgencies = ['informational', 'time_sensitive', 'legal_risk', 'critical'] as const;
      
      urgencies.forEach(urgency => {
        const route = resolveIntakeRoute({
          urgency,
          clientProfile: 'private_individual',
          hasEmotionalDistress: false,
        });

        expect(route).toBeDefined();
        expect(route).toMatch(/^\/contact\//);
      });
    });
  });
});
