function errorMiddleware(err, req, res, next) {
    let statusCode = 400
    let message = err.message

    if (err.sqlState === '45000') {
        statusCode = 400;
        return res.status(statusCode).json({ message });
    }
    
    if (message.includes('não encontrado') || message.includes('Nenhum')) {
        statusCode = 404
    } else if (message.includes('Acesso negado') || message.includes('inválido')) {
        statusCode = 403
    }

    if (!err.message || (err.code && err.code !== 'ER_SIGNAL_EXCEPTION')) { 
        statusCode = 500
        message = 'Erro interno do servidor'
        console.error(' Erro de Infra/Banco:', err)
    }

    return res.status(statusCode).json({ message })
}

module.exports = errorMiddleware