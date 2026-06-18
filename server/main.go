//go:build js && wasm

package main

import "syscall/js"

func main() {
	s := &Server{
		RatingData: make(map[BookID]Book, 0),
	}

	js.Global().Set("addBooksFromCSV", jsAddBooksFromCSV(s))
	js.Global().Set("getMatchup", jsGetMatchup(s))
	js.Global().Set("getRankingData", jsGetRankingData(s))
	js.Global().Set("putRankingData", jsPutRankingData(s))
	js.Global().Set("storeMatchupResult", jsStoreMatchupResult(s))
	js.Global().Set("removeBook", jsRemoveBook(s))

	<-make(chan bool) // keep program alive
}
