// Check if logged in  
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  alert("Please login first.");
  window.location.href = "index.html";
}

// Get patient type from URL
const urlParams = new URLSearchParams(window.location.search);
const patientType = urlParams.get("type");
if (!patientType || !["guest", "employee"].includes(patientType)) {
  alert("Invalid patient type.");
  window.location.href = "dashboard.html";
}

document.getElementById("pageTitle").textContent = `Add ${patientType.charAt(0).toUpperCase() + patientType.slice(1)} Patient`;

// Elements
const form = document.getElementById("patientForm");
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Department list
const departmentOptions = [
  "HR", "Finance and Corporate Services", "Life Sciences & Education", "Park Grounds", "Engineering",
  "Security", "Parks and Adventure", "Safari Camp", "Base Camp", "Front Office", "Motorpool",
  "Sales & Marketing", "Office of the VP", "ML-Agri Ventures", "Santican Cattle Station",
  "Tunnel Garden", "Tenants-Outpost", "Tenants-Auntie Anne's", "Tenants-Pizzeria Michelangelo",
  "Tenants-Convenient Store", "Other"
];

// Employee Patient Fields (Separate for Employee)
const employeeFields = [
  { id: "patientID", label: "Patient ID", type: "text", required: true },
  { id: "lastName", label: "Last Name", type: "text", required: true },
  { id: "firstName", label: "First Name", type: "text", required: true },
  { id: "middleName", label: "Middle Name / Initial", type: "text", required: false },
  { id: "patientAge", label: "Age", type: "number", required: true },
  { id: "sex", label: "Sex", type: "radio", options: ["M", "F"], required: true },
  { id: "patientAddress", label: "Address", type: "text", required: true },
  { id: "civilStatus", label: "Civil Status", type: "text", required: false },
  { id: "department", label: "Department", type: "select", options: departmentOptions, required: true },
  { id: "walkInDate", label: "Walk-in Date", type: "date", required: true },
  {
    id: "chiefComplaint",
    label: "Chief Complaint",
    type: "select",
    required: true,
    options: [
      "Loose Bowel Movement", "Fever", "Cough", "Headache", "Hypogastric Pain",
      "Punctured Wound", "Lacerated Wound", "Animal Bite (Dog, Cat, Other)", "Colds",
      "Body Pain", "Toothache", "Stomach Discomfort", "Epigastric Pain", "Other"
    ]
  },
  {
    id: "medication",
    label: "Medication",
    type: "select",
    required: false,
    options: [
      "Paracetamol", "Loperamide", "Mefenamic Acid", "Antacid",
      "Cetirizine", "Hyoscine", "Meclizine", "Other"
    ]
  },
  { id: "history", label: "History of Past Illness", type: "text", required: false }
];

// Guest Patient Fields (Separate for Guest)
const guestFields = [
  { id: "lastName", label: "Last Name", type: "text", required: true },
  { id: "firstName", label: "First Name", type: "text", required: true },
  { id: "middleName", label: "Middle Name / Initial", type: "text", required: false },
  { id: "patientAge", label: "Age", type: "number", required: true },
  { id: "sex", label: "Sex", type: "radio", options: ["M", "F"], required: true },
  { id: "patientAddress", label: "Address", type: "text", required: true },
  { id: "walkInDate", label: "Walk-in Date", type: "date", required: true },
  {
    id: "chiefComplaint",
    label: "Chief Complaint",
    type: "select",
    required: true,
    options: [
      "Loose Bowel Movement", "Fever", "Cough", "Headache", "Hypogastric Pain",
      "Punctured Wound", "Lacerated Wound", "Animal Bite (Dog, Cat, Other)", "Colds",
      "Body Pain", "Toothache", "Stomach Discomfort", "Epigastric Pain", "Other"
    ]
  },
  {
    id: "medication",
    label: "Medication",
    type: "select",
    required: false,
    options: [
      "Paracetamol", "Loperamide", "Mefenamic Acid", "Antacid",
      "Cetirizine", "Hyoscine", "Meclizine", "Other"
    ]
  },
  { id: "history", label: "History of Past Illness", type: "text", required: false }
];

