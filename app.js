const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const moment = require('moment')

const userList = []

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})


/* ----------------------------------- 聊天 ----------------------------------- */

io.on('connection', socket => {
  console.log('连接成功');

  let username = null

  socket.on('signups', res => {
    console.log('res: ', res);
    userList.push({
      username: res.username
    })
    username = res.username
    // socket.emit('add', res)
    io.emit('signsuccess', {
      user: res,
      userList: userList
    })

  })

  socket.on('cli', msg => {
    msg.time = moment().format('HH:mm:ss')
    console.log('msg: ', msg);
    io.emit('serve', msg)
  })

  socket.on('disconnect', () => {
    userList.map((item, index) => {
      if (item.username === username) {
        userList.splice(index, 1)
      }
    })
    io.emit('live', { username: username, userList })
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