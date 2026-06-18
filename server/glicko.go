package main

import (
	"math"
)

const (
	q             = math.Ln10 / 400
	pi            = math.Pi
	DefaultRating = 1500
	DefaultRD     = 350
)

type SelfResult struct {
	oppGWeight float64 // G(RD)
	expected   float64 // E
	result     float64 // s
}

// Opponent weighting factor: G(RD)
func (b Book) gWeight() float64 {
	return 1 / math.Sqrt(1+(3*math.Pow(q, 2)*math.Pow(b.RD, 2))/math.Pow(pi, 2))
}

// My expected score against this opponent (1=win, 0=lose): s
func (b Book) expectedScore(opponent Book, oppG float64) float64 {
	return 1 / (1 + math.Pow(10, (oppG*(b.Rating-opponent.Rating))/-400))
}

func (b Book) dSquared(results []SelfResult) float64 {
	sum := 0.0
	for _, r := range results {
		sum += math.Pow(r.oppGWeight, 2) * r.expected * (1 - r.expected)
	}
	return 1 / (math.Pow(q, 2) * sum)
}

func (b Book) updateR(results []SelfResult, dSquared float64) float64 {
	sum := 0.0
	for _, r := range results {
		sum += r.oppGWeight * (r.result - r.expected)
	}

	return b.Rating + (q/((1/math.Pow(b.RD, 2))+(1/dSquared)))*sum
}

func (b Book) updateRD(dSquared float64) float64 {
	return math.Sqrt(1 / ((1 / math.Pow(b.RD, 2)) + (1 / dSquared)))
}

func getSelfMatches(b Book, gWeights map[BookID]float64, games []MatchupResult) []SelfResult {
	results := make([]SelfResult, 0)
	for _, game := range games {
		if game.BookA.ID == b.ID {
			results = append(results, SelfResult{
				oppGWeight: gWeights[game.BookB.ID],
				expected:   b.expectedScore(*game.BookB, gWeights[game.BookB.ID]),
				result:     game.Result,
			})
		} else if game.BookB.ID == b.ID {
			results = append(results, SelfResult{
				oppGWeight: gWeights[game.BookA.ID],
				expected:   b.expectedScore(*game.BookA, gWeights[game.BookA.ID]),
				result:     1 - game.Result,
			})
		}
	}

	return results
}

func (b Book) updateBook(
	gWeights map[BookID]float64,
	games []MatchupResult,
) (newR float64, newRD float64) {
	// Filter to this player's matches
	results := getSelfMatches(b, gWeights, games)
	dSquared := b.dSquared(results)

	return b.updateR(results, dSquared), b.updateRD(dSquared)
}

func update(competitors []Book, games []MatchupResult) map[BookID]Book {
	// Compute all G values up front
	G := make(map[BookID]float64)
	for _, book := range competitors {
		G[book.ID] = book.gWeight()
	}

	// Do update for each player
	// Can't update in-place, since we want to update all players for the rating period in parallel
	updatedBooks := make(map[BookID]Book, len(competitors))
	for _, b := range competitors {
		newR, newRD := b.updateBook(G, games)
		updatedBooks[b.ID] = Book{
			ID:     b.ID,
			Title:  b.Title,
			Author: b.Author,
			Isbn:   b.Isbn,
			Rating: newR,
			RD:     newRD,
		}
	}

	return updatedBooks
}
