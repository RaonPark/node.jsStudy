const SocketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, webSession) => {
    const io = SocketIO(server, {path: '/socket.io', cors: { origin: '*', credential: true }});
    app.set('io', io);
    const room = io.of("/room");
    const dm = io.of("/dm");

    io.use((socket, next) => {
        cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
        webSession(socket.request, socket.request.res || {}, next);
    });

    room.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('네임스페이스 해제');
        });
    });

    dm.on('connection', (socket) => {
        const req = socket.request;
        let dmId;

        socket.on('test', (data) => {
            console.log(data);
            dmId = data.id;
            socket.join(dmId);

            socket.to(dmId).emit('join', {
                user: dmId,
                msg: 'hello',
            });
        });

        socket.on('disconnect', () => {
            socket.leave(dmId);
        });
    });
}