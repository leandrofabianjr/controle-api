import { MethodOverrideMiddleware } from './method-override.middleware';

describe('MethodOverrideMiddleware', () => {
  it('should be defined', () => {
    expect(new MethodOverrideMiddleware()).toBeDefined();
  });
});
