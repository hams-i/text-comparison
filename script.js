document.addEventListener('DOMContentLoaded', () => {
    const inputContainer = document.getElementById('input-container');
    const addInputBtn = document.getElementById('addInputBtn');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const result = document.getElementById('result');

    let inputCount = 2;

    // İlk input'a focus ol
    document.querySelector('textarea').focus();

    // Karakter sayısını güncelle
    function updateCharCount(textarea) {
        const charCount = textarea.value.length;
        const words = textarea.value.split(/\s+/).filter(word => word).length;
        const label = textarea.closest('.input-wrapper').querySelector('.input-header label');
        label.querySelector('.char-count').textContent = `(${charCount} chars)`;
        label.querySelector('.word-count').textContent = `(${words} words)`;
    }

    // Yeni input alanı ekleme
    function createInputGroup() {
        inputCount++;
        const defaultTitle = `Text ${inputCount}`;
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <div class="input-wrapper">
                <div class="input-header">
                    <label for="text${inputCount}" data-default-title="${defaultTitle}">
                        <input type="text" class="editable-label" maxlength="35" 
                               value="${defaultTitle}" placeholder="Title...">
                        <span class="char-count">(0 chars)</span>
                        <span class="word-count">(0 words)</span>
                    </label>
                    <div class="input-actions">
                        <button class="clear-input" title="Clear Text">
                            <i class="fas fa-eraser"></i>
                        </button>
                        <button class="remove-input" title="Remove Field">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <textarea id="text${inputCount}" rows="10" placeholder="Enter text here..." spellcheck="false"></textarea>
            </div>
        `;
        
        const textarea = inputGroup.querySelector('textarea');
        textarea.addEventListener('input', () => updateCharCount(textarea));
        
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
            const titleInput = group.querySelector('.editable-label');
            const newIndex = index + 1;
            const defaultTitle = `Text ${newIndex}`;
            
            // Default title'ı güncelle
            label.dataset.defaultTitle = defaultTitle;
            
            // Eğer input boşsa veya default title kullanılıyorsa yeni default title'ı kullan
            if (titleInput.value.trim() === '' || titleInput.classList.contains('using-default')) {
                titleInput.value = defaultTitle;
                titleInput.classList.add('using-default');
            }
            
            textarea.id = `text${newIndex}`;
            label.setAttribute('for', `text${newIndex}`);
            const charCount = textarea.value.length;
            const words = textarea.value.split(/\s+/).filter(word => word).length;
            
            label.querySelector('.char-count').textContent = `(${charCount} chars)`;
            label.querySelector('.word-count').textContent = `(${words} words)`;
        });
        inputCount = document.querySelectorAll('.input-group').length;
    }

    // İlk iki textarea için input event listener'ları ekle
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', () => updateCharCount(textarea));
        updateCharCount(textarea); // İlk yüklemede karakter sayılarını göster
    });

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
            updateCharCount(textarea);
        }
        if (e.target.closest('.editable-label')) {
            const textarea = e.target.closest('.input-wrapper').querySelector('textarea');
            e.preventDefault();
        }
    });

    // Input event listener'ları güncelle
    function handleLabelInput(e) {
        const input = e.target;
        const label = input.closest('label');
        const defaultTitle = label.dataset.defaultTitle;
        
        // Line break'leri engelle
        input.value = input.value.replace(/(\r\n|\n|\r)/gm, "");
        
        // Input event'inde boş kontrolü yapmıyoruz
        if (e.type === 'blur' && input.value.trim() === '') {
            input.value = defaultTitle;
            input.classList.add('using-default');
        } else if (input.value.trim() !== '') {
            input.classList.remove('using-default');
        }
    }

    // Mevcut input'lar için event listener'ları ekle
    document.querySelectorAll('.editable-label').forEach(input => {
        input.addEventListener('input', handleLabelInput);
        input.addEventListener('blur', handleLabelInput);
    });

    // Yeni input grupları oluştururken event listener'ları ekle
    const originalCreateInputGroup = createInputGroup;
    createInputGroup = function() {
        const group = originalCreateInputGroup.apply(this, arguments);
        const input = group.querySelector('.editable-label');
        input.addEventListener('input', handleLabelInput);
        input.addEventListener('blur', handleLabelInput);
        return group;
    };

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
            updateCharCount(textarea);
        });
        result.textContent = '';
        result.className = 'result';
        document.querySelector('textarea').focus();
    });
}); 