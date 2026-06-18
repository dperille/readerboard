package main

import (
	"math/rand"
)

func (s *Server) storeMatchupResult(result MatchupResult) {
	books := make([]Book, 2)
	books[0] = *result.BookA
	books[1] = *result.BookB

	updatedBooks := update(books, []MatchupResult{result})
	for id, b := range updatedBooks {
		s.RatingData[id] = b
	}
}

func (s *Server) randomBook() Book {
	idx := rand.Intn(len(s.RatingData))
	var book Book
	for _, b := range s.RatingData {
		if idx == 0 {
			book = b
			break
		}
		idx--
	}
	return book
}

func (s *Server) chooseMatchup() Matchup {
	// TODO - better matchup selection
	return Matchup{
		s.randomBook(),
		s.randomBook(),
	}
}

func (s *Server) removeBook(id BookID) {
	delete(s.RatingData, id)
}
