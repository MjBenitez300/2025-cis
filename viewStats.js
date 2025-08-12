// Check login 
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  alert("Please login first.");
  window.location.href = "index.html";
}

const recordsTable = document.getElementById("recordsTable");

// Fields for Employee and Guests
const employeeExtraFields = [
  { id: "patientID", label: "Patient ID" },
  { id: "civilStatus", label: "Civil Status" },
  { id: "department", label: "Department" },
];

const commonFields = [
  { id: "patientName", label: "Patient Name" },
  { id: "patientAge", label: "Age" },
  { id: "sex", label: "Sex" },
  { id: "patientAddress", label: "Address" },
  { id: "walkInDate", label: "Walk-in Date" },
  { id: "chiefComplaint", label: "Chief Complaint" },
  { id: "history", label: "History of Past Illness" },
  { id: "medication", label: "Medication" },
];

const allFields = [...employeeExtraFields, ...commonFields];

// Load and filter patients to exclude guest records
function loadEmployeeData() {
  const allPatients = JSON.parse(localStorage.getItem("patients")) || [];
  return allPatients.filter(p => p.type === "employee");  // Only return employees
}

// Delete all records (Department History or Medication History)
function deleteAllDepartmentRecords() {
  let allPatients = JSON.parse(localStorage.getItem("patients")) || [];
  const selectedDepartment = departmentSelect.value;

  // Filter and remove patients based on department
  if (selectedDepartment !== "all") {
    allPatients = allPatients.filter(p => p.department !== selectedDepartment);
  }

  localStorage.setItem("patients", JSON.stringify(allPatients)); // Save the updated list
  renderDepartmentHistory(); // Re-render the table after deletion
}

function deleteAllMedicationRecords() {
  let allPatients = JSON.parse(localStorage.getItem("patients")) || [];
  const selectedDepartment = departmentSelect.value;

  // Filter and remove patients based on medication
  if (selectedDepartment !== "all") {
    allPatients = allPatients.filter(p => p.medication !== selectedDepartment);
  }

  localStorage.setItem("patients", JSON.stringify(allPatients)); // Save the updated list
  renderMedicationHistory(); // Re-render medication stats after deletion
}

// Render Department History and Chief Complaint counts
function renderDepartmentHistory() {
  const selectedDepartment = departmentSelect.value; // Track the selected department
  const patients = loadEmployeeData();  // Get employee data only
  const departmentStats = {};

  patients.forEach(p => {
    // Exclude "Unknown" departments (exclude guest patients)
    if (p.department === "Unknown") return;

    // Filter by selected department
    if (selectedDepartment !== "all" && p.department !== selectedDepartment) return;

    const chiefComplaint = p.chiefComplaint || "Unknown";
    const department = p.department || "Unknown";

    if (!departmentStats[department]) {
      departmentStats[department] = {};
    }

    if (!departmentStats[department][chiefComplaint]) {
      departmentStats[department][chiefComplaint] = 0;
    }

    departmentStats[department][chiefComplaint]++;
  });

  // Display stats in table
  let html = "<table><thead><tr><th>Department</th><th>Chief Complaint</th><th>Count</th></tr></thead><tbody>";
  
  Object.keys(departmentStats).forEach(department => {
    Object.keys(departmentStats[department]).forEach(complaint => {
      const count = departmentStats[department][complaint];
      html += `<tr><td>${department}</td><td>${complaint}</td><td>${count}</td></tr>`;
    });
  });
  
  html += "</tbody></table>";
  statsSection.innerHTML = html;
}

// Render Medication History and counts
function renderMedicationHistory() {
  const selectedDepartment = departmentSelect.value;
  const patients = loadEmployeeData();  // Get employee data only
  const medicationStats = {};

  patients.forEach(p => {
    // Exclude guest patients with unknown department
    if (p.department === "Unknown") return;

    // If the department is selected, filter based on that department
    if (selectedDepartment !== "all" && p.department !== selectedDepartment) return;

    const medication = p.medication || "Unknown";

    if (!medicationStats[medication]) {
      medicationStats[medication] = 0;
    }

    medicationStats[medication]++;
  });

  // Display stats in table
  let html = "<table><thead><tr><th>Medication</th><th>Count</th></tr></thead><tbody>";
  
  Object.keys(medicationStats).forEach(medication => {
    const count = medicationStats[medication];
    html += `<tr><td>${medication}</td><td>${count}</td></tr>`;
  });
  
  html += "</tbody></table>";
  statsSection.innerHTML = html;
}

// Delete all records for the department or medication
document.getElementById("deleteAllDeptBtn").addEventListener("click", deleteAllDepartmentRecords);
document.getElementById("deleteAllMedBtn").addEventListener("click", deleteAllMedicationRecords);

document.getElementById("viewDeptBtn").addEventListener("click", renderDepartmentHistory);
document.getElementById("viewMedicationBtn").addEventListener("click", renderMedicationHistory);

// Export functionality for Excel (CSV)
document.getElementById("exportBtn").addEventListener("click", () => {
  const rows = [...recordsTable.rows].map(row => [...row.cells].map(cell => `"${cell.textContent}"`).join(","));
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "patient_stats.csv";
  a.click();
  URL.revokeObjectURL(url);
});
