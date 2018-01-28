package flychicken

import (
	"net/http"

	ws "github.com/gorilla/websocket"
)

var _upgrader = ws.Upgrader{}

func Test() {
	http.HandleFunc("/echo", echo)
	http.HandleFunc("/", test)
	http.ListenAndServe("localhost:8888", nil)
}

func echo(w http.ResponseWriter, r *http.Request) {
	c, err := _upgrader.Upgrade(w, r, nil)
	if err != nil {
		print("upgrade err: ")
		println(err)
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			print("receive message err: ")
			println(err)
			break
		}

		err = c.WriteMessage(mt, message)
		if err != nil {
			print("write message err: ")
			println(err)
			break
		}
	}
}

func test(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("<div>hello</div>")) // 强制类型转化而不是声明
}
