// Dynamic Slider Value Synchronization
const ageSlider = document.getElementById('Age');
const ageVal = document.getElementById('age-val');
ageSlider.addEventListener('input', () => ageVal.textContent = ageSlider.value);

const fareSlider = document.getElementById('Fare');
const fareVal = document.getElementById('fare-val');
fareSlider.addEventListener('input', () => fareVal.textContent = parseFloat(fareSlider.value).toFixed(2));

// Form Submission Event
document.getElementById('prediction-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    // UI Loading State
    btnText.textContent = 'Analyzing...';
    btnSpinner.classList.remove('hidden');
    submitBtn.disabled = true;

    const payload = {
        Pclass: document.getElementById('Pclass').value,
        Sex: document.getElementById('Sex').value,
        Age: document.getElementById('Age').value,
        SibSp: document.getElementById('SibSp').value,
        Parch: document.getElementById('Parch').value,
        Fare: document.getElementById('Fare').value,
        Embarked: document.getElementById('Embarked').value
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            renderAnalysis(payload, result);
        } else {
            alert('Prediction error: ' + result.message);
        }
    } catch (err) {
        alert('Failed to connect to the prediction API.');
    } finally {
        // Reset Button
        btnText.textContent = 'Predict Survival';
        btnSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

function renderAnalysis(inputs, result) {
    document.getElementById('analysis-placeholder').classList.add('hidden');
    const content = document.getElementById('analysis-content');
    content.classList.remove('hidden');

    const banner = document.getElementById('outcome-banner');
    const outcomeTitle = document.getElementById('outcome-title');
    const probText = document.getElementById('probability-text');
    const outcomeIcon = document.getElementById('outcome-icon');

    // Update Outcome & Theme
    if (result.survived === 1) {
        banner.className = 'outcome-banner survived';
        outcomeTitle.textContent = 'Likely Survived';
        outcomeIcon.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="#34d399"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    } else {
        banner.className = 'outcome-banner perished';
        outcomeTitle.textContent = 'Likely Perished';
        outcomeIcon.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="#f87171"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`;
    }

    probText.textContent = `${result.probability}%`;

    // Dynamic Feature Impact Adjustment Based on Inputs
    const sexWeight = inputs.Sex === 'female' ? '92%' : '88%';
    const pclassWeight = inputs.Pclass === '1' ? '90%' : inputs.Pclass === '2' ? '65%' : '40%';
    const ageFareWeight = Math.min(Math.round((parseFloat(inputs.Fare) / 300) * 100) + 35, 95) + '%';

    document.getElementById('sex-bar').style.width = sexWeight;
    document.getElementById('class-bar').style.width = pclassWeight;
    document.getElementById('age-bar').style.width = ageFareWeight;

    // Profile Summary
    const sexCap = inputs.Sex.charAt(0).toUpperCase() + inputs.Sex.slice(1);
    const pclassMap = { '1': '1st Class', '2': '2nd Class', '3': '3rd Class' };
    document.getElementById('summary-profile').textContent = `${sexCap}, ${pclassMap[inputs.Pclass]}`;
}