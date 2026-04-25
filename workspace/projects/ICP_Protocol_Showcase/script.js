const terminalLines = [
    { type: 'input', text: 'dfx deploy --network ic' },
    { type: 'output', text: 'Deploying canisters to the Internet Computer...' },
    { type: 'output', text: 'Authorizing... [OK]' },
    { type: 'output', text: 'Optimizing Wasm module for ICP_Protocol... [DONE]' },
    { type: 'output', text: 'Installing canister: icp_backend_v2' },
    { type: 'output', text: 'Canister ID: qjdke-aaaaa-aaa-aaaa-cai' },
    { type: 'output', text: 'Cycles balance: 10.5T (Satisfactory)' },
    { type: 'input', text: 'dfx ledger --network ic balance' },
    { type: 'output', text: '245.67 ICP' },
    { type: 'input', text: 'dfx canister --network ic call icp_backend burn_for_cycles "(2.5)"' },
    { type: 'output', text: 'Conversion successful. 2.5 ICP -> 12.5T Cycles.' },
    { type: 'output', text: 'Node Provider Status: Verified (Global Subnet 04)' },
    { type: 'output', text: 'System Health: 100% | Latency: 200ms' },
    { type: 'input', text: 'exit' },
    { type: 'output', text: 'Web-speed blockchain session terminated.' }
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
