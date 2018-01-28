package flychicken

import (
	hub "flychicken/server/libs/hub"
	"net/http"
	"sync"

	ws "github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"

	"github.com/sadlil/go-trigger"
)

var upgrader = ws.Upgrader{}

func init() {
	// make 10 enemies
	for i := 3; i < 3+5; i++ {
		currents := hub.H.AddAStupid()
		currents.Birthposi = map[string]int{"x": i * 100, "y": i * 100}
		go currents.Hanging(hub.H.Players) // 使用结构体的key与使用map的key是不同的！
	}
}

func updateStatus(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	playerId := ps.ByName("pid")
	print("play joined")
	println(playerId)
	c, err := _upgrader.Upgrade(w, r, nil)
	if err != nil {
		print("upgrade err: ")
		println(err)
	}
	defer func() {
		// 关闭socket 删除玩家 清理事件
		c.Close()
		hub.H.RemovePlayer(playerId)
		trigger.Clear("message-" + playerId)
		println("play quit and socket closed!")
	}()

	mu := sync.Mutex{}
	trigger.On("message-"+playerId, func(str []byte) {
		println("player " + playerId + " received message ~~")
		mu.Lock()
		defer mu.Unlock()
		c.WriteMessage(ws.TextMessage, str) // 每个socket都接收message这个事件，简化广播事件
	})
	hub.H.AddAPlayer(playerId)
	// trigger.Fire("message", mscheme.Message) // 加入事件，通知到其他的玩家
	for {
		// <del>这种情况下所有的socket在同一个goruntine里面，不好！</del>
		// 实际上在http的回调中，已经是一个新的goruntine！以上说法不成立

		_, playerStatus, err := c.ReadMessage() // 在循环中获取从前端发送过来的玩家状态
		/*
			{
				category "player"
				action   "move", "attack"
				data     []int  `json:"data"`
			}
		*/
		if err != nil {
			println("receive message err: ")
			println(err)
			break
		}
		trigger.Fire("message", playerStatus) // 一律传二进制 binary
	}
}
