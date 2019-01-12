describe('registration', function() {
  it('should visit thinkful and find the log in button', function() {
    browser.get('http://www.thinkful.com/');
    expect(element(by.css('.login-btn')).getInnerHtml()).toMatch(/Log In/);
  });
});
