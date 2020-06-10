// Importar o express para criação e configuração do servidor
const express = require("express");
const server = express();

const db = require("./db");

// Configurar aquivos estáticos (css, scripts, imagens)
server.use(express.static("public"));

// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }));

// Configuração do nunjucks
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
  express: server,
  noCache: true
});

// Criar uma rota e configurar o pedido do cliente para responder
server.get("/", (req, res) => {
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    const reversedIdeas = [...rows].reverse();

    const lastIdeas = [];
    for (idea of reversedIdeas) {
      if (lastIdeas.length < 2) {
        lastIdeas.push(idea);
      }
    }

    return res.render("index.html", { ideas: lastIdeas });
  });
});

server.get("/ideas", (req, res) => {
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    const reversedIdeas = [...rows].reverse();

    return res.render("ideas.html", { ideas: reversedIdeas });
  });
});

server.post("/", (req, res) => {
  const query = `
    INSERT INTO ideas(
      image,
      title,
      category,
      description,
      link
    ) VALUES(?,?,?,?,?);
  `;

  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    return res.redirect("/ideas");
  });
});

// Ligar o servidor na porta 3000
server.listen(3000);
