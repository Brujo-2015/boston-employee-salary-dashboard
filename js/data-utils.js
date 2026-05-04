const FIELD_INDEX = {
  name: 8,
  title: 9,
  department: 10,
  regular: 11,
  retro: 12,
  other: 13,
  overtime: 14,
  injured: 15,
  detail: 16,
  quinn: 17,
  totalEarnings: 18,
  zip: 19,
};

/**
 * Converts salary strings into numbers while protecting the application
 * from empty, missing, or invalid values.
 */
export function toMoney(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Converts the original Socrata-style row arrays into readable objects.
 */
export function normalizeEmployees(rawRows) {
  return rawRows.map((row) => ({
    name: row[FIELD_INDEX.name] || "Unknown",
    title: row[FIELD_INDEX.title] || "Not listed",
    department: row[FIELD_INDEX.department] || "Not listed",
    regular: toMoney(row[FIELD_INDEX.regular]),
    overtime: toMoney(row[FIELD_INDEX.overtime]),
    totalEarnings: toMoney(row[FIELD_INDEX.totalEarnings]),
    zip: row[FIELD_INDEX.zip] || "Unknown",
  }));
}

/**
 * Returns a new array sorted from highest to lowest total earnings.
 */
export function sortByTotalEarnings(employees) {
  return [...employees].sort((a, b) => b.totalEarnings - a.totalEarnings);
}

export function countAboveThreshold(employees, threshold) {
  return employees.filter((employee) => employee.totalEarnings >= threshold).length;
}

export function averageTopEarners(employees, count) {
  const topEmployees = sortByTotalEarnings(employees).slice(0, count);
  const total = topEmployees.reduce((sum, employee) => sum + employee.totalEarnings, 0);
  return topEmployees.length === 0 ? 0 : total / topEmployees.length;
}

export function filterEmployees(employees, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return employees;
  }

  return employees.filter((employee) => {
    const searchableText = `${employee.name} ${employee.title} ${employee.department}`.toLowerCase();
    return searchableText.includes(normalizedSearch);
  });
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
