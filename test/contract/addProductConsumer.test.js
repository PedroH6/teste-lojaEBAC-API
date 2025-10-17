const { reporter, flow, handler} = require("pactum");
const pf = require("pactum-flow-plugin");

let token;

function addFlowReporter() {
  pf.config.url = "http://localhost:8080"; // pactum flow server url
  pf.config.projectId = "lojaebac-front";
  pf.config.projectName = "Loja EBAC Frontend";
  pf.config.version = "1.0.18";
  pf.config.username = "scanner";
  pf.config.password = "scanner";
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
      email: "admin@admin.com",
      password: "admin123",
    })
    .returns("data.token");
});

handler.addInteractionHandler("add product response", async () => {
  return {
    provider: "lojaebac-api",
    flow: "Adicionar Produto",
    request: {
      method: "POST",
      path: "/api/addProduct",
      body: {
        authorization: `${token}`,
        name: "celular",
        price: "15000",
        quantity: "200",
        categories: "novo celular",
        description: "iphone",
      },
      response: {
        status: 200,
        body: {
          success: true,
          message: "product added",
        },
      }
    },
  };
});

it("FRONT - deve add um produto", async () => {
  await flow("Adicionar Produto")
    .useInteraction("")
    .post("/api/addProduct")
    .withJson({
      authorization: `${token}`,
      name: "celular",
      price: "15000",
      quantity: "200",
      categories: "novo celular",
      description: "iphone",
    })
    .expectStatus(200)
    .expectJsonLike({
      success: true,
      message: "product added",
    });
});
