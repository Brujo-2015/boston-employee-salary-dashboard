import {
  averageTopEarners,
  countAboveThreshold,
  filterEmployees,
  formatCurrency,
  formatNumber,
  normalizeEmployees,
  sortByTotalEarnings,
} from "./data-utils.js";

const state = {
  employees: [],
  sortedEmployees: [],
};

const elements = {
  status: document.querySelector("#status"),
  totalEmployees: document.querySelector("#totalEmployees"),
  above100k: document.querySelector("#above100k"),
  highestEarnings: document.querySelector("#highestEarnings"),
  averageTop100: document.querySelector("#averageTop100"),
  topCount: document.querySelector("#topCount"),
  salaryThreshold: document.querySelector("#salaryThreshold"),
  searchInput: document.querySelector("#searchInput"),
  salaryTableBody: document.querySelector("#salaryTableBody"),
  tableSummary: document.querySelector("#tableSummary"),
};

async function loadSalaryData() {
  try {
    const response = await fetch("data/bostonEmployeeSalaries.json");

    if (!response.ok) {
      throw new Error(`Unable to load dataset: ${response.status}`);
    }

    const dataset = await response.json();
    state.employees = normalizeEmployees(dataset.data);
    state.sortedEmployees = sortByTotalEarnings(state.employees);

    elements.status.textContent = "Dataset loaded successfully.";
    renderDashboard();
  } catch (error) {
    elements.status.textContent = "The salary dataset could not be loaded. Please run the project through a local server or GitHub Pages.";
    elements.status.classList.add("error");
    console.error(error);
  }
}

function renderDashboard() {
  const threshold = Number(elements.salaryThreshold.value) || 0;
  const topCount = Number(elements.topCount.value) || 10;
  const searchTerm = elements.searchInput.value;

  const matchingEmployees = sortByTotalEarnings(filterEmployees(state.employees, searchTerm));
  const visibleEmployees = matchingEmployees.slice(0, topCount);

  elements.totalEmployees.textContent = formatNumber(state.employees.length);
  elements.above100k.textContent = formatNumber(countAboveThreshold(state.employees, 100000));
  elements.highestEarnings.textContent = formatCurrency(state.sortedEmployees[0]?.totalEarnings || 0);
  elements.averageTop100.textContent = formatCurrency(averageTopEarners(state.employees, 100));

  elements.tableSummary.textContent = `${formatNumber(matchingEmployees.length)} matching employees. Salary threshold selected: ${formatCurrency(threshold)}.`;
  renderTable(visibleEmployees, threshold);
}

function renderTable(employees, threshold) {
  elements.salaryTableBody.innerHTML = "";

  employees.forEach((employee, index) => {
    const row = document.createElement("tr");
    const meetsThreshold = employee.totalEarnings >= threshold;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${employee.name}</td>
      <td>${employee.title}</td>
      <td>${employee.department}</td>
      <td>${meetsThreshold ? "★ " : ""}${formatCurrency(employee.totalEarnings)}</td>
    `;

    elements.salaryTableBody.appendChild(row);
  });
}

function attachEventListeners() {
  elements.topCount.addEventListener("change", renderDashboard);
  elements.salaryThreshold.addEventListener("input", renderDashboard);
  elements.searchInput.addEventListener("input", renderDashboard);
}

attachEventListeners();
loadSalaryData();
