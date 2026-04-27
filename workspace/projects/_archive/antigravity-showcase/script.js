const terminalLines = [
    { type: 'input', text: 'antigravity audit --deep ./workspace' },
    { type: 'output', text: 'Indexing codebase... Found 42 files.' },
    { type: 'output', text: 'Analyzing dependency tree... [DONE]' },
    { type: 'output', text: 'Issue detected in auth_service.js:L156' },
    { type: 'output', text: 'BUG: Race condition in token validation.' },
    { type: 'input', text: 'antigravity fix auth_service.js' },
    { type: 'output', text: 'Generating plan... 3 steps created.' },
    { type: 'output', text: '1. Isolation of validation logic.' },
    { type: 'output', text: '2. Implementation of mutex lock.' },
    { type: 'output', text: '3. Regression test suite update.' },
    { type: 'output', text: 'Applying changes... [██████████] 100%' },
    { type: 'output', text: 'Verification SUCCESS. Zero bloat added.' },
    { type: 'input', text: 'antigravity report' },
    { type: 'output', text: 'Velocity increased by 45%. System healthy.' }
];

function typeTerminal() {
    const content = document.getElementById('terminal-content');
    let lineIdx = 0;

    function addLine() {
        if (lineIdx >= terminalLines.length) {
            // Loop it
            setTimeout(() => {
                content.innerHTML = '';
                lineIdx = 0;
                addLine();
            }, 3000);
            return;
        }

        const line = terminalLines[lineIdx];
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line';
        
        const lineNum = document.createElement('span');
        lineNum.className = 'line-num';
        lineNum.textContent = (lineIdx + 1).toString().padStart(2, '0');
        
        const contentSpan = document.createElement('span');
        
        if (line.type === 'input') {
            const prompt = document.createElement('span');
            prompt.className = 'prompt';
            prompt.textContent = 'λ';
            lineDiv.appendChild(lineNum);
            lineDiv.appendChild(prompt);
            
            contentSpan.className = 'input';
            lineDiv.appendChild(contentSpan);
            content.appendChild(lineDiv);

            let charIdx = 0;
            const typeChar = () => {
                if (charIdx < line.text.length) {
                    contentSpan.textContent += line.text[charIdx];
                    charIdx++;
                    setTimeout(typeChar, 30 + Math.random() * 50);
                } else {
                    lineIdx++;
                    setTimeout(addLine, 600);
                }
            };
            typeChar();
        } else {
            lineDiv.appendChild(lineNum);
            contentSpan.className = 'output';
            contentSpan.textContent = line.text;
            lineDiv.appendChild(contentSpan);
            content.appendChild(lineDiv);
            lineIdx++;
            content.scrollTop = content.scrollHeight;
            setTimeout(addLine, 400);
        }
    }

    addLine();
}

window.addEventListener('DOMContentLoaded', () => {
    typeTerminal();
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});
