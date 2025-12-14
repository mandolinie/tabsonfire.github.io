// --- Cookie banner ---
document.addEventListener('DOMContentLoaded', function () {
  const cookiesBanner = document.getElementById('cookies');
  const acceptButton = document.getElementById('cookiesAcceptButton');
  const declineButton = document.getElementById('cookiesDeclineButton');

  // Always check localStorage
  const cookieDecision = localStorage.getItem('TabsOnFireCookies');

  if (!cookieDecision) {
    cookiesBanner.style.display = 'block';
  } else {
    cookiesBanner.style.display = 'none';
    if (cookieDecision === 'accepted') {
      loadGoogleAnalytics();
    }
  }

  // Accept button
  acceptButton.addEventListener('click', function () {
    localStorage.setItem('TabsOnFireCookies', 'accepted');
    cookiesBanner.style.display = 'none';
    loadGoogleAnalytics();
  });

  // Decline button
  declineButton.addEventListener('click', function () {
    localStorage.setItem('TabsOnFireCookies', 'declined');
    cookiesBanner.style.display = 'none';
  });

  // GA is loaded after acceptance
  function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-43C8S7QD4X";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-43C8S7QD4X', { anonymize_ip: true });
  }
});

// --- Active nav elements using body ID ---
const currentPage = document.body.id;

document.querySelectorAll("nav a").forEach(link => {
  if (link.dataset.page === currentPage) {
    link.classList.add("active");
  }
});

// --- DOM references ---
const inputsDiv = document.getElementById("urls");
const snippet = document.getElementById("snippet");
const addBtn = document.getElementById("addBtn");
const copyBtn = document.getElementById("copyBtn");

// --- Template for arrows / actions ---
const arrowTemplate = document.getElementById("arrowTemplate").content;

// --- Update snippet from inputs ---
function updateSnippet() {
  const values = [...inputsDiv.querySelectorAll(".url-input")]
    .map(input => input.value.trim())
    .filter(v => v !== "");
  snippet.value = values.join("|");
}

// --- Update input wrappers from snippet ---
function updateInputsFromSnippet() {
  const parts = snippet.value.split("|").map(v => v.trim());

  // Clear current inputs
  inputsDiv.innerHTML = "";

  if (parts.length === 0) {
    addInput();
    return;
  }

  parts.forEach(value => {
    addInput(value);
  });

  updateArrowButtonsState();
}

// --- Add a new input wrapper ---
function addInput(value = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "input-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "url-input";
  input.value = value;
  input.placeholder = "https://www.example.com";

  wrapper.appendChild(input);

  // Clone arrows/actions from template
  const arrowsClone = document.importNode(arrowTemplate, true);
  wrapper.appendChild(arrowsClone);

  inputsDiv.appendChild(wrapper);

  updateSnippet();
  updateArrowButtonsState();
}

// --- Move input wrapper ---
function moveWrapper(wrapper, direction) {
  if (direction === "up" && wrapper.previousElementSibling) {
    inputsDiv.insertBefore(wrapper, wrapper.previousElementSibling);
  }
  if (direction === "down" && wrapper.nextElementSibling) {
    inputsDiv.insertBefore(wrapper.nextElementSibling, wrapper);
  }
  updateSnippet();
  updateArrowButtonsState();
}

// --- Handle up/down/remove button clicks ---
inputsDiv.addEventListener("click", (e) => {
  const upButton = e.target.closest(".upBtn");
  const downButton = e.target.closest(".downBtn");
  const removeButton = e.target.closest(".removeBtn");

  const wrapper = e.target.closest(".input-wrapper");
  if (!wrapper) return;

  if (upButton) {
    moveWrapper(wrapper, "up");
    upButton.blur(); // remove focus
  }
  if (downButton) {
    moveWrapper(wrapper, "down");
    downButton.blur(); // remove focus
  }
  if (removeButton) {
    wrapper.remove();
    updateSnippet();
    updateArrowButtonsState();
  }
});

// --- Disable first/last arrows ---
function updateArrowButtonsState() {
  const wrappers = inputsDiv.querySelectorAll(".input-wrapper");

  wrappers.forEach(wrapper => {
    const upBtn = wrapper.querySelector(".upBtn");
    const downBtn = wrapper.querySelector(".downBtn");

    if (upBtn) {
      upBtn.classList.remove("disabled");
      upBtn.removeAttribute("tabindex");
    }
    if (downBtn) {
      downBtn.classList.remove("disabled");
      downBtn.removeAttribute("tabindex");
    }
  });

  if (!wrappers.length) return;

  // First wrapper: disable up
  const firstUp = wrappers[0].querySelector(".upBtn");
  if (firstUp) {
    firstUp.classList.add("disabled");
    firstUp.setAttribute("tabindex", "-1");
  }

  // Last wrapper: disable down
  const lastDown = wrappers[wrappers.length - 1].querySelector(".downBtn");
  if (lastDown) {
    lastDown.classList.add("disabled");
    lastDown.setAttribute("tabindex", "-1");
  }
}

// --- Sync snippet on input changes ---
inputsDiv.addEventListener("input", updateSnippet);

// --- Sync input on snippet changes ---
snippet.addEventListener("input", () => {
  const value = snippet.value;

  // Save cursor position
  const start = snippet.selectionStart;
  const end = snippet.selectionEnd;

  // Basic validity rules
  const looksValid =
    value.length === 0 ||         // empty is fine
    (
      !value.startsWith("|") &&   // cannot begin with a pipe
      !value.endsWith("|") &&     // cannot end with a pipe
      !value.includes("||")       // cannot contain double pipes
    );

  if (looksValid) {
    updateInputsFromSnippet();
  }

  // Restore cursor position after any update
  snippet.setSelectionRange(start, end);
});

// --- Add new input via button ---
addBtn.addEventListener("click", () => addInput());

// --- Initial state ---
if (!inputsDiv.querySelector(".input-wrapper")) addInput(); // ensure at least one
updateArrowButtonsState();

// --- Copy snippet to clipboard ---
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(snippet.value);

    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = "Copied to clipboard!";

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
    }, 2000);
  } catch (err) {
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = "Failed to copy";
    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
    }, 2000);
  }
});