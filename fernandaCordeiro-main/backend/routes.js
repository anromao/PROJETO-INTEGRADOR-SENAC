const express = require('express')
const router = express.Router()
const db = require('./src/db')

//GET - Listar usuários
router.get('/usuarios', async (req, res) => {
    try {
        const sql = 'select * from tbUsuarios order by codUsu desc'
        const [rows] = await db.query(sql)
        res.json(rows)
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar usuários do banco' })
    }
})

//POST - Criar usuário
router.post('/usuarios', async (req, res) => {
    const { nome, cpf, telCel, email } = req.body || {}
    if (!nome || !cpf || !telCel || !email) {
        return res.status(400).json({ erro: 'Todos os dados são obrigatórios' })
    }
    try {
        const sql = 'insert into tbUsuarios(nome, cpf, telCel, email) values (?,?,?,?)'
        const [result] = await db.query(sql, [nome, cpf, telCel, email])
        res.status(201).json({ id: result.insertId, nome, cpf, telCel, email })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400)
                .json({ erro: 'Dados já cadastrados' })
        res.status(500).json({ erro: 'Erro ao salvar no banco' })
    }
})

//PUT - Alterar usuário
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params
    const { nome, cpf, telCel, email } = req.body

    try {
        const sql = 'update tbUsuarios set nome=?, cpf=?, telCel=?, email=? where codUsu=?'
        const [result] = await db.query(sql, [nome, cpf, telCel, email, id])
        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Usuário não encontrado' })
        res.json({ mensagem: 'Usuário alterado com sucesso' })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ erro: 'Estes dados já estão em uso' })
        res.status(500).json({ erro: 'Erro ao atualizar no banco' })
    }
})

//Delete - Excluir usuário
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params
    try {
        const sql = 'delete from tbUsuarios where codUsu=?'
        const [result] = await db.query(sql, [id])
        if (result.affectedRows === 0)
            return res.status(404)
                .json({ erro: 'Usuário não encontrado' })
        res.json({ mensagem: 'Usuário deletado com sucesso' })
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar do banco' })
    }
})

// ----CRUD PACIENTES----

router.get('/pacientes', async (req, res) => {
    try {
        const sql = 'select * from tbPacientes order by codPac desc'
        const [rows] = await db.query(sql)
        res.json(rows)
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar pacientes do banco' })
    }
})

//POST - Criar usuário
router.post('/pacientes/:id', async (req, res) => {
    const { id } = req.params
    const codUsu = Number(id)
    const { nome } = req.body || {}
    if (!nome || !codUsu) {
        return res.status(400).json({ erro: 'Todos os dados são obrigatórios' })
    }
    try {
        const sql = 'insert into tbPacientes(nome, codUsu) values (?,?)'
        const [result] = await db.query(sql, [nome, codUsu])
        res.status(201).json({ id: result.insertId, nome, codUsu })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400)
                .json({ erro: 'Dados já cadastrados' })
        res.status(500).json({ erro: 'Erro ao salvar no banco' })
    }
})

//PUT - Alterar usuário
router.put('/pacientes/:id', async (req, res) => {
    const { id } = req.params
    const { nome, codUsu } = req.body

    try {
        const sql = 'update tbPacientes set nome=?, codUsu=? where codPac=?'
        const [result] = await db.query(sql, [nome, codUsu, id])
        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Paciente não encontrado' })
        res.json({ mensagem: 'Paciente alterado com sucesso' })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ erro: 'Estes dados já estão em uso' })
        res.status(500).json({ erro: 'Erro ao atualizar no banco' })
    }
})

//Delete - Excluir usuário
router.delete('/pacientes/:id', async (req, res) => {
    const { id } = req.params
    try {
        const sql = 'delete from tbPacientes where codPac=?'
        const [result] = await db.query(sql, [id])
        if (result.affectedRows === 0)
            return res.status(404)
                .json({ erro: 'Paciente não encontrado' })
        res.json({ mensagem: 'Paciente deletado com sucesso' })
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar do banco' })
    }
})

// ----CRUD AGENDAMENTOS----

router.get('/agendamentos', async (req, res) => {
    try {
        const sql = 'select * from tbAgendamentos order by codAgen desc'
        const [rows] = await db.query(sql)
        res.json(rows)
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar pacientes do banco' })
    }
})

//POST - Criar usuário
router.post('/agendamentos/:id', async (req, res) => {
    const { id } = req.params
    const codPac = Number(id)
    const { data, horario } = req.body || {}

    if (!data || !horario) {
        return res.status(400).json({ erro: 'Todos os dados são obrigatórios' })
    }

    try {
        const sql = 'insert into tbAgendamentos(data, horario, codPac) values (?,?,?)'
        const [result] = await db.query(sql, [data, horario, codPac])

        res.status(201).json({
            id: result.insertId,
            data,
            horario,
            codPac
        })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: 'Horário já ocupado' })
        }
        res.status(500).json({ erro: 'Erro ao salvar no banco' })
    }
})

//PUT - Alterar usuário
router.put('/agendamentos/:id', async (req, res) => {
    const { id } = req.params
    const codPac = Number(id)
    const { data, horario } = req.body

    try {
        const sql = 'update tbAgendamentos set data=?, horario=? where codPac=?'
        const [result] = await db.query(sql, [data, horario, codPac])
        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Agendamento não encontrado' })
        res.json({ mensagem: 'Agendamento alterado com sucesso' })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ erro: 'Estes dados já estão em uso' })
        res.status(500).json({ erro: 'Erro ao atualizar no banco' })
    }
})

//Delete - Excluir usuário
router.delete('/agendamentos/:id', async (req, res) => {
    const { id } = req.params
    const codPac = Number(id)
    try {
        const sql = 'delete from tbAgendamentos where codPac=?'
        const [result] = await db.query(sql, [codPac])
        if (result.affectedRows === 0)
            return res.status(404)
                .json({ erro: 'Agendamento não encontrado' })
        res.json({ mensagem: 'Agendamento deletado com sucesso' })
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar do banco' })
    }
})

router.get('/agendamentos/disponiveis', async (req, res) => {
    const { data } = req.query

    if (!data) {
        return res.status(400).json({
            erro: 'Data é obrigatória'
        })
    }

    const horariosTrabalho = [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00'
    ]

    try {
        const [rows] = await db.query(
            'SELECT TIME_FORMAT(horario, "%H:%i") AS horario FROM tbAgendamentos WHERE data = ?',
            [data]
        )

        const horariosOcupados = new Set(rows.map(row => row.horario))
        const horariosDisponiveis = horariosTrabalho.filter(hora => !horariosOcupados.has(hora))

        res.json({ horarios: horariosDisponiveis })
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar horários disponíveis' })
    }
})

router.get('/pacientes/email/:email', async (req, res) => {
    const { email } = req.params

    try {
        // 1) find the user by email
        const [usuarios] = await db.query(
            'SELECT codUsu, nome FROM tbUsuarios WHERE email = ?',
            [email]
        )

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })
        }

        const usuario = usuarios[0]

        // 2) check if this user already has a patient record
        const [pacientes] = await db.query(
            'SELECT codPac, nome, codUsu FROM tbPacientes WHERE codUsu = ?',
            [usuario.codUsu]
        )

        // 3) if patient exists, return it
        if (pacientes.length > 0) {
            return res.json(pacientes[0])
        }

        // 4) if patient does not exist, create it
        const [result] = await db.query(
            'INSERT INTO tbPacientes(nome, codUsu) VALUES (?, ?)',
            [usuario.nome, usuario.codUsu]
        )

        // 5) return the new patient
        res.status(201).json({
            codPac: result.insertId,
            nome: usuario.nome,
            codUsu: usuario.codUsu
        })

    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar/criar paciente' })
    }
})
module.exports = router