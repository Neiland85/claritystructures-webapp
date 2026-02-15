import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  IntakeReceivedEvent,
  IntakePriorityAssessedEvent,
  IntakeAssignedEvent,
  IntakeClosedEvent,
  EventDispatcher,
} from '../index';

describe('Domain Events', () => {
  describe('IntakeReceivedEvent', () => {
    it('should create event with data', () => {
      const event = new IntakeReceivedEvent(
        'intake_123',
        'test@example.com',
        'critical'
      );

      expect(event.eventName).toBe('IntakeReceived');
      expect(event.intakeId).toBe('intake_123');
      expect(event.email).toBe('test@example.com');
      expect(event.urgency).toBe('critical');
      expect(event.occurredAt).toBeInstanceOf(Date);
      expect(event.eventId).toBeDefined();
    });

    it('should serialize to JSON', () => {
      const event = new IntakeReceivedEvent(
        'intake_123',
        'test@example.com',
        'critical'
      );

      const json = event.toJSON();

      expect(json).toHaveProperty('eventId');
      expect(json).toHaveProperty('eventName', 'IntakeReceived');
      expect(json).toHaveProperty('intakeId', 'intake_123');
      expect(json).toHaveProperty('occurredAt');
    });
  });

  describe('IntakePriorityAssessedEvent', () => {
    it('should create event with priority', () => {
      const event = new IntakePriorityAssessedEvent(
        'intake_123',
        'high',
        'system'
      );

      expect(event.eventName).toBe('IntakePriorityAssessed');
      expect(event.priority).toBe('high');
    });
  });

  describe('EventDispatcher', () => {
    let dispatcher: EventDispatcher;

    beforeEach(() => {
      dispatcher = new EventDispatcher();
    });

    it('should subscribe and dispatch events', async () => {
      const handler = vi.fn();
      
      dispatcher.subscribe('IntakeReceived', handler);
      
      const event = new IntakeReceivedEvent(
        'intake_123',
        'test@example.com',
        'critical'
      );
      
      await dispatcher.dispatch(event);
      
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should call multiple handlers', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      dispatcher.subscribe('IntakeReceived', handler1);
      dispatcher.subscribe('IntakeReceived', handler2);
      
      const event = new IntakeReceivedEvent(
        'intake_123',
        'test@example.com',
        'critical'
      );
      
      await dispatcher.dispatch(event);
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should handle async handlers', async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      
      dispatcher.subscribe('IntakeReceived', handler);
      
      const event = new IntakeReceivedEvent(
        'intake_123',
        'test@example.com',
        'critical'
      );
      
      await dispatcher.dispatch(event);
      
      expect(handler).toHaveBeenCalled();
    });

    it('should continue on handler error', async () => {
      const errorHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const successHandler = vi.fn();
      
      dispatcher.subscribe('IntakeReceived', errorHandler);
      dispatcher.subscribe('IntakeReceived', successHandler);
      
      const event = new IntakeReceivedEvent(
        'intake_123',
        'test@example.com',
        'critical'
      );
      
      await dispatcher.dispatch(event);
      
      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
    });

    it('should clear all handlers', () => {
      dispatcher.subscribe('IntakeReceived', vi.fn());
      dispatcher.subscribe('IntakePriorityAssessed', vi.fn());
      
      expect(dispatcher.getHandlerCount('IntakeReceived')).toBe(1);
      
      dispatcher.clear();
      
      expect(dispatcher.getHandlerCount('IntakeReceived')).toBe(0);
    });
  });
});
