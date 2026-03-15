class Expense {
  constructor(description, amount, category) {
    this.id = Date.now() + Math.random();
    this.description = description;
    this.amount = Number(amount);
    this.category = category;
  }
}

class ExpenseTracker {
  constructor() {
    this.expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  }

  addExpenses(...items) {
    const newEntries = items.map(
      ({ desc, amt, cat }) => new Expense(desc, amt, cat),
    );

    this.expenses = [...this.expenses, ...newEntries];
    this.save();
  }

  removeExpense(id) {
    // Uses Filter (Functional Programming)
    this.expenses = this.expenses.filter((exp) => exp.id !== id);
    this.save();
  }

  calculateTotal(category = "All") {
    return this.expenses
      .filter((exp) => category === "All" || exp.category === category)
      .reduce((total, { amount }) => total + amount, 0);
  }

  save() {
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }
}

const tracker = new ExpenseTracker();
const list = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total-amount");

function render() {
  const filter = document.getElementById("filter-category").value;
  list.innerHTML = "";

  const filtered = tracker.expenses.filter(
    (exp) => filter === "All" || exp.category === filter,
  );

  filtered.forEach(({ id, description, amount, category }) => {
    const li = document.createElement("li");
    li.innerHTML = `
            ${description} - $${amount.toFixed(2)} (${category})
            <button onclick="deleteItem(${id})">Delete</button>
        `;
    list.appendChild(li);
  });

  totalDisplay.textContent = tracker.calculateTotal(filter).toFixed(2);
}

// Global functions for events
window.deleteItem = (id) => {
  tracker.removeExpense(id);
  render();
};

document.getElementById("expense-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = document.getElementById("desc-input").value;
  const amt = document.getElementById("amount-input").value;
  const cat = document.getElementById("category-input").value;

  tracker.addExpenses({ desc, amt, cat });
  e.target.reset();
  render();
});

document.getElementById("filter-category").addEventListener("change", render);
document.addEventListener("DOMContentLoaded", render);

if (typeof module !== "undefined") module.exports = { ExpenseTracker, Expense };
