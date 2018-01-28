package flychicken

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func Hello(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Fprintf(w, "hello, %s!\n", ps.ByName("name"))
}

var fs = http.StripPrefix("/page/", http.FileServer(http.Dir("flychicken/client")))

func fServer(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fs.ServeHTTP(w, r)
}

func Run() {
	router := httprouter.New()
	router.GET("/page/:xxx", fServer)
	router.GET("/page/:xxx/:yyy", fServer)
	router.GET("/room/status/:pid/", updateStatus)

	log.Fatal(http.ListenAndServe(":8888", router))
}
