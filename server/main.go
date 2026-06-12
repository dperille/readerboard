//go:build js && wasm

package main

import "syscall/js"

type BookID string

type Book struct {
	ID     BookID // GoodReads includes an ID already - just use that for now
	Title  string
	Author string

	Rating float64
	RD     float64
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

type Server struct {
	AllBooks           map[BookID]Book
	UnprocessedResults []MatchupResult
}

func main() {
	s := Server{
		AllBooks:           make(map[BookID]Book, 0),
		UnprocessedResults: make([]MatchupResult, 0),
	}

	js.Global().Set("jsAddBooksFromCSV", jsAddBooksFromCSV(s))
	js.Global().Set("jsGetMatchup", jsGetMatchup(s))

	<-make(chan bool) // keep program alive
}
