const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passLength;
  lengthDisplay.innerText = passLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 2px ${color}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNo() {
  return getRandomInt(0, 10);
}
function generateUpperCase() {
  return String.fromCharCode(getRandomInt(65, 91));
}
function generateLowerCase() {
  return String.fromCharCode(getRandomInt(97, 123));
}
function generateSymbol() {
  return symbols.charAt(getRandomInt(0, symbols.length));
}

function calcStrength() {
  const hasUpper = uppercaseCheck.checked;
  const hasLower = lowercaseCheck.checked;
  const hasNum = numbersCheck.checked;
  const hasSym = symbolsCheck.checked;

  const totalChecked = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;

  if (totalChecked === 0) {
    setIndicator("#ef4444"); // red
    return;
  }

  if (totalChecked === 1 || (totalChecked === 2 && passLength < 8)) {
    setIndicator("#ef4444"); // weak
  } else if (
    (totalChecked === 2 && passLength >= 8) ||
    (totalChecked === 3 && passLength < 10) ||
    (totalChecked === 4 && passLength < 8)
  ) {
    setIndicator("#facc15"); // medium
  } else {
    setIndicator("#4ade80"); // strong
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}



function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passLength < checkCount) {
    passLength = checkCount;
    handleSlider();
  }
}


// Attach checkbox listeners
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// Slider input change
inputSlider.addEventListener("input", (e) => {
  passLength = e.target.value;
  handleSlider();
});

// Copy button click
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// Generate button click
generateBtn.addEventListener("click", () => {
  if (checkCount === 0) return;

  if (passLength < checkCount) {
    passLength = checkCount;
    handleSlider();
  }

  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNo);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // Compulsory characters
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Remaining characters
  for (let i = 0; i < passLength - funcArr.length; i++) {
    let randIndex = getRandomInt(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // Shuffle and display
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});

// Theme toggle
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
let currentTheme = "dark";
root.setAttribute("data-theme", currentTheme);
themeToggle.textContent = "🔆";



themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  themeToggle.textContent = currentTheme === "dark" ? "🔆" : "🌙";
});

// Password visibility toggle
const toggleBtn = document.getElementById("toggleVisibility");
const eyeIcon = document.getElementById("eyeIcon");

toggleBtn.addEventListener("click", () => {
  const isHidden = passwordDisplay.type === "password";
  passwordDisplay.type = isHidden ? "text" : "password";
  eyeIcon.src = isHidden ? "eye-off.svg" : "eye.svg";
});


