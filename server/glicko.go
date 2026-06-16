//go:build js && wasm

package main

import (
	"fmt"
	"math"
)

const (
	q             = math.Ln10 / 400
	pi            = math.Pi
	DefaultRating = 1500
	DefaultRD     = 350
)

type SelfResult struct {
	opp    *Book
	oppG   float64
	E      float64
	result float64
}

// g(RD_i) -- opponent weighting factor
func (b Book) g() float64 {
	return 1 / math.Sqrt(1+(3*math.Pow(q, 2)*math.Pow(b.RD, 2))/math.Pow(pi, 2))
}

// Expected value of s (whether I win)
// 1 if I'm way better, 0 if I'm way worse
func (b Book) expectedScore(opponent Book, oppG float64) float64 {
	return 1 / (1 + math.Pow(10, (oppG*(b.Rating-opponent.Rating))/-400))
}

func (b Book) dSquared(results []SelfResult) float64 {
	sum := 0.0
	for _, result := range results {
		sum += math.Pow(result.oppG, 2) * result.E * (1 - result.E)
	}
	return 1 / (math.Pow(q, 2) * sum)
}

func (b Book) updateR(results []SelfResult, dSquared float64) float64 {
	sum := 0.0
	for _, result := range results {
		sum += result.oppG * (result.result - result.E)
	}

	return b.Rating + (q/((1/math.Pow(b.RD, 2))+(1/dSquared)))*sum
}

func (b Book) updateRD(dSquared float64) float64 {
	return math.Sqrt(1 / ((1 / math.Pow(b.RD, 2)) + (1 / dSquared)))
}

// For a given batch of games -- set of books that competed
// Compute g(RD) for each book
// Compute E(s | r, rj, RDj) for each book -- against each other book in the batch
// Compute d^2 for each book
// Then, for each book, do the update

func update(competitors []Book, games []MatchupResult) {
	// Compute all G values
	G := make(map[BookID]float64)
	for _, p := range competitors {
		G[p.ID] = p.g()
	}

	// Do update for each player
	for _, b := range competitors {
		newR, newRD := b.updatePlayer(G, games)
		fmt.Printf(
			"%s: [%f, %f] -> [%f, %f]\n",
			b.ID,
			b.Rating,
			b.RD,
			newR,
			newRD,
		)
	}
}

func (b Book) updatePlayer(
	G map[BookID]float64,
	games []MatchupResult,
) (newR float64, newRD float64) {
	// Filter to this player's matches
	results := make([]SelfResult, 0)
	for _, g := range games {
		if g.BookA.ID == b.ID {
			results = append(results, SelfResult{
				opp:    g.BookB,
				oppG:   G[g.BookB.ID],
				E:      b.expectedScore(*g.BookB, G[g.BookB.ID]),
				result: g.result,
			})
		} else if g.BookB.ID == b.ID {
			results = append(results, SelfResult{
				opp:    g.BookA,
				oppG:   G[g.BookA.ID],
				E:      b.expectedScore(*g.BookA, G[g.BookA.ID]),
				result: 1 - g.result,
			})
		}
	}

	// Compute d^2
	dSquared := b.dSquared(results)

	return b.updateR(results, dSquared), b.updateRD(dSquared)
}
