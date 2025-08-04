export const validateCreateUserParams = (params) => {
    if (!params.FirstName || typeof params.FirstName !== 'string') {
        throw new Error('Parameter FirstName is required')
    }

    return params
}




export const validateUpdateContactParams = (params) => {
    if (!params.FirstName || typeof params.FirstName !== 'string') {
        throw new Error('Parameter FirstName is required')
    }

    return params
}

export const mySpecialVariable = "Andreas" 