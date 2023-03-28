const io = require("socket.io")(8900, {
    cors:{
        origin:"http://localhost:3000",
    },
})


let users = {}

const addUser = (userId,socketId)=>{
   // console.log(!users.some((user)=>user.userId === userId))
    // !users.some((user)=>user?.userId === userId) &&
    // users.push({userId,socketId})
    //console.log("users",users)

    users[userId] = socketId;
}

const removeUser = (socketId)=>{
    users = users.filter((user)=>user?.socketId !== socketId)
}

const getUser = (userId) =>{

   console.log("text",users, userId)
  
    return users[userId]
}

io.on("connection",(socket)=>{
    console.log(`a user connected. socket: ${socket.id}`)
    
    socket.on("addUser", (userId) =>{
        if(userId){
            addUser(userId,socket.id)
            io.emit("getUsers",users)  
        }
    })

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log("resiver", receiverId, {user})
        io.to(user).emit("getMessage", {
          senderId,
          text,
        });
        //console.log(user)
      });


    socket.on("disconnect",()=>{
        // console.log("a user disconnected!")
        // removeUser(socket.id)
        // io.emit("getUsers",users)
    })
})

