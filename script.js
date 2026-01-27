const display = document.getElementById("display");
const buttons = document.querySelectorAll("button[data-value]");
const historyContainer = document.getElementById("history");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

let history = JSON.parse(localStorage.getItem("history")) || [];

updateHistory();

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (value === "C") {
            display.value = "";
        }
        else if (value === "⌫") {
            display.value = display.value.slice(0, -1);
        }
        else if (value === "%") {
            if (display.value !== "") {
                display.value = display.value / 100;
            }
        }
        else if (value === "()") {
            const open = (display.value.match(/\(/g) || []).length;
            const close = (display.value.match(/\)/g) || []).length;

            display.value += open === close ? "(" : ")";
        }
        else if (value === "=") {
            try {
                const result = eval(display.value);
                addToHistory(display.value + " = " + result);
                display.value = result;
            } catch {
                display.value = "Erreur";
            }
        }
        else {
            display.value += value;
        }
    });
});

function addToHistory(calculation) {
    history.unshift(calculation);
    if (history.length > 3) history.pop();
    localStorage.setItem("history", JSON.stringify(history));
    updateHistory();
}

function updateHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyContainer.style.display = "none";
        return;
    }

    historyContainer.style.display = "block";

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    localStorage.setItem("history", JSON.stringify(history));
    updateHistory();
});