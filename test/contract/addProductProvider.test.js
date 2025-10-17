const { reporter, flow } = require('pactum');
const pf = require('pactum-flow-plugin');

let token

function addFlowReporter() {
  pf.config.url = 'http://localhost:8080'; // pactum flow server url
  pf.config.projectId = 'lojaebac-api';
  pf.config.projectName = 'Loja EBAC Backend';
  pf.config.version = '1.0.18';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
});

// global after
after(async () => {
  await reporter.end();
});



beforeEach(async () => {
    token = await spec()
    .post("/public/authUser")
    .withJson({
        "email": "admin@admin.com",
        "password": "admin123"
    })
    .returns('data.token')
});

it('API - deve add um produto', async () => {
    await flow('Adicionar Produto')
    .post("/api/addProduct")
    .withJson({
            "authorization": `${token}`,
            "name": "celular",
            "price": "15000",
            "quantity": "200",
            "categories": "novo celular",
            "description": "iphone"
    })
    .expectStatus(200)
    .expectJsonLike({
        success: true,
        message: "product added"
    })
});