const { spec, request} = require('pactum')

request.setBaseUrl('http://lojaebac.ebaconline.art.br')

let token;
let id;


beforeEach(async () => {
    token = await spec()
    .post("/public/authUser")
    .withJson({
        "email": "admin@admin.com",
        "password": "admin123"
    })
    .returns('data.token')

    id = await spec()
    .post("/api/addProduct")
    .withJson({
            "authorization": `${token}`,
            "name": "celular",
            "price": "15000",
            "quantity": "200",
            "categories": "novo celular",
            "description": "iphone"
    })
    .returns('data._id')
});

it.only('API - deve iditar um produto', async () => {
    await spec()
    .put(`/api/editProduct/${id}`)
    .withJson({
        "authorization": `${token}`,
            "name": "iphone 17",
            "price": "15000",
            "quantity": "200",
            "categories": "novo celular",
            "description": "iphone"
    })
    .expectStatus(200)
    .expectJsonLike({
        success: true,
        message: "product updated"
    })
});

