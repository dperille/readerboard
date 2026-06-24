package main

import (
	"math"
	"math/rand"
)

func weightedRandomBook(books map[BookID]Book, weight func(Book) float64) Book {
	var totalWeight float64
	for _, b := range books {
		totalWeight += weight(b)
	}

	// r will be some point on the [0, totalWeight] number line, and each book occupies space based on its weight
	// Therefore this is a weighted random selection
	r := rand.Float64() * totalWeight
	for _, b := range books {
		r -= weight(b)
		if r <= 0 {
			return b
		}
	}

	panic("unreachable")
}

func (s *Server) chooseMatchup() Matchup {
	if len(s.RatingData) < 2 {
		return Matchup{}
	}

	// Choose a random book weighted on highest RD
	bookA := weightedRandomBook(s.RatingData, func(b Book) float64 {
		return b.RD
	})

	// Then choose other book weighted on RD and closeness in rating to bookA
	bookB := weightedRandomBook(s.RatingData, func(b Book) float64 {
		if b.ID == bookA.ID {
			// Never use same book
			return 0
		}

		ratingDiff := math.Abs(bookA.Rating - b.Rating)
		return b.RD / (1 + ratingDiff)
	})

	return Matchup{
		BookA: bookA,
		BookB: bookB,
	}
}
