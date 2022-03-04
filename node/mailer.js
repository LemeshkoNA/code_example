const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mailer = require('./nodemailer')
const {json} = require("body-parser");

const app = express()

const PORT = 3002
const emailAddress = '@powwwer.io'
const branches = {
    RU: 'kos',
    USA: 'roman',
    UK: 'a.laugman',
}

const urlencodedParser = bodyParser.urlencoded({extended: false});

const sendMail = (data, branch = "RU") => {
    const message = {
        to: `${branches[branch]}${emailAddress}`,
        subject: 'Заявка с сайта POWWWER',
        html: `<div> 
            <ul>
                <li>Имя: ${data.fio}</li>
                <li>Контакты: ${data.contact}</li>
                <li>Комментарий: ${data.comment}</li>
            </ul>
        </div>`
    }
    mailer(message)
}

app.use(cors())
app.use(json())
app.post('/api/contacts',cors(), urlencodedParser, (req, res) => {

    if(!req.body) return res.sendStatus(400);

    sendMail(req.body.data)

    if (req.body.data.selectedBranch !== "RU") {
        sendMail(req.body.data, req.body.data.selectedBranch)
    }

    res.json({message:'Успешно', sended: true})
})

app.listen(PORT, () => console.log(`server listening at localhost:${PORT}`))
