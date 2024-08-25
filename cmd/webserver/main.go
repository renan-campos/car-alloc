package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	assetsDir := flag.String("assets-dir", "", "The name of the directory containing html assets")
	flag.Parse()
	fileServer := http.FileServer(http.Dir(*assetsDir))
	http.Handle("/", fileServer)
	log.Fatal(http.ListenAndServe(":1984", nil))
}