// Build form dynamically
function buildForm() {
  form.innerHTML = "";

  let fields;
  if (patientType === "employee") {
    fields = employeeFields; // Employee-specific fields
  } else {
    fields = guestFields; // Guest-specific fields
  }

  fields.forEach(field => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const label = document.createElement("label");
    label.textContent = field.label + (field.required ? " *" : "");
    label.setAttribute("for", field.id);
    wrapper.appendChild(label);

    if (field.type === "radio") {
      field.options.forEach(opt => {
        const radioLabel = document.createElement("label");
        radioLabel.style.marginLeft = "10px";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = field.id;
        input.value = opt;
        if (field.required) input.required = true;
        radioLabel.appendChild(input);
        radioLabel.appendChild(document.createTextNode(opt === "M" ? "Male" : "Female"));
        wrapper.appendChild(radioLabel);
      });

    } else if (field.type === "select") {
      const select = document.createElement("select");
      select.id = field.id;
      if (field.required) select.required = true;

      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = `Select ${field.label}`;
      select.appendChild(defaultOpt);

      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        if (select.value === "Animal Bite (Dog, Cat, Other)") {
          addAnimalTypeField(wrapper);  // Add the animal type input if "Animal Bite" is selected
        } else {
          removeAnimalTypeField(wrapper);  // Remove the animal type input if not selected
        }
        if (select.value === "Other") {
          addOtherField(wrapper, field.id);
        } else {
          removeOtherField(wrapper, field.id);
        }
      });

      wrapper.appendChild(select);

    } else {
      const input = document.createElement("input");
      input.type = field.type;
      input.id = field.id;
      if (field.required) input.required = true;
      wrapper.appendChild(input);
    }

    form.appendChild(wrapper);
  });

  // Submit button
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = "Add Patient";
  form.appendChild(btn);
}

// Add animal type input dynamically when "Animal Bite" is selected
function addAnimalTypeField(wrapper) {
  if (!wrapper.querySelector("#animalTypeInput")) {
    const animalTypeInput = document.createElement("input");
    animalTypeInput.type = "text";
    animalTypeInput.id = "animalTypeInput";
    animalTypeInput.placeholder = "Specify animal type (Dog, Cat, Other)";
    animalTypeInput.required = true;
    wrapper.appendChild(animalTypeInput);
  }
}

// Remove animal type input if "Animal Bite" is not selected
function removeAnimalTypeField(wrapper) {
  const animalTypeInput = wrapper.querySelector("#animalTypeInput");
  if (animalTypeInput) {
    animalTypeInput.remove();
  }
}

// Add "Other" input field dynamically when "Other" is selected
function addOtherField(wrapper, fieldId) {
  const otherInput = document.createElement("input");
  otherInput.type = "text";
  otherInput.id = `other-${fieldId}`;
  otherInput.placeholder = `Specify ${fieldId}`;
  wrapper.appendChild(otherInput);
}

// Remove "Other" input field if "Other" is not selected
function removeOtherField(wrapper, fieldId) {
  const otherInput = wrapper.querySelector(`#other-${fieldId}`);
  if (otherInput) otherInput.remove();
}

// Submit handler
form.addEventListener("submit", e => {
  e.preventDefault();
  const patientData = {};

  let fields;
  if (patientType === "employee") {
    fields = employeeFields;
  } else {
    fields = guestFields;
  }

  // Collect form data
  for (const f of fields) {
    const input = form.querySelector(`#${f.id}`);
    if (f.type === "radio") {
      const checked = form.querySelector(`input[name="${f.id}"]:checked`);
      patientData[f.id] = checked ? checked.value : "";
    } else if (f.type === "select") {
      const select = form.querySelector(`#${f.id}`);
      patientData[f.id] = select.value;

      if (select.value === "Other") {
        const otherInput = form.querySelector(`#other-${f.id}`);
        if (otherInput) {
          patientData[f.id] = otherInput.value;
        }
      }
      
      // If "Animal Bite" is selected, append the custom animal type
      if (select.value === "Animal Bite (Dog, Cat, Other)") {
        const animalTypeInput = form.querySelector("#animalTypeInput");
        if (animalTypeInput && animalTypeInput.value.trim()) {
          patientData[f.id] = `Animal Bite - ${animalTypeInput.value.trim()}`;
        }
      }

    } else {
      patientData[f.id] = input.value.trim();
    }
  }

  // Add patient name (combining first, middle, and last name)
  patientData.patientName = `${patientData.lastName}, ${patientData.firstName}`;

  // Assign a unique ID
  patientData.id = Date.now().toString() + Math.floor(Math.random() * 1000);
  patientData.type = patientType;

  // Save to localStorage
  const allPatients = JSON.parse(localStorage.getItem("patients")) || [];
  allPatients.push(patientData);
  localStorage.setItem("patients", JSON.stringify(allPatients));

  alert("Patient added successfully!");
  form.reset();
  buildForm();
});

buildForm();
