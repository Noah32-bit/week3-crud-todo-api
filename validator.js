const Joi = require("joi");

const  validateCreateTodo = (req,res,next) =>{
    const schema = Joi.object({
        task:Joi.string().min(3).max(100).required(),
        completed: Joi.boolean().default(false)
    })

    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({error: error.details[0].message})

    }
        next()
}

// 2. Validator for PATCH (Updates - Fields are optional, but must be valid if sent)
const validateUpdateTodo = (req, res, next) => {
    const schema = Joi.object({
        task: Joi.string().trim().min(3).max(100), // NOT required()
        completed: Joi.boolean()
    }).min(1); // Ensures the user sends AT LEAST one field to update, prevents empty {} updates

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};


module.exports = {
    validateCreateTodo,
    validateUpdateTodo
};