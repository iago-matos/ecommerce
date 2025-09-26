
// Carrinho de compras
let cart = [];
let produtos = [];

// Carregar produtos do JSON e renderizar
fetch('produtos.json')
    .then(res => res.json())
    .then(data => {
        produtos = data;
        renderProdutos();
    });

function renderProdutos() {
    const container = document.getElementById('products-list');
    container.innerHTML = '';
    produtos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', prod.id);
        card.setAttribute('data-title', prod.title);
        card.setAttribute('data-price', prod.price);
        card.setAttribute('data-img', prod.img);
        card.innerHTML = `
            <img class="product-img" src="${prod.img}" alt="${prod.title}">
            <div class="product-title">${prod.title}</div>
            <div class="product-desc">${prod.desc}</div>
            <div class="product-price">R$ ${prod.price.toFixed(2)}</div>
            <button class="product-btn" onclick="addToCart(this)">Adicionar à sacola</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(btn) {
        const card = btn.closest('.product-card');
        const id = card.getAttribute('data-id');
        const title = card.getAttribute('data-title');
        const price = parseFloat(card.getAttribute('data-price'));
        const img = card.getAttribute('data-img');
        const found = cart.find(item => item.id === id);
        if (found) {
                found.qty++;
        } else {
                cart.push({ id, title, price, img, qty: 1 });
        }
        updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').textContent = cart.reduce((a,b)=>a+b.qty,0);
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.textContent = `${item.title} x${item.qty} - R$ ${(item.price*item.qty).toFixed(2)}`;
        cartList.appendChild(li);
    });
    document.getElementById('cart-total').textContent = 'Total: R$ ' + total.toFixed(2);
}

function toggleCartDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    dropdown.classList.toggle('active');
}

function goToCheckout() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('checkout-page').classList.add('active');
    renderCheckout();
    document.getElementById('cart-dropdown').classList.remove('active');
}

function renderCheckout() {
        const list = document.getElementById('checkout-list');
        list.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
                total += item.price * item.qty;
                const li = document.createElement('li');
                li.textContent = `${item.title} x${item.qty} - R$ ${(item.price*item.qty).toFixed(2)}`;
                list.appendChild(li);
        });
        document.getElementById('checkout-total').textContent = 'Total: R$ ' + total.toFixed(2);

        // Adiciona campo de CEP e botão de calcular frete
        let cepDiv = document.getElementById('cep-div');
        if (!cepDiv) {
            cepDiv = document.createElement('div');
            cepDiv.id = 'cep-div';
            cepDiv.style.margin = '18px 0 10px 0';
            cepDiv.innerHTML = `
                <label for="cep-input"><b>Calcule o frete:</b></label>
                <input id="cep-input" type="text" maxlength="9" placeholder="Digite o CEP" style="padding:6px 12px; border-radius:8px; border:1px solid #ccc; margin:0 8px; width:120px;">
                <button onclick="calcularFrete()" style="padding:6px 18px; border-radius:8px; background:#bfa14a; color:#fff; border:none; font-weight:600;">Calcular</button>
                <span id="frete-valor" style="margin-left:18px; font-weight:600;"></span>
            `;
            document.querySelector('.checkout-page .shipping-options').insertAdjacentElement('beforebegin', cepDiv);
        }

        // Adiciona formulário de dados pessoais se não existir
        let formDiv = document.getElementById('dados-form-div');
        if (!formDiv) {
            formDiv = document.createElement('div');
            formDiv.id = 'dados-form-div';
            formDiv.innerHTML = `
                <form id="dados-form" style="margin:18px 0 10px 0; display:grid; gap:10px; grid-template-columns:1fr 1fr;">
                    <input required name="nome" placeholder="Nome completo" style="padding:8px; border-radius:8px; border:1px solid #ccc; grid-column:span 2;">
                    <input required name="email" type="email" placeholder="E-mail" style="padding:8px; border-radius:8px; border:1px solid #ccc;">
                    <input required name="telefone" placeholder="Telefone" style="padding:8px; border-radius:8px; border:1px solid #ccc;">
                    <input required name="endereco" placeholder="Endereço completo" style="padding:8px; border-radius:8px; border:1px solid #ccc; grid-column:span 2;">
                </form>
            `;
            document.querySelector('.checkout-page .shipping-options').insertAdjacentElement('afterend', formDiv);
        }

        // Adiciona formas de pagamento se não existir
        let pagamentoDiv = document.getElementById('pagamento-div');
        if (!pagamentoDiv) {
            pagamentoDiv = document.createElement('div');
            pagamentoDiv.id = 'pagamento-div';
            pagamentoDiv.style.margin = '18px 0 10px 0';
            pagamentoDiv.innerHTML = `<b>Forma de pagamento:</b> <span id="pagamentos-opcoes"></span>`;
            document.querySelector('.checkout-page .shipping-options').insertAdjacentElement('afterend', pagamentoDiv);
            // Carregar opções do pagamentos.json
            fetch('pagamentos.json').then(r=>r.json()).then(pagamentos => {
                const span = document.getElementById('pagamentos-opcoes');
                span.innerHTML = pagamentos.map(p=>`<label style='margin-right:18px;'><input type='radio' name='pagamento' value='${p.id}' ${p.id==='pix'?'checked':''}> ${p.label}</label>`).join('');
            });
        }
}

// Simulação de cálculo de frete por CEP
function calcularFrete() {
    const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
    let frete = 0;
    let tipo = 'PAC';
    if (cep.length !== 8) {
        document.getElementById('frete-valor').textContent = 'CEP inválido';
        return;
    }
    // Simples: Sudeste (01, 02), Sul (8,9), Norte/Nordeste/Centro-Oeste (resto)
    if (/^(0[1-9]|1[0-9]|2[0-9])/.test(cep)) { // Sudeste
        frete = 15;
        tipo = 'PAC';
    } else if (/^(8|9)/.test(cep)) { // Sul
        frete = 25;
        tipo = 'PAC';
    } else {
        frete = 35;
        tipo = 'PAC';
    }
    document.getElementById('frete-valor').textContent = `Frete: R$ ${frete.toFixed(2)} (${tipo})`;
}

function showHome(e) {
    if (e) e.preventDefault();
    document.getElementById('main-content').style.display = '';
    document.getElementById('checkout-page').classList.remove('active');
    document.getElementById('order-message').textContent = '';
}

function finalizeOrder() {
        // Validação dos dados pessoais
        const form = document.getElementById('dados-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const shipping = document.querySelector('input[name="shipping"]:checked').value;
        let shippingCost = 0;
        if (shipping === 'PAC') shippingCost = 20;
        if (shipping === 'Sedex') shippingCost = 40;
        // Retirar = 0
        let total = cart.reduce((a,b)=>a+b.price*b.qty,0) + shippingCost;
        // Forma de pagamento
        const pagamento = document.querySelector('input[name="pagamento"]:checked');
        const pagamentoLabel = pagamento ? pagamento.parentElement.textContent.trim() : '';
        document.getElementById('order-message').textContent = `Pedido realizado! Total: R$ ${total.toFixed(2)} (${shipping}) | Pagamento: ${pagamentoLabel}`;
        cart = [];
        updateCartUI();
        setTimeout(showHome, 2000);
}

// Fecha dropdown do carrinho ao clicar fora
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('cart-dropdown');
    const icon = document.querySelector('.cart-icon');
    if (!dropdown.contains(e.target) && !icon.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});
