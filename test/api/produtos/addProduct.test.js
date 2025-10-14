const { spec, request} = require('pactum');

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



it.only('API - deve add um produto', async () => {
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