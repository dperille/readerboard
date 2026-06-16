//go:build js && wasm

package main

import "syscall/js"

type BookID string

type Book struct {
	ID     BookID `json:"bookId"`
	Title  string `json:"title"`
	Author string `json:"author"`

	Rating float64 `json:"rating"`
	RD     float64 `json:"rd"`
}

type Matchup struct {
	BookA Book
	BookB Book
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
	s := Server{
		Session: make(map[BookID]Book, 0),
	}

	js.Global().Set("jsAddBooksFromCSV", jsAddBooksFromCSV(s))
	js.Global().Set("jsGetMatchup", jsGetMatchup(s))
	js.Global().Set("jsGetRankingData", jsGetRankingData(s))
	js.Global().Set("jsPutRankingData", jsPutRankingData(s))
	js.Global().Set("jsStoreMatchupResult", jsStoreMatchupResult(s))

	<-make(chan bool) // keep program alive
}
