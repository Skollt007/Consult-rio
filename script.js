let form = document.getElementById('idForm');
let id_contador = 0; 
let editId = null; 

function apagar_form() {
    form.style.display = 'none';
}

class Cliente {
    constructor(nome, data, descricao, id) {
        this.nome = nome;
        this.data = data;
        this.descricao = descricao;
        this.id = id; 
    }

    getNome() {
        return this.nome;
    }

    setNome(novoNome) {
        this.nome = novoNome;
    }

    getData() {
        return this.data;
    }

    setData(novoData) {
        this.data = novoData;
    }

    getDescricao() {
        return this.descricao;
    }

    setDescricao(novoDescricao) {
        this.descricao = novoDescricao;
    }

    getId() {
        return this.id;
    }

    setId(novoId) {
        this.id = novoId;
    }

    funcao_forEach() {
        let botoes_apagar = document.querySelectorAll('.apagar');
        botoes_apagar.forEach(botao_apagar => {
            botao_apagar.addEventListener('click', () => {
                let localCliente = JSON.parse(localStorage.getItem('cliente')) || [];
                let id_div = botao_apagar.closest('.divInformacoes').id;
                for (let chave of localCliente) {
                    let div_id_obj = `Div_${chave.id}`;
                    if (div_id_obj == id_div) {
                        let indice = localCliente.indexOf(chave);
                        localCliente.splice(indice, 1); 
                        localStorage.setItem('cliente', JSON.stringify(localCliente));
                        botao_apagar.closest('.divInformacoes').remove();
                        break;
                    }
                }
            });
        });

        let botoes_editar = document.querySelectorAll('.editar');
        botoes_editar.forEach(botao_editar => {
            botao_editar.addEventListener('click', () => {
                let id_div = botao_editar.closest('.divInformacoes').id;
                editId = id_div.replace('Div_', '');
                let localCliente = JSON.parse(localStorage.getItem('cliente')) || [];
                let cliente = localCliente.find(cliente => cliente.id == editId);
                if (cliente) {
                    document.getElementById('id_NomeUsuario').value = cliente.nome;
                    document.getElementById('id_Data').value = cliente.data;
                    document.getElementById('id_Descricao').value = cliente.descricao;
                    abrirForm();
                }
            });
        });
    }

    colocarCliente() {
        let divPai = document.getElementById('divAgenda');
        let divAgenda = document.createElement('div');
        let agenda = document.createElement('p');
        let apagar = document.createElement('input');
        let editar = document.createElement('input');

        editar.type = 'button';
        editar.value = "\u{1F58D}";
        apagar.type = 'button';
        apagar.value = '\u{1F6AB}';
        editar.className = 'editar';
        apagar.className = 'apagar';
        apagar.id = `id_apagar_${this.id}`;
        editar.id = `edit_${this.id}`;

        let data_normal = this.transformar_data();
        agenda.innerHTML = `Nome: ${this.nome} <br> Data: ${data_normal} <br> Descrição: ${this.descricao}`;
        divAgenda.className = 'divInformacoes';
        divAgenda.id = `Div_${this.id}`; 
        divAgenda.appendChild(editar);
        divAgenda.appendChild(apagar);
        divAgenda.appendChild(agenda);
        divPai.appendChild(divAgenda);

        this.funcao_forEach();
    }

    colocarLocalStorage() {
        let objetoCliente = {
            nome: this.nome,
            data: this.data,
            descricao: this.descricao,
            id: this.id
        };
        let cliente = JSON.parse(localStorage.getItem('cliente')) || [];
        cliente.push(objetoCliente);
        localStorage.setItem('cliente', JSON.stringify(cliente));
        this.colocarCliente();
    }

    transformar_data() {
        let hora = this.data.substring(11);
        let dia = this.data.substring(8, 10);
        let mes = this.data.substring(5, 7);
        let ano = this.data.substring(0, 4);
        let data_normal = `${hora}-${dia}/${mes}/${ano}`;
        return data_normal;
    }

    static carregarClientes() {
        let clientes = JSON.parse(localStorage.getItem('cliente')) || [];
        clientes.forEach(cliente => {
            let clienteObj = new Cliente(cliente.nome, cliente.data, cliente.descricao, cliente.id);
            clienteObj.colocarCliente();
        });
    }
}

function pegarValores() {
    let nomeCliente = document.getElementById('id_NomeUsuario').value;
    let dataAtendimento = document.getElementById('id_Data').value;
    let descricao = document.getElementById('id_Descricao').value;
    if (editId === null) {
        criarObjeto(nomeCliente, dataAtendimento, descricao);
    } else {
        atualizarObjeto(nomeCliente, dataAtendimento, descricao);
    }
}

function criarObjeto(nome, data, descricao) {
    let cliente = new Cliente(nome, data, descricao, id_contador);
    id_contador++;
    cliente.colocarLocalStorage();
}

function atualizarObjeto(nome, data, descricao) {
    let localCliente = JSON.parse(localStorage.getItem('cliente')) || [];
    let clienteIndex = localCliente.findIndex(cliente => cliente.id == editId);
    if (clienteIndex !== -1) {
        localCliente[clienteIndex] = {
            nome: nome,
            data: data,
            descricao: descricao,
            id: editId
        };
        localStorage.setItem('cliente', JSON.stringify(localCliente));
        document.querySelector(`#Div_${editId} p`).innerHTML = `Nome: ${nome} <br> Data: ${transformar_data(data)} <br> Descrição: ${descricao}`;
        editId = null; 
        removeForm();
    }
}

function transformar_data(data) {
    let hora = data.substring(11);
    let dia = data.substring(8, 10);
    let mes = data.substring(5, 7);
    let ano = data.substring(0, 4);
    let data_normal = `${hora}-${dia}/${mes}/${ano}`;
    return data_normal;
}

function abrirForm() {
    form.style.display = 'flex';
}

function removeForm() {
    form.style.display = 'none';
    document.getElementById('id_NomeUsuario').value = '';
    document.getElementById('id_Data').value = '';
    document.getElementById('id_Descricao').value = '';
}

let buttonVoltar = document.getElementById('buttonVoltar');
buttonVoltar.addEventListener('click', removeForm);
let buttonForm = document.getElementById('buttonForm');
buttonForm.addEventListener('click', abrirForm);
let buttonCadastro = document.getElementById('buttonCadastro');
buttonCadastro.addEventListener('click', pegarValores);

document.addEventListener('DOMContentLoaded', () => {
    apagar_form();
    Cliente.carregarClientes();
});
