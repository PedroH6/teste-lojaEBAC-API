const { spec, request} = require('pactum');
const addProductContract = require('../../contract/addProduct.contract');

request.setBaseUrl('http://lojaebac.ebaconline.art.br')

let token;

beforeEach(async () => {
    token = await spec()
    .post("/public/authUser")
    .withJson({
        "email": "admin@admin.com",
        "password": "admin123"
    })
    .returns('data.token')
});

it('Deve validar o contrato de criação de produto', async () => {
  const response = await spec()
    .post("/api/addProduct")
    .withHeaders('authorization', `${token}`)
    .withJson({
      name: "celular",
      price: 15000,
      quantity: 200,
      categories: "novo celular",
      description: "iphone"
    })
    .expectStatus(200)
    .returns('res.body');

  // Validação do contrato
  const { error } = addProductContract.validate(response, { abortEarly: false });
  if (error) {
    throw new Error(`Contrato inválido: ${error.message}`);
  }
});

it('API - deve add um produto', async () => {
    await spec()
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