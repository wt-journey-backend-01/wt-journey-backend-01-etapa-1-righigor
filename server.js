const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/sugestao", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "sugestao.html"));
});

app.get("/contato", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contato.html"));
});

app.post("/contato", (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  res.redirect(
    `/contato-recebido?nome=${encodeURIComponent(
      nome
    )}&email=${encodeURIComponent(email)}&assunto=${encodeURIComponent(
      assunto
    )}&mensagem=${encodeURIComponent(mensagem)}`
  );
});

app.get("/contato-recebido", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contato-recebido.html"));
});

app.get("/api/lanches", (req, res) => {
  try {
    const lanches = require("./public/data/lanches.json");
    res.json(lanches);
  } catch (error) {
    console.error("Erro ao carregar lanches:", error);
    res.status(500).json({
      error: "Erro ao carregar o cardápio",
      details: error.message,
    });
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});
