/// <reference types="cypress"/>

import usuario from '../fixtures/usuarios.json'
import listarUsuarioContrato from '../contratos/listar.Usuario.Contrato'


describe('Testes da funcionalidade de usuário', () => {
    let token
    let id

    before(() => {
        cy.token(usuario.admin.email, usuario.admin.senha).then(tkn => { token = tkn })
    });

    it('Deve validar contrato de lista de usuários', () => {
        cy.request({
            method: 'GET',
            url: '/users',
            headers: { 'authorization': token }
        }).then(response => {
            return listarUsuarioContrato.validateAsync(response.body)
        })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.api({
            method: 'GET',
            url: '/users',
            headers: { 'authorization': token }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users).to.be.an('array')
            
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        cy.api({
            method: 'POST',
            url: '/users',
            body: {
                "name": usuario.valido.maria.name,
                "email": usuario.valido.maria.email,
                "password": usuario.valido.maria.senha
            }
        }).then(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Usuário criado com sucesso.")
            id = response.body.user.id
            
        })
    });

    it('Deve validar um usuário com email inválido', () => {
        cy.api({
            method: 'POST',
            url: '/users',
            body:{
                "name": usuario.valido.maria.name,
                "email": usuario.invalido.maria.email,
                "password": usuario.valido.maria.senha
            },
            failOnStatusCode: false 
        }).should(response => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal("Formato de email inválido.")
            })
           
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        cy.api({
            method: 'PUT',
            url: `/users/${id}`,
            headers: {authorization: token},
            body: {
                "name": usuario.valido.maria_novo.name,
                "email": usuario.valido.maria_novo.email,
                "password": usuario.valido.maria_novo.senha
            }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal("Usuário atualizado com sucesso.")
        })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        cy.api({
            method: 'DELETE',
            url: `/users/${id}`,
            headers:{authorization: token}
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal("Usuário removido com sucesso.")
            cy.log(response)
        })
    });
});