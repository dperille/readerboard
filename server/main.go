//go:build js && wasm

package main

import "syscall/js"

type BookID string

type Book struct {
	ID     BookID `json:"bookId"`
	Title  string `json:"title"`
	Author string `json:"author"`
	Isbn   string `json:"isbn"`

	Rating float64 `json:"rating"`
	RD     float64 `json:"rd"`
}

type Matchup struct {
	BookA Book `json:"bookA"`
	BookB Book `json:"bookB"`
}

type MatchupResult struct {
	BookA  *Book
	BookB  *Book
	result float64 // todo - enum
}

type BookData map[BookID]Book

type Server struct {
	Session map[BookID]Book `json:"session"`
}

func main() {
	s := &Server{
		Session: make(map[BookID]Book, 0),
	}

	js.Global().Set("addBooksFromCSV", jsAddBooksFromCSV(s))
	js.Global().Set("getMatchup", jsGetMatchup(s))
	js.Global().Set("getRankingData", jsGetRankingData(s))
	js.Global().Set("putRankingData", jsPutRankingData(s))
	js.Global().Set("storeMatchupResult", jsStoreMatchupResult(s))
	js.Global().Set("removeBook", jsRemoveBook(s))

	<-make(chan bool) // keep program alive
}
