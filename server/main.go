package main

import (
	"fmt"
	"math"
)

const (
	q  = math.Ln10 / 400
	pi = math.Pi
)

type PlayerID string

type Player struct {
	ID PlayerID

	Rating float64
	RD     float64
}

type Game struct {
	playerA *Player
	playerB *Player
	result  float64 // 1 if A won, 0 if B won, 0.5 if draw
}

type SelfResult struct {
	opp    *Player
	oppG   float64
	E      float64
	result float64
}

// g(RD_i) -- opponent weighting factor
func (p Player) g() float64 {
	return 1 / math.Sqrt(1+(3*math.Pow(q, 2)*math.Pow(p.RD, 2))/math.Pow(pi, 2))
}

// Expected value of s (whether I win)
// 1 if I'm way better, 0 if I'm way worse
func (p Player) expectedScore(opponent Player, oppG float64) float64 {
	return 1 / (1 + math.Pow(10, (oppG*(p.Rating-opponent.Rating))/-400))
}

func (p Player) dSquared(results []SelfResult) float64 {
	sum := 0.0
	for _, result := range results {
		sum += math.Pow(result.oppG, 2) * result.E * (1 - result.E)
	}
	return 1 / (math.Pow(q, 2) * sum)
}

func (p Player) updateR(results []SelfResult, dSquared float64) float64 {
	sum := 0.0
	for _, result := range results {
		sum += result.oppG * (result.result - result.E)
	}

	return p.Rating + (q/((1/math.Pow(p.RD, 2))+(1/math.Pow(dSquared, 2))))*sum
}

func (p Player) updateRD(dSquared float64) float64 {
	return math.Sqrt(1 / ((1 / math.Pow(p.RD, 2)) + (1 / dSquared)))
}

// For a given batch of games -- set of books that competed
// Compute g(RD) for each book
// Compute E(s | r, rj, RDj) for each book -- against each other book in the batch
// Compute d^2 for each book
// Then, for each book, do the update

func update(competitors []Player, games []Game) {
	// Compute all G values
	G := make(map[PlayerID]float64)
	for _, p := range competitors {
		G[p.ID] = p.g()
	}

	// Do update for each player
	for _, p := range competitors {
		newR, newRD := p.updatePlayer(G, games)
		fmt.Printf(
			"%s: [%f, %f] -> [%f, %f]\n",
			p.ID,
			p.Rating,
			p.RD,
			newR,
			newRD,
		)
	}
}

func (p Player) updatePlayer(G map[PlayerID]float64, games []Game) (newR float64, newRD float64) {
	// Filter to this player's matches
	results := make([]SelfResult, 0)
	for _, g := range games {
		if g.playerA.ID == p.ID {
			results = append(results, SelfResult{
				opp: g.playerB,
				oppG: G[g.playerB.ID],
				E: p.expectedScore(*g.playerB, G[g.playerB.ID]),
				result: g.result,
			})
		} else if g.playerB.ID == p.ID {
			results = append(results, SelfResult{
				opp: g.playerA,
				oppG: G[g.playerA.ID],
				E: p.expectedScore(*g.playerA, G[g.playerA.ID]),
				result: 1 - g.result,
			})
		}
	}

	// Compute d^2
	dSquared := p.dSquared(results)

	return p.updateR(results, dSquared), p.updateRD(dSquared)
}

func run() {
	competitors := []Player{
		{
			ID:     "1",
			Rating: 1500,
			RD:     200,
		},
		{
			ID:     "2",
			Rating: 1400,
			RD:     30,
		},
		{
			ID:     "3",
			Rating: 1550,
			RD:     100,
		},
		{
			ID:     "4",
			Rating: 1700,
			RD:     300,
		},
	}

	results := []Game{
		{
			playerA: &competitors[0],
			playerB: &competitors[1],
			result:  1,
		},
		{
			playerA: &competitors[0],
			playerB: &competitors[2],
			result:  0,
		},
		{
			playerA: &competitors[0],
			playerB: &competitors[3],
			result:  0,
		},
	}

	update(competitors, results)
}
