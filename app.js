const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const moment = require('moment')

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

/* ----------------------------------- 聊天 ----------------------------------- */
let onlineUsers = []

io.on('connection', socket => {
  console.log('连接成功');
  socket.on('login', res => {
    console.log('res: ', res);
    let { uid, username } = res
    socket.uid = uid
    onlineUsers.push({
      uid,
      username
    })
    io.emit('login', {
      user: res,
      onlineUsers
    })
    // userList.push({
    //   username: res.username
    // })
    // username = res.username
    // // socket.emit('add', res)
    // io.emit('signsuccess', {
    //   user: res,
    //   userList: userList
    // })

  })

  socket.on('cli', msg => {
    msg.time = moment().format('HH:mm:ss')
    console.log('msg: ', msg);
    io.emit('serve', msg)
  })

  socket.on('disconnect', () => {
    // userList.map((item, index) => {
    //   if (item.username === username) {
    //     userList.splice(index, 1)
    //   }
    // })
    let user
    onlineUsers.forEach((item, index) => {
      if (item.uid === socket.uid) {
        user = item
        onlineUsers.splice(index, 1)
      }
    })
    io.emit('live', { onlineUsers, user })
  })

  socket.to('test', () => {
    console.log('加入房间');
  })
})

var port = process.env.PORT || 3000

http.listen(port, 'localhost', function () {
  var host = http.address().address
  var port = http.address().port
  console.log('服务已启动, http://%s:%s', host, port);
})