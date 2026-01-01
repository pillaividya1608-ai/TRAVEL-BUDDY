let expenses = [];
let plans = [];
let notes = [];

function addExpense() {
  const desc = document.getElementById('expenseDesc').value.trim();
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  if(!desc || isNaN(amount)) { alert("Please enter valid expense"); return; }

  expenses.push({desc, amount});
  updateExpenseTable();
  document.getElementById('expenseDesc').value = '';
  document.getElementById('expenseAmount').value = '';
}

function updateExpenseTable() {
  const tbody = document.getElementById('expenseTable').querySelector('tbody');
  tbody.innerHTML = '';
  let total = 0;
  expenses.forEach(exp => {
    const row = tbody.insertRow();
    row.insertCell(0).innerText = exp.desc;
    row.insertCell(1).innerText = "₹" + exp.amount.toFixed(2);
    total += exp.amount;
  });
  document.getElementById('totalSpent').innerText = total.toFixed(2);
  const totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
  const remaining = totalBudget - total;
  document.getElementById('remainingBudget').innerText = remaining.toFixed(2);

  const progress = totalBudget > 0 ? (total / totalBudget) * 100 : 0;
  document.getElementById('budgetProgress').style.width = progress + '%';
}

function addPlan() {
  const date = document.getElementById('planDate').value;
  const time = document.getElementById('planTime').value;
  const activity = document.getElementById('planActivity').value.trim();
  if(!date || !time || !activity) { alert("Please enter valid date, time, and activity"); return; }

  plans.push({date, time, activity});
  updatePlanTable();
  document.getElementById('planDate').value = '';
  document.getElementById('planTime').value = '';
  document.getElementById('planActivity').value = '';
}

function updatePlanTable() {
  const tbody = document.getElementById('planTable').querySelector('tbody');
  tbody.innerHTML = '';
  plans.forEach(plan => {
    const row = tbody.insertRow();
    row.insertCell(0).innerText = plan.date;
    row.insertCell(1).innerText = plan.time;
    row.insertCell(2).innerText = plan.activity;
  });
}

function addNote() {
  const noteText = document.getElementById('noteText').value.trim();
  if(!noteText) return;
  notes.push(noteText);
  updateNotes();
  document.getElementById('noteText').value = '';
}

function updateNotes() {
  const list = document.getElementById('notesList');
  list.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(note));
    list.appendChild(li);
  });
}

function resetPlanner() {
  if(confirm("Are you sure you want to reset everything?")) {
    document.getElementById('destination').value = '';
    document.getElementById('travelDate').value = '';
    notes = [];
    updateNotes();
    document.getElementById('totalBudget').value = '';
    expenses = [];
    plans = [];
    updateExpenseTable();
    updatePlanTable();
  }
}

// ------------------------ SAVE TO SHEET ------------------------

function saveToSheet() {
  const travelDetails = {
    destination: document.getElementById('destination').value,
    travelDate: document.getElementById('travelDate').value,
    notes: notes
  };

  if(!travelDetails.destination || !travelDetails.travelDate){
    alert("Please fill basic travel details.");
    return;
  }

  const dataToSend = { travelDetails, expenses, plans };

  // ← Replace with your Web App URL
  const url = "https://script.google.com/macros/s/AKfycbw16X9XHlqNfEVgvVbKSGYRBwP91yLowEX1HLkhIU-1Ep36ZYrs5DWNY1GV-zLOArz6/exec";

  fetch(url, {
    method: "POST",
    body: JSON.stringify(dataToSend)
  })
  .then(res => res.text())
  .then(result => {
    alert("Saved to Google Sheet!");
    console.log(result);
  })
  .catch(err => {
    console.error("Error saving to sheet:", err);
    alert("Error saving to Google Sheet. Check console.");
  });
}
