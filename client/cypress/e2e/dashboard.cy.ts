describe('Dashboard landing page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/polls', { fixture: 'polls' });
  });

  it('renders the login page', () => {
    cy.visit('/');

    cy.get('[data-testid="dashboard-container"]').should('exist');
  });

  it('renders the results after fetching data from backend', () => {
    cy.visit('/');

    cy.contains('Online Users:').should('exist');
    cy.contains("What's your fav xyz ?").should('exist');
    cy.contains("What's your fav fragrance ?").should('exist');
  });

  it('renders the answered flag on card if poll is already answered by the user', () => {
    window.localStorage.setItem(
      'answeredPolls',
      JSON.stringify({
        '6424d9d0df5387002a5a67a1': {
          selectedOptionId: '12314asdfasd',
          answeredAt: '2023-03-29T18:53:26.443Z',
        },
      }),
    );

    cy.visit('/');

    cy.contains(
      'Answered on ' +
        new Date('2023-03-29T18:53:26.443Z').toLocaleDateString(),
    ).should('exist');
  });

  it('should create the poll with correct data', () => {
    cy.intercept('POST', '**/api/poll', {
      statusCode: 200,
      body: { id: 'asdfasdlkfj' },
    }).as('postPoll');
    cy.visit('/');

    cy.get('[data-testid="add-poll-button"]').click();
    cy.get('[data-testid="add-poll-dialog"]').should('be.visible');

    cy.get('[data-testid="add-poll-prompt-field"]').type(
      'What color is the sky ?',
    );
    cy.get('[data-testid="add-poll-author-field"]').type('John Doe');

    cy.get('[data-testid="option-title-input-0"]').type('Red');
    cy.get('[data-testid="option-title-input-1"]').type('Blue');

    cy.get('[data-testid="append-option-button"]').click();

    cy.get('[data-testid="option-title-input-2"]').type('Yellow');

    cy.get('[data-testid="delete-option-button-0"]').click();
    cy.get('[data-testid="add-poll-submit-button"]').click();

    cy.wait('@postPoll').then((intercept) => {
      expect(intercept.request.body).to.deep.equal({
        prompt: 'What color is the sky ?',
        author: 'John Doe',
        options: [{ title: 'Blue' }, { title: 'Yellow' }],
      });
    });
  });
});
