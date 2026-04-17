const Joi = require('joi')


const listarUsuarioSchema = Joi.object({
    // Validação do Array de Usuários
    users: Joi.array().items(
        Joi.object({
            id: Joi.number().integer().required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            isAdmin: Joi.number().valid(0, 1).required(),
            activeReservations: Joi.number().valid(0, 1).required(),
            totalReservations: Joi.number().integer().min(0).required()
        })
    ).required(),

    // Validação da Paginação
    pagination: Joi.object({
        currentPage: Joi.number().integer().required(),
        totalPages: Joi.number().integer().required(),
        totalUsers: Joi.number().integer().required(),
        hasNext: Joi.boolean().required(),
        hasPrev: Joi.boolean().required(),
        limit: Joi.number().integer().required(),
        showing: Joi.number().integer().required()
    }).required(),

    // Validação dos Filtros
    filters: Joi.object({
        search: Joi.string().allow(null) // Permite string ou null
    }).required()
});

export default listarUsuarioSchema;