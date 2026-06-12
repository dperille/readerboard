//go:build js && wasm

package main

import (
	"encoding/csv"
	"io"
	"math/rand"
	"strings"
)

func (s *Server) randomBook() Book {
	idx := rand.Intn(len(s.AllBooks))
	var book Book
	for _, b := range s.AllBooks {
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

func (s *Server) storeMatchupResult(result MatchupResult) {
	s.UnprocessedResults = append(s.UnprocessedResults, result)
}

func (s *Server) addBooks(books []Book) {
	for _, b := range books {
		s.AllBooks[b.ID] = b
	}
}

func parseBooksRead(text string) ([]Book, error) {
	reader := csv.NewReader(strings.NewReader(text))

	// TODO - use header
	_, err := reader.Read()
	if err != nil {
		return nil, err
	}

	var books []Book
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		// 13 = date read
		if record[13] != "" {
			books = append(books, Book{
				ID:     BookID(record[0]),
				Title:  record[1],
				Author: record[2],
				Rating: DefaultRating,
				RD:     DefaultRD,
			})
		}
	}

	return books, nil
}
