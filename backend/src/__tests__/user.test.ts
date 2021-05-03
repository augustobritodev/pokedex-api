describe('this is a test', () => {
  const user = {
    name: '',
    email: '',
  };
  user.name = 'Augusto';
  it('should pass', () => {
    expect(user.name).toEqual('Augusto');
  });
});
