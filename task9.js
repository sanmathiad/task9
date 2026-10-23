
let exp = JSON.parse(localStorage.getItem('exp')) || [];
let bud = Number(localStorage.getItem('bud')) || 0;

function save() {
  localStorage.setItem('exp', JSON.stringify(exp));
  localStorage.setItem('bud', bud);
}

function setBudget() {
  bud = Number(document.getElementById('budgetInput').value);
  save(); 
  showData();
}
document.getElementById('expForm').onsubmit = function(e) {
  e.preventDefault();
  exp.push({
    id: Date.now(),
    name: document.getElementById('name').value,
    amt: Number(document.getElementById('amt').value),
    cat: document.getElementById('cat').value,
    date: document.getElementById('date').value
  });
  save(); 
  showData(); 
  this.reset();
};

function deleteItem(id) { 
  exp = exp.filter(x => x.id !== id); 
  save(); 
  showData(); 
}

function clearAll() { 
  if (confirm("Clear all?")) { 
    exp = []; 
    save(); 
    showData(); 
  } 
}

function exportJSON() {
  let a = document.createElement('a');
  a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exp));
  a.download = "expenses.json"; 
  a.click();
}

function importJSON(e) {
  let reader = new FileReader();
  reader.onload = function(event) {
    exp = JSON.parse(event.target.result); 
    save();     
    showData(); 
  };
  reader.readAsText(e.target.files[0]); 
}

function showData() {
  document.getElementById('budgetInput').value = bud || '';
  let now = new Date(), spent = 0;

  for (let x of exp) {
    let d = new Date(x.date);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      spent += x.amt;
    }
  }

  document.getElementById('spent').textContent = "₹" + spent;
  document.getElementById('left').textContent = "₹" + (bud - spent);
  document.getElementById('warn').textContent = (bud > 0 && spent > bud) ? "Over budget!" : "";


  let s = document.getElementById('search').value.toLowerCase();
  let f = document.getElementById('filterCat').value;
  let list = document.getElementById('expList');
  list.innerHTML = "";

  for (let x of exp) {
    if (x.name.toLowerCase().includes(s) && (f === "All" || x.cat === f)) {
      list.innerHTML += "<li>" + x.name + " - ₹" + x.amt + " <button onclick='deleteItem(" + x.id + ")'>X</button></li>";
    }
  }
}

showData();