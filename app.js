class Produto {
    constructor(codigo, nome, categoria, preco, estoque, imagem) { // constructor inicializa o objeto da classe
        this.codigo = codigo; // this. traz o código, nome ou qualquer outra coisa criada para essa propriedade da classe constructor
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.estoque = estoque;
        this.imagem = imagem;
    }

    temEstoque() {
        return this.estoque > 0;
    }
}

class Carrinho {
    constructor() {
        this.itens = [];
    }

    buscar(codigo) {
        for (let i = 0; i < this.itens.length; i++) {
            if (this.itens[i].produto.codigo === codigo) {
                return this.itens[i];
            }
        }
        return null;
    }

    alterar(produto, variacao) {
        const item = this.buscar(produto.codigo);
        let novaQuantidade = variacao;

        if (item !== null) {
            novaQuantidade = item.quantidade + variacao;
        }

        if (novaQuantidade > produto.estoque) {
            alert("Estoque insuficiente para essa quantidade!");
        } else if (novaQuantidade <= 0) {
            this.remover(produto.codigo);
        } else if (item !== null) {
            item.quantidade = novaQuantidade;
        } else {
            this.itens.push({ produto: produto, quantidade: novaQuantidade });
        }
    }

    remover(codigo) {
        this.itens = this.itens.filter(item => item.produto.codigo !== codigo);
    }

    calcularTotais() {
        let quantidade = 0;
        let subtotal = 0;

        for (let i = 0; i < this.itens.length; i++) {
            quantidade += this.itens[i].quantidade;
            subtotal += this.itens[i].produto.preco * this.itens[i].quantidade;
        }

        let desconto = 0;
        if (subtotal >= 150) {
            desconto = subtotal * 0.1;
        }

        return {
            quantidade: quantidade,
            subtotal: subtotal,
            desconto: desconto,
            total: subtotal - desconto
        };
    }
}

const produtos = [
    new Produto(1, "Camiseta “Directioner Classic”", "Vestuário", 69.90, 0, "img/camiseta.jpg"),
    new Produto(2, "Boné Bordado “Midnight Memories”", "Acessórios", 49.90, 10, "img/bone.jpg"),
    new Produto(3, "Moletom “Made in the AM”", "Vestuário", 114.90, 8, "img/moletom.jpg"),
    new Produto(4,"Caneca Personalizada “1D Album Covers”", "Colecionáveis", 35.00, 15, "img/caneca.jpg"),
    new Produto(5, "Chaveiro Metálico “Logo One Direction”", "Acessórios", 15.00, 15, "img/chaveiro.jpg"),
    new Produto(6, "Poster Colecionável “The Tour”", "Decoração", 29.90, 20, "img/poster.jpg"),
];

var carrinho = new Carrinho();

const campoBusca = document.getElementById("busca");
const campoCategoria = document.getElementById("categoria");
const gradeProdutos = document.getElementById("grade");
const areaItens = document.getElementById("itens");
const areaResumo = document.getElementById("resumo");

const moeda = (valor) => "R$ " + valor.toFixed(2).replace(".", ",");

function mostrarProdutos() {
    const busca = campoBusca.value.toLowerCase();
    const categoria = campoCategoria.value;
    let html = "";

    for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        const combinaNome = p.nome.toLowerCase().includes(busca);
        const combinaCategoria = categoria === "Todos" || p.categoria === categoria;

        if (combinaNome && combinaCategoria) {
            const disponivel = p.temEstoque();
            html += `
                <div class="card">
                    <img src="${p.imagem}" alt="${p.nome}">
                    <h3>${p.nome}</h3>
                    <p>${p.categoria}</p>
                    <p class="preco">${moeda(p.preco)}</p>
                    <p>${disponivel ? "Estoque: " + p.estoque : "Indisponível"}</p>
                    <button onclick="mudarQuantidade(${p.codigo}, 1)" ${disponivel ? "" : "disabled"}>
                        ${disponivel ? "Adicionar ao carrinho" : "Esgotado"}
                    </button>
                </div>`;
        }
    }

    if (html === "") {
        html = "<p>Nenhum produto encontrado.</p>";
    }

    gradeProdutos.innerHTML = html;
}

function mostrarCarrinho() {
    let html = "";
    let i = 0;

    while (i < carrinho.itens.length) {
        const item = carrinho.itens[i];
        const p = item.produto;
        html += `
            <div class="item">
                <p>${p.nome}<br>${moeda(p.preco)} x ${item.quantidade} = ${moeda(p.preco * item.quantidade)}</p>
                <div>
                    <button onclick="mudarQuantidade(${p.codigo}, -1)">-</button>
                    ${item.quantidade}
                    <button onclick="mudarQuantidade(${p.codigo}, 1)">+</button>
                    <button onclick="removerItem(${p.codigo})">X</button>
                </div>
            </div>`;
        i++;
    }

    if (html === "") {
        html = "<p>O carrinho está vazio.</p>";
    }

    const totais = carrinho.calcularTotais();
    areaItens.innerHTML = html;
    areaResumo.innerHTML = `
        <p>Itens: ${totais.quantidade}</p>
        <p>Subtotal: ${moeda(totais.subtotal)}</p>
        <p>Desconto: ${moeda(totais.desconto)}</p>
        <p class="preco">Total: ${moeda(totais.total)}</p>`;
}

function mudarQuantidade(codigo, variacao) {
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].codigo === codigo) {
            carrinho.alterar(produtos[i], variacao);
        }
    }
    mostrarCarrinho();
}

function removerItem(codigo) {
    carrinho.remover(codigo);
    mostrarCarrinho();
}

function finalizar() {
    if (carrinho.itens.length === 0) {
        alert("Não é possível finalizar: o carrinho está vazio!");
        return;
    }

    const totais = carrinho.calcularTotais();
    let texto = "RESUMO DA COMPRA\n\n";

    for (let i = 0; i < carrinho.itens.length; i++) {
        texto += carrinho.itens[i].quantidade + "x " + carrinho.itens[i].produto.nome + "\n";
    }

    texto += "\nSubtotal: " + moeda(totais.subtotal);
    texto += "\nDesconto: " + moeda(totais.desconto);
    texto += "\nTotal: " + moeda(totais.total);
    texto += "\n\nConfirmar compra?";

    if (confirm(texto)) {
        alert("Compra concluída com sucesso!");
        carrinho = new Carrinho();
        mostrarCarrinho();
    }
}

mostrarProdutos();
mostrarCarrinho();

const botaoSom = document.getElementById("botaoSom");
const musica = document.getElementById("musica");


let musicaTocando = false;


function alternarMusica() {
    if (musicaTocando) {
        musica.pause();     
        musica.currentTime = 0;
        botaoSom.innerText = "🔊 Tocar música";
    } else {
        musica.play();
        botaoSom.innerText = "🔇 Parar música";
    }

    musicaTocando = !musicaTocando;
}