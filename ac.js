//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");


//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/ac',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});


//criando a model do seu projeto
const PessoaSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required : true},
    endereco : { type : String},
    numero : {type : Number},
    cep : {type : String, required : true},
    nascimento : {type : Date, required : true}
});


const Pessoa = mongoose.model("Pessoa", PessoaSchema);


//configurando os roteamentos
app.post("/cadastropessoa", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const endereco = req.body.endereco;
    const numero = req.body.numero;
    const cep  = req.body.cep;
    const nascimento = req.body.nascimento

    //Testando todos os campos preenchidos
    if(nome == null || email == null || endereco == null || numero == null || cep == null || nascimento == null){
        return res.status(400).json({error : "Preencher todos os campos"});
    }

    //Teste mais importante da AC
    const emailExiste = await Pessoa.findOne({email:email});

    if(emailExiste){
        return res.status(400).json({error: "O email cadastrado já existe!!!"})
    }

    const pessoa = new Pessoa({
        nome : nome,
        email : email,
        endereco : endereco,
        numero : numero,
        cep : cep,
        nascimento : nascimento
    })


    try{
        const newPessoa = await pessoa.save();
        res.json({error : null, msg : "Cadastro ok", pessoaId : newPessoa._id});
    } catch(error){
        res.status(400).json({error});
    }


});

//rota para o get de cadastro.html - inw
app.get("/cadastropessoa", async(req, res)=>{
    res.sendFile(__dirname +"/cadastropessoa.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})

//rota raiz - inw - sempre esta no final do programa
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})
