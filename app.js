var express = require('express')
var socket = require('socket.io')
var http=require('http')
var app = express()
var server=http.createServer(app)
var io= socket(server)
var fs =require('fs')
var array=new Array()
var oracledb = require("oracledb")
var dbConfig = require("./database/dbconfig.js")
oracledb.autoCommit = true

app.use('/css',express.static('./static/css'))
app.use('/js',express.static('./static/js'))

app.get('/',function(request, response){
    fs.readFile('./static/index.html',function(err,data){
        if(err){
            response.send('에러')
        }
        else{
            response.writeHead(200,{'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})

oracledb.getConnection({
    user:dbConfig.user,
    password:dbConfig.password,
    connectString:dbConfig.connectString 
 },
 function(err,connection){
    if(err){
        console.log("데이터베이스 접속 실패",err)
        return
    }
    
    io.sockets.on('connection',function(socket){
        socket.on('newUser',function(name){
            console.log(name + '님이 접속 하였습니다.')
    
            socket.name=name
    
            io.sockets.emit('update',{type:'connect',name:'SERVER',message:name+'님이 접속하였습니다'})
        
        })
    
        socket.on('message',function(data){
            data.name =socket.name
            console.log(data)
            socket.broadcast.emit('update',data)
           
            var query = 'INSERT INTO CHATTING_DATA(NAME, MESSAGE, TIME) VALUES (\''+ data.name +'\', \''+ data.message + '\', TO_CHAR(SYSDATE,\'YYYY/MM/DD HH24:MI:SS\'))'
            
            connection.execute(query, function(err,result){
                if(err){
                    console.log("insert 실패",err)
                    return
                }
                console.log('Rows Insert: ' + result.rowsAffected)
            })
        })

    
        socket.on('disconnect',function(){
            console.log(socket.name+'님이 나가셨습니다')
    
            //접속자 제거
            var index=array.indexOf(socket.name)
            array.splice(index,1)
    
            socket.broadcast.emit('update_array',array)
            socket.broadcast.emit('update',{type:'disconnect',name:'SERVER',message:socket.name+'님이 나가셨습니다.'})
        })
    
        //접속자 추가
        socket.on('add_array',function(){
            array.push(socket.name)
            io.sockets.emit('update_array',array)
        })

    })
})

function doRelease(connection){
    connection.release(
        function(err){
            if(err){
                console.log("해제 실패",err)
            }
        }
    )
}

server.listen(3000,function(){
    console.log('서버 실행중')
})
