package main

import (
	"maps"
)

func (s *Server) storeMatchupResult(idA BookID, idB BookID, result float64) {
	bookA, okA := s.RatingData[idA]
	bookB, okB := s.RatingData[idB]
	if !okA || !okB {
		return
	}

	books := []Book{bookA, bookB}
	s.addAction(books)

	updatedBooks := update(books, []MatchupResult{
		{
			BookA:  bookA,
			BookB:  bookB,
			Result: result,
		},
	})
	maps.Copy(s.RatingData, updatedBooks)
}

func (s *Server) removeBook(id BookID) {
	book, ok := s.RatingData[id]
	if !ok {
		return
	}

	s.addAction([]Book{book})
	delete(s.RatingData, id)
}

func (s *Server) addAction(states []Book) {
	// Keep max of 10 undoable actions
	// TODO magic number
	s.LastActions = append(s.LastActions, State{
		Books: states,
	})
	if len(s.LastActions) > 10 {
		s.LastActions = s.LastActions[1:]
	}
}

// Returns number of undos left
func (s *Server) undo() int {
	l := len(s.LastActions)
	if l == 0 {
		return 0
	}

	a := s.LastActions[l-1]
	for _, b := range a.Books {
		s.RatingData[b.ID] = b
	}

	s.LastActions = s.LastActions[:l-1]
	return l - 1
}
