const { spec, request} = require('pactum')

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

it.only('API - deve add uma categoria', async () => {
    await spec()
    .post("/api/addCategory")
    .withJson({
         "authorization": `${token}`,
         "name": "celular" 
    })
    .expectStatus(200)
    .expectJsonLike({
        success: true,
        message: "category added",
        data: {
            name: "celular"
        }
    })
});