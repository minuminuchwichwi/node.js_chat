var socket = io()

socket.on('connect', function() {
  var name = prompt('반갑습니다!', '사용자 닉네임')

  if(!name) {
    name = '익명'
  }

  socket.emit('add_array',name)//접속자 추가
  socket.emit('newUser', name)
})

//접속자 목록 출력
socket.on('update_array',function(array){
    
    del_array()

    array.forEach(function(element){
        var chatuser=document.getElementById('list')
        var user=document.createElement('li')
        var node=document.createTextNode(element)
        
        user.appendChild(node)
        chatuser.appendChild(user)
    })

})

socket.on('update', function(data) {
  var chat = document.getElementById('chat')
  var message = document.createElement('div')
  var node = document.createTextNode(`${data.name} : ${data.message}`)
  var className = ''

  switch(data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }

  message.classList.add(className)
  message.appendChild(node)
  chat.appendChild(message)
})

function send() {
  var message = document.getElementById('test').value
  
  document.getElementById('test').value = ''

  var chat = document.getElementById('chat')
  var msg = document.createElement('div')
  var node = document.createTextNode(message)
  
  msg.classList.add('me')
  msg.appendChild(node)
  chat.appendChild(msg)

  var test = document.createElement('br')
  chat.appendChild(test)  

  socket.emit('message', {type: 'message', message: message})
}

function del_array(){
    var test=document.getElementById('UserList')
    var test2=document.getElementById('list')
    test.removeChild(test2)

    var tag=document.createElement('ul')
    tag.id='list'
    test.appendChild(tag)
}
