// Array para armazenar os empréstimos salvos
let loans = JSON.parse(localStorage.getItem('loans_data')) || [];

// Elementos do DOM
const loanForm = document.getElementById('loanForm');
const loansList = document.getElementById('loansList');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.getElementById('closeModal');
const paymentForm = document.getElementById('paymentForm');

// Definir data padrão no formulário (hoje)
document.getElementById('loanDate').valueAsDate = new Date();
document.getElementById('firstDueDate').valueAsDate = new Date();

// Salvar no LocalStorage
function saveToStorage() {
    localStorage.setItem('loans_data', JSON.stringify(loans));
}

// Formatar moeda em Real (R$)
function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formatar data de AAAA-MM-DD para DD/MM/AAAA
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Adicionar novo empréstimo
loanForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanDate = document.getElementById('loanDate').value;
    const installmentsCount = parseInt(document.getElementById('installments').value);
    const firstDueDate = document.getElementById('firstDueDate').value;

    // Cálculo das parcelas
    const totalAmount = amount * (1 + (interestRate / 100));
    const installmentValue = totalAmount / installmentsCount;

    const installments = [];
    let currentDueDate = new Date(firstDueDate + 'T00:00:00');

    for (let i = 0; i < installmentsCount; i++) {
        const dueDateFormatted = currentDueDate.toISOString().split('T')[0];

        installments.push({
            number: i + 1,
            dueDate: dueDateFormatted,
            totalValue: installmentValue,
            paidValue: 0,
            isPaid: false
        });

        // Adiciona 1 mês para o próximo vencimento
        currentDueDate.setMonth(currentDueDate.getMonth() + 1);
    }

    const newLoan = {
        id: Date.now().toString(),
        clientName,
        amount,
        interestRate,
        loanDate,
        installments
    };

    loans.push(newLoan);
    saveToStorage();
    renderLoans();
    loanForm.reset();
    document.getElementById('loanDate').valueAsDate = new Date();
    document.getElementById('firstDueDate').valueAsDate = new Date();
});

// Renderizar a lista de empréstimos
function renderLoans() {
    loansList.innerHTML = '';

    if (loans.length === 0) {
        loansList.innerHTML = '<p style="text-align: center; color: #777;">Nenhum empréstimo cadastrado.</p>';
        return;
    }

    loans.forEach(loan => {
        const loanCard = document.createElement('div');
        loanCard.className = 'loan-card';

        let totalPending = 0;
        let totalPaid = 0;

        loan.installments.forEach(inst => {
            const remaining = inst.totalValue - inst.paidValue;
            totalPending += remaining;
            totalPaid += inst.paidValue;
        });

        loanCard.innerHTML = `
            <div class="loan-header">
                <h3>👤 ${loan.clientName}</h3>
                <button class="btn-danger" onclick="deleteLoan('${loan.id}')">Excluir</button>
            </div>
            <div class="loan-info-grid">
                <div><strong>Valor Emprestado:</strong> ${formatCurrency(loan.amount)}</div>
                <div><strong>Juros Aplicado:</strong> ${loan.interestRate}%</div>
                <div><strong>Data do Empréstimo:</strong> ${formatDate(loan.loanDate)}</div>
                <div><strong>Total Pago:</strong> <span style="color: green; font-weight: bold;">${formatCurrency(totalPaid)}</span></div>
                <div><strong>Total Restante:</strong> <span style="color: red; font-weight: bold;">${formatCurrency(totalPending)}</span></div>
            </div>
            <h4>Meses / Parcelas:</h4>
            <div class="installments-list">
                ${loan.installments.map((inst, index) => {
                    const remaining = inst.totalValue - inst.paidValue;
                    const isFullyPaid = inst.isPaid || remaining <= 0;
                    const statusClass = isFullyPaid ? 'status-paid' : 'status-pending';

                    return `
                        <div class="installment-item ${statusClass}">
                            <div>
                                <span>Mês ${inst.number} (${formatDate(inst.dueDate)})</span><br>
                                <small>Total: ${formatCurrency(inst.totalValue)} | Pago: ${formatCurrency(inst.paidValue)} | Restam: ${formatCurrency(Math.max(0, remaining))}</small>
                            </div>
                            <div>
                                ${isFullyPaid 
                                    ? '<span class="badge">PAGO TOTAL</span>' 
                                    : `<button class="btn-pay" onclick="openPaymentModal('${loan.id}', ${index})">Pagar / Dar Baixa</button>`
                                }
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        loansList.appendChild(loanCard);
    });
}

// Excluir empréstimo
function deleteLoan(id) {
    if (confirm('Tem certeza que deseja excluir este registro de empréstimo?')) {
        loans = loans.filter(l => l.id !== id);
        saveToStorage();
        renderLoans();
    }
}

// Modal de Pagamento
function openPaymentModal(loanId, installmentIndex) {
    const loan = loans.find(l => l.id === loanId);
    const inst = loan.installments[installmentIndex];
    const remaining = inst.totalValue - inst.paidValue;

    document.getElementById('modalLoanId').value = loanId;
    document.getElementById('modalInstallmentIndex').value = installmentIndex;
    document.getElementById('modalClientInfo').innerText = 
        `Cliente: ${loan.clientName} | Mês ${inst.number} | Restante: ${formatCurrency(remaining)}`;
    
    document.getElementById('paymentAmount').value = remaining.toFixed(2);
    paymentModal.style.display = 'flex';
}

closeModal.onclick = () => { paymentModal.style.display = 'none'; };

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const loanId = document.getElementById('modalLoanId').value;
    const instIndex = parseInt(document.getElementById('modalInstallmentIndex').value);
    const payValue = parseFloat(document.getElementById('paymentAmount').value);

    const loan = loans.find(l => l.id === loanId);
    const inst = loan.installments[instIndex];

    inst.paidValue += payValue;
    if (inst.paidValue >= inst.totalValue) {
        inst.isPaid = true;
    }

    saveToStorage();
    renderLoans();
    paymentModal.style.display = 'none';
});

// Renderização inicial
renderLoans();