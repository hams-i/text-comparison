document.addEventListener('DOMContentLoaded', () => {
    const inputContainer = document.getElementById('input-container');
    const addInputBtn = document.getElementById('addInputBtn');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const result = document.getElementById('result');

    let inputCount = 2;

    // İlk input'a focus ol
    document.querySelector('textarea').focus();

    // Yeni input alanı ekleme
    function createInputGroup() {
        inputCount++;
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <div class="input-wrapper">
                <div class="input-header">
                    <label for="text${inputCount}">Text ${inputCount}</label>
                    <div class="input-actions">
                        <button class="clear-input" title="Clear Text">
                            <i class="fas fa-eraser"></i>
                        </button>
                        <button class="remove-input" title="Remove Field">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <textarea id="text${inputCount}" rows="10" placeholder="Enter text here..."></textarea>
            </div>
        `;
        inputContainer.appendChild(inputGroup);
        return inputGroup;
    }

    // Input alanı silme
    function removeInputGroup(group) {
        if (document.querySelectorAll('.input-group').length > 1) {
            group.remove();
            updateInputLabels();
        }
    }

    // Input etiketlerini güncelle
    function updateInputLabels() {
        document.querySelectorAll('.input-group').forEach((group, index) => {
            const label = group.querySelector('label');
            const textarea = group.querySelector('textarea');
            const newIndex = index + 1;
            label.textContent = `Text ${newIndex}`;
            textarea.id = `text${newIndex}`;
        });
        inputCount = document.querySelectorAll('.input-group').length;
    }

    // Event Listeners
    addInputBtn.addEventListener('click', createInputGroup);

    inputContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-input')) {
            const group = e.target.closest('.input-group');
            removeInputGroup(group);
        }
        if (e.target.closest('.clear-input')) {
            const textarea = e.target.closest('.input-wrapper').querySelector('textarea');
            textarea.value = '';
            textarea.focus();
        }
    });

    compareBtn.addEventListener('click', () => {
        const textareas = document.querySelectorAll('textarea');
        const values = Array.from(textareas).map(ta => ta.value.trim());
        
        if (values.some(v => v === '')) {
            result.innerHTML = 'Please fill in all fields. <i class="fas fa-exclamation-circle result-icon error"></i>';
            result.className = 'result no-match';
            return;
        }

        const allSame = values.every(v => v === values[0]);
        if (allSame) {
            result.innerHTML = 'All texts are identical! <i class="fas fa-check-circle result-icon success"></i>';
            result.className = 'result match';
        } else {
            result.innerHTML = 'Texts are different! <i class="fas fa-times-circle result-icon error"></i>';
            result.className = 'result no-match';
        }
    });

    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });
        result.textContent = '';
        result.className = 'result';
        document.querySelector('textarea').focus();
    });
}); 