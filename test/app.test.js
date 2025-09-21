describe('App Loading', () => {
  test('App file should exist and be valid', () => {
    expect(() => {
      require('../src/app');
    }).not.toThrow();
  });
});