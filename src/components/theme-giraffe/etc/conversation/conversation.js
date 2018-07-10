export const conversation = [
  {
    content: 'Hi 👋 Want to start a petition? That’s great! Petitions like yours are one of the most powerful ways to bring people together to create change.',
    showToLoggedIn: false,
    type: 'static',
    section: 0,
    id: 0
  },
  {
    content: 'I’ll ask you a few questions that will help build your petition in minutes.',
    showToLoggedIn: false,
    type: 'static',
    section: 0,
    id: 1
  },
  {
    content: 'Let’s get started! Can you enter your email so you don’t lose your progress?',
    showToLoggedIn: false,
    type: 'static',
    section: 0,
    id: 2
  },
  {
    content: 'Enter your email',
    showToLoggedIn: false,
    type: 'input',
    input: {
      type: 'email',
      charLimit: 0
    },
    id: 3
  },
  // Section 1: Title
  {
    content: 'Excellent. Also, you can edit your answers at any time by clicking the pencil next to your response.',
    showToLoggedIn: true,
    type: 'static',
    section: 1,
    id: 4
  },
  {
    content: 'What would you like the title of your petition to be?',
    showToLoggedIn: true,
    type: 'static',
    section: 1,
    id: 5
  },
  {
    content: 'Great titles should be brief, like a newspaper headline. 🗞️ For example “Mayor Jones: Save Dewey Elementary School',
    showToLoggedIn: true,
    type: 'static',
    section: 1,
    id: 6
  },
  {
    content: 'More tips on titles',
    showToLoggedIn: true,
    type: 'tip',
    tipID: 1,
    section: 1,
    id: 7
  },
  {
    content: 'Enter your petition title',
    showToLoggedIn: false,
    type: 'input',
    input: {
      type: 'title',
      charLimit: 50
    },
    id: 8
  },
  // Section 2: Statement
  {
    content: 'That’s a great title! 👍',
    showToLoggedIn: true,
    type: 'static',
    section: 2,
    id: 9
  },
  {
    content: 'Now for the petition statement, what is the change you want to see? 💬',
    showToLoggedIn: true,
    type: 'static',
    section: 2,
    id: 10
  },
  {
    content: 'You will get a lot more signers if your message is short and sweet—one or two sentences at most.',
    showToLoggedIn: true,
    type: 'static',
    section: 2,
    id: 11
  },
  {
    content: 'More tips on petition statements',
    showToLoggedIn: true,
    type: 'tip',
    tipID: 2,
    section: 2,
    id: 12
  },
  {
    content: 'Enter your petition statement',
    showToLoggedIn: false,
    type: 'input',
    input: {
      type: 'summary',
      charLimit: 100
    },
    id: 13
  },
  // Section 3: Background
  {
    content: 'Great. Why are you starting this petition?',
    showToLoggedIn: true,
    type: 'static',
    section: 3,
    id: 14
  },
  {
    content: 'Adding a paragraph or two about this issue and why it matters to you goes a long way. ✍️',
    showToLoggedIn: true,
    type: 'static',
    section: 3,
    id: 15
  },
  {
    content: 'More tips on petition backgrounds',
    showToLoggedIn: true,
    type: 'tip',
    tipID: 3,
    section: 3,
    id: 16
  },
  {
    content: 'Enter your petition background',
    showToLoggedIn: false,
    type: 'input',
    input: {
      type: 'description',
      charLimit: 500
    },
    id: 17
  },
  // Section 4: Targets
  {
    content: 'Just a couple more steps. Let’s find the best person or group of people to make decisions about this issue. Let’s find the best decision-maker(s) for your petition.',
    showToLoggedIn: true,
    type: 'static',
    section: 4,
    id: 18
  },
  {
    content: 'Not sure whom to choose as your decision-maker?',
    showToLoggedIn: true,
    type: 'tip',
    tipID: 4,
    section: 4,
    id: 19
  },
  {
    content: 'Search your Decision Maker',
    showToLoggedIn: false,
    type: 'input',
    input: {
      type: 'target'
    },
    id: 20
  },
  // Section 5: Review
  {
    content: 'Almost done. 💪 Let’s review your petition before we publish it.',
    showToLoggedIn: true,
    type: 'static',
    section: 5,
    id: 21
  },
  {
    content: 'Search your Decision Maker',
    showToLoggedIn: false,
    type: 'input',
    input: {
      type: 'review'
    },
    id: 22
  }
]
