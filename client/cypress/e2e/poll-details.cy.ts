describe('Poll details', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/poll/6424d9d0df5387002a5a67a1*', {
      fixture: 'pollById',
    }).as('getPollById');
  });

  it('renders the poll detail page', () => {
    cy.visit('/poll/6424d9d0df5387002a5a67a1');

    cy.get('[data-testid="poll-details-wrapper"]').should('exist');
  });

  it('renders the results after submitting the answer', () => {
    cy.intercept('PATCH', '/api/poll/vote', {
      _id: '6424d9d0df5387002a5a67a1',
      prompt: "Who's your fav actor ?",
      author: 'Meet',
      options: [
        { title: 'james bond', votes: 1, _id: '6424d9d0df5387002a5a67a2' },
        { title: 'tom cruise', votes: 1, _id: '6424d9d0df5387002a5a67a3' },
      ],
      totalVoteCount: 2,
      createdAt: '2023-03-30T00:37:36.207Z',
      updatedAt: '2023-03-30T00:39:02.134Z',
    }).as('patchVoteOnPoll');

    cy.visit('/poll/6424d9d0df5387002a5a67a1');

    cy.get('[data-testid="poll-form-option-0"]').should('exist');
    cy.get('[data-testid="poll-form-option-1"]').should('exist');

    cy.get('[data-testid="poll-form-option-1"]').click();

    cy.get('[data-testid="poll-form-submit-button"]').click();

    cy.wait('@patchVoteOnPoll').then((intercept) => {
      expect(intercept.request.body).to.deep.equal({
        optionId: '6424d9d0df5387002a5a67a3',
        pollId: '6424d9d0df5387002a5a67a1',
      });

      const polls = localStorage.getItem('answeredPolls');
      expect(polls).to.exist;
    });

    cy.contains('Total Votes: 2').should('be.visible');
    cy.contains(`You answered this poll on`).should('be.visible');
    cy.get('[data-testid="poll-results-pie-chart"]').should('be.visible');
  });
});
