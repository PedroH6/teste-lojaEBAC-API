const {spec, request} = require('pactum')

request.setBaseUrl('http://lojaebac.ebaconline.art.br')

let id 
let token;


beforeEach(async () => {
  token = await spec()
    .post('/public/authUser')
    .withJson({
      email: 'admin@admin.com',
      password: 'admin123'
    })
    .returns('data.token');

  
  id = await spec()
    .post('/api/addCategory')
    .withJson({
    authorization: `${token}`,
      name: 'celular'
    })
    .returns('data._id');
});

it('API - deve deletar uma categoria com succeso', async () => {
    await spec()
    .delete(`/api/deleteCategory/${id}`)
    .withJson({
         "authorization": `${token}`
        })
        .expectStatus(200)
        .expectJsonLike({
            success: true,
            message: "category deleted"
        })
});