const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const cors = require('cors');
const sequelize = require('./db');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/auth-middleware');
const fs = require('fs');
const {Session} = require('./models/models');

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.HTTP_URL_FRONT,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'sessions'))); // endpoint с именем файла отдаст файл как статику
app.use('/api', router);

// запускаем sequelize и само приложение

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

// эта часть овечает за получение сообщения от клиента и рассылке его всем остальным клиентам

app.ws('/', (ws) => {
    ws.on('message', (message) => {
        messageJSON = JSON.parse(message); // получаем сообщение и парсим его
        switch (messageJSON.event) { // в зависимости от события две функции
            case 'connection':
                connectionHandler(ws, messageJSON); // первое подключение 
                break;
            case 'editorUpdate':
                broadcast(ws, messageJSON); // отправка сообщения
                break;
            case 'languageUpdate':
                languageUpdate(ws, messageJSON); // изменение языка
                break;
            case 'close':
                close(ws, messageJSON); 
                break;
            case 'markersUpdate':
                markersUpdate(ws, messageJSON); 
                break;
            case 'firstUpdate':
                firstUpdate(ws, messageJSON); 
                break;
        }
    })
    ws.on('close', () => {
        let infoUser = [];
        aWss.clients.forEach(client => { 
            if (client.id === ws.id) { 
                infoUser.push({
                    username: client.username,
                    color: client.color
                })
            } 
        });
        aWss.clients.forEach(client => { 
            if (client.id === ws.id) { 
                client.send(JSON.stringify({event: 'userUpdate', users: infoUser, color: ws.color})); 
            } 
        });
    })
});

async function firstUpdate(ws, message) {
    let users = [];
    aWss.clients.forEach(client => {
        if (client.id === message.sessionId) {
            users.push(client.username);
        }
    });
    try {
        const abilityToEdit = await Session.findOne({where: {sessionStatic: `${message.sessionId}.txt`}});
        if (abilityToEdit.users.length < users.length) {
            await Session.update({users: users}, {where: {sessionStatic: message.sessionId + '.txt'}});
        }
    } catch {
        console.log('не получилось')
    }
    const messageForClient = { 
        event: 'firstUpdate'
    };

    awssBroadcast(message, messageForClient, true, ws);
}

const markersUpdate = function(ws, message) {
    awssBroadcast(message, message, false, ws);
}

async function close(ws, message) {
    const edit = await Session.findOne({where: {sessionStatic: `${message.sessionId}.txt`}});
    if (edit.abilityToEdit === true) {
        await Session.update({abilityToEdit: false}, {where: {sessionStatic: message.sessionId + '.txt'}});
    } else {
        await Session.update({abilityToEdit: true}, {where: {sessionStatic: message.sessionId + '.txt'}});
    }
    const messageForClient = {
        event: 'close',
        abilityToEdit: edit.abilityToEdit
    };
    
    awssBroadcast(message, messageForClient, false, ws);
}

// изменение языка

async function languageUpdate(ws, message) {
    const messageForClient = { // формируем сообщение для клиента 
        event: 'languageUpdate',
        language: message.language
    };
    aWss.clients.forEach(client => {
        if (client.id === message.sessionId) {
            client.language = message.language;
        }
    });

    try {
        await Session.update({language: message.language}, {where: {sessionStatic: message.sessionId + '.txt'}});
    } catch {
        console.log('Не авторизован!');
    }

    awssBroadcast(message, messageForClient, false, ws);
}

async function connectionHandler(ws, message) {
    console.log('connection');
    let colorUsers = [];
    let users = [];
    let infoUser = [];
    let lang = [];
    ws.id = message.sessionId; 
    ws.username = message.username;

    aWss.clients.forEach(client => {
        if (client.id === message.sessionId) {
            users.push(client.username);
            colorUsers.push(client.color);
            lang.push(client.language);
        }
    });
    ws.language = lang[0];

    const arrColor = message.color;
    const freeColors = arrColor.filter(el => !colorUsers.includes(el));
    let color = freeColors[0];
    ws.color = color;
    aWss.clients.forEach(client => {
        if (client.id === message.sessionId) {
            infoUser.push({
                username: client.username,
                color: client.color
            });
        }
    });

    let first = false;
    let doc = '';
    let canEdit = true;
    let usersSession;
    let creator = 'first';

    aWss.clients.forEach(client => { 
        if (client === ws) { 
          client.send(JSON.stringify({event: 'colorUpdate', color: color})); 
        } 
    });


    try {
        doc = fs.readFileSync(path.resolve(__dirname, 'sessions', `${message.sessionId}` + '.txt')).toString(); // читаем файл
    } catch {
        fs.writeFileSync(path.resolve(__dirname, 'sessions', `${message.sessionId}` + '.txt'), ''); // если файла нет, то создаем его
        first = true;
        lang = ['javascript'];
        creator = message.username;
    }
    
    try {
        const abilityToEdit = await Session.findOne({where: {sessionStatic: `${message.sessionId}.txt`}});
        if (abilityToEdit.abilityToEdit === false) {
            canEdit = false;
        }   
        if (abilityToEdit.users.length < users.length) {
            await Session.update({users: users}, {where: {sessionStatic: message.sessionId + '.txt'}});
        }
        usersSession = await Session.findOne({where: {sessionStatic: message.sessionId + '.txt'}});
        lang = [usersSession.language];
        creator = abilityToEdit.creator;
    } catch {
        console.log('не получилось')
    }

    const messageForClient = { // формируем сообщение для клиента 
        event: 'connection',
        username: message.username,
        input: doc,
        language: lang[0],
        users: infoUser,
        first: first,
        abilityToEdit: canEdit,
        color: color,
        creator: creator
    };

    awssBroadcast(message, messageForClient, true, ws);
}

//рассылаем сообщение всем клиентам

function broadcast(ws, message) {
    try {
        fs.writeFileSync(path.resolve(__dirname, 'sessions', `${message.sessionId}` + '.txt'), message.input); // обновляем файл
    } catch(e) {
        console.log(e);
    }

    awssBroadcast(message, message, false, ws);
}

const awssBroadcast = function(message, messageForClient, all, ws) {
    if (all) {
        aWss.clients.forEach(client => {
            if (client.id === message.sessionId) {
              client.send(JSON.stringify(messageForClient));
            }
        })
    } else {
        aWss.clients.forEach(client => {
            if (client.id === message.sessionId && client !== ws) {
              client.send(JSON.stringify(messageForClient));
            }
        });
    }
}

app.use(authMiddleware); // middleware для проверки авторизован ли пользователь

start();