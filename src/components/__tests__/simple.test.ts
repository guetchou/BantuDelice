describe('Simple Test', () => {
  test('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle strings', () => {
    expect('BantuDelice').toBe('BantuDelice');
  });

  test('should handle arrays', () => {
    const services = ['taxi', 'delivery', 'colis'];
    expect(services).toHaveLength(3);
    expect(services).toContain('taxi');
  });
}); 