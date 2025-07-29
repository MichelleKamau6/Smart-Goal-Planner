const BASE_URL = 'http://localhost:3000/goals';
const goalsContainer = document.getElementById('goals-container');
const goalForm = document.getElementById('goal-form');
let useLocalStorage = false;

// Check if JSON Server is available, fallback to localStorage
function fetchGoals() {
  fetch(BASE_URL)
    .then(res => {
      if (!res.ok) throw new Error('Server not available');
      return res.json();
    })
    .then(goals => {
      goalsContainer.innerHTML = '';
      goals.forEach(goal => displayGoal(goal));
      updateOverview(goals);
    })
    .catch(() => {
      useLocalStorage = true;
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      goalsContainer.innerHTML = '';
      goals.forEach(goal => displayGoal(goal));
      updateOverview(goals);
    });
}

// Display one goal card
function displayGoal(goal) {
  const card = document.createElement('div');
  card.className = 'goal-card';

  const percentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(2);

  card.innerHTML = `
    <h3>${goal.name}</h3>
    <p>Category: ${goal.category}</p>
    <p>Deadline: ${goal.deadline}</p>
    <p>Target: $${goal.targetAmount}</p>
    <p>Saved: $${goal.savedAmount}</p>

    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percentage}%"></div>
    </div>

    <form class="deposit-form" data-id="${goal.id}">
      <input type="number" name="amount" placeholder="Deposit $" min="1" required />
      <button type="submit">Deposit</button>
    </form>

    <button class="edit-btn" data-id="${goal.id}">Edit</button>
    <button class="delete-btn" data-id="${goal.id}">Delete</button>
  `;

  goalsContainer.appendChild(card);
}

// Handle new goal submission
goalForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const newGoal = {
    id: Date.now().toString(),
    name: document.getElementById('goal-name').value,
    targetAmount: Number(document.getElementById('target-amount').value),
    savedAmount: 0,
    category: document.getElementById('category').value,
    deadline: document.getElementById('deadline').value,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (useLocalStorage) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    goalForm.reset();
    fetchGoals();
  } else {
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal)
    })
      .then(res => res.json())
      .then(goal => {
        displayGoal(goal);
        goalForm.reset();
        fetchGoals();
      })
      .catch(() => {
        useLocalStorage = true;
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));
        goalForm.reset();
        fetchGoals();
      });
  }
});

// Handle deposits, edits, deletes
goalsContainer.addEventListener('submit', function (e) {
  if (e.target.classList.contains('deposit-form')) {
    e.preventDefault();
    const form = e.target;
    const goalId = form.dataset.id;
    const amount = Number(form.amount.value);

    if (useLocalStorage) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        goal.savedAmount += amount;
        localStorage.setItem('goals', JSON.stringify(goals));
        fetchGoals();
      }
    } else {
      fetch(`${BASE_URL}/${goalId}`)
        .then(res => res.json())
        .then(goal => {
          const updatedAmount = goal.savedAmount + amount;

          return fetch(`${BASE_URL}/${goalId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedAmount: updatedAmount })
          });
        })
        .then(() => fetchGoals());
    }
  }
});

goalsContainer.addEventListener('click', function (e) {
  const goalId = e.target.dataset.id;

  if (e.target.classList.contains('delete-btn')) {
    if (useLocalStorage) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const filtered = goals.filter(g => g.id !== goalId);
      localStorage.setItem('goals', JSON.stringify(filtered));
      fetchGoals();
    } else {
      fetch(`${BASE_URL}/${goalId}`, { method: 'DELETE' })
        .then(() => fetchGoals());
    }
  }

  if (e.target.classList.contains('edit-btn')) {
    const name = prompt('New name:');
    const targetAmount = prompt('New target amount:');
    const category = prompt('New category:');
    const deadline = prompt('New deadline (YYYY-MM-DD):');

    if (name && targetAmount && category && deadline) {
      if (useLocalStorage) {
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
          goal.name = name;
          goal.targetAmount = Number(targetAmount);
          goal.category = category;
          goal.deadline = deadline;
          localStorage.setItem('goals', JSON.stringify(goals));
          fetchGoals();
        }
      } else {
        fetch(`${BASE_URL}/${goalId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            targetAmount: Number(targetAmount),
            category,
            deadline
          })
        }).then(() => fetchGoals());
      }
    }
  }
});

// Overview panel
function updateOverview(goals) {
  const overview = document.getElementById('overview');

  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const completed = goals.filter(g => g.savedAmount >= g.targetAmount).length;

  const today = new Date();
  let warnings = '';
  let overdue = '';

  goals.forEach(g => {
    const deadline = new Date(g.deadline);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (g.savedAmount < g.targetAmount) {
      if (diffDays < 0) {
        overdue += `<li>${g.name} — Overdue!</li>`;
      } else if (diffDays <= 30) {
        warnings += `<li>${g.name} — ${diffDays} days left</li>`;
      }
    }
  });

  overview.innerHTML = `
    <p><strong>Total Goals:</strong> ${totalGoals}</p>
    <p><strong>Total Saved:</strong> $${totalSaved}</p>
    <p><strong>Goals Completed:</strong> ${completed}</p>
    ${warnings ? `<h4>⏰ Upcoming Deadlines:</h4><ul>${warnings}</ul>` : ''}
    ${overdue ? `<h4>⚠️ Overdue Goals:</h4><ul>${overdue}</ul>` : ''}
  `;
}

fetchGoals();
