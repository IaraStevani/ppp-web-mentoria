const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 4000;
const API_BASE_URL = 'http://localhost:3000/api';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'health-risk-app-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Middleware para verificar se é médico
const requireDoctor = (req, res, next) => {
    if (!req.session.user || req.session.user.tipo !== 'medico') {
        return res.status(403).send('Acesso restrito a médicos');
    }
    next();
};

// Middleware para verificar se é paciente
const requirePatient = (req, res, next) => {
    if (!req.session.user || req.session.user.tipo !== 'paciente') {
        return res.status(403).send('Acesso restrito a pacientes');
    }
    next();
};

// Função auxiliar para fazer requisições à API
const apiRequest = async (method, endpoint, data = null, token = null) => {
    try {
        const config = {
            method,
            url: `${API_BASE_URL}${endpoint}`,
            headers: {}
        };
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (data) {
            config.data = data;
            config.headers['Content-Type'] = 'application/json';
        }
        
        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('API Request Error:', error.response?.data || error.message);
        return { 
            success: false, 
            error: error.response?.data?.erro || 'Erro na comunicação com a API' 
        };
    }
};

// Rotas principais
app.get('/', (req, res) => {
    if (req.session.user) {
        if (req.session.user.tipo === 'medico') {
            return res.redirect('/dashboard-medico');
        } else {
            return res.redirect('/dashboard-paciente');
        }
    }
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { nome, senha } = req.body;
    
    const result = await apiRequest('POST', '/login', { nome, senha });
    
    if (result.success) {
        req.session.user = {
            nome,
            token: result.data.token,
            tipo: result.data.tipo
        };
        
        if (result.data.tipo === 'medico') {
            res.redirect('/dashboard-medico');
        } else {
            res.redirect('/dashboard-paciente');
        }
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Rotas do médico
app.get('/dashboard-medico', requireAuth, requireDoctor, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-medico.html'));
});

app.get('/api/pacientes', requireAuth, requireDoctor, async (req, res) => {
    const result = await apiRequest('GET', '/pacientes', null, req.session.user.token);
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.post('/api/pacientes', requireAuth, requireDoctor, async (req, res) => {
    const { nome, idade, imc, pressao } = req.body;
    
    const result = await apiRequest('POST', '/pacientes', 
        { nome, idade: parseInt(idade), imc: parseFloat(imc), pressao: parseFloat(pressao) }, 
        req.session.user.token
    );
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.get('/api/pacientes/:id', requireAuth, requireDoctor, async (req, res) => {
    const result = await apiRequest('GET', `/pacientes/${req.params.id}`, null, req.session.user.token);
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.put('/api/pacientes/:id', requireAuth, requireDoctor, async (req, res) => {
    const { idade, imc, pressao } = req.body;
    
    const result = await apiRequest('PUT', `/pacientes/${req.params.id}`, 
        { idade: parseInt(idade), imc: parseFloat(imc), pressao: parseFloat(pressao) }, 
        req.session.user.token
    );
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.post('/api/pacientes/:id/risco', requireAuth, requireDoctor, async (req, res) => {
    const result = await apiRequest('POST', `/pacientes/${req.params.id}/risco`, null, req.session.user.token);
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(400).json({ error: result.error });
    }
});

// Rotas do paciente
app.get('/dashboard-paciente', requireAuth, requirePatient, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-paciente.html'));
});

app.get('/api/historico', requireAuth, requirePatient, async (req, res) => {
    const result = await apiRequest('GET', '/historico', null, req.session.user.token);
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(400).json({ error: result.error });
    }
});

// Rota para dados do usuário logado
app.get('/api/user', requireAuth, (req, res) => {
    res.json({ 
        nome: req.session.user.nome, 
        tipo: req.session.user.tipo 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});