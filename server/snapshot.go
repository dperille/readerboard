package main

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"strings"
)

func (s *Server) addBooks(books []Book) {
	for _, b := range books {
		s.RatingData[b.ID] = b
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
		// 5 = ISBN, but prefixed with "= and suffixed with "; or none at all
		var isbn string
		if len(record[5]) > 3 {
			isbn = record[5][2:(len(record[5]) - 1)]
		}
		if record[13] != "" {
			books = append(books, Book{
				ID:     BookID(record[0]),
				Title:  record[1],
				Author: record[2],
				Isbn:   isbn,
				Rating: DefaultRating,
				RD:     DefaultRD,
			})
		}
	}

	return books, nil
}

func (s *Server) putSnapshot(dataJson string) {
	var data BookData
	err := json.Unmarshal([]byte(dataJson), &data)
	if err != nil {
		return
	}

	s.RatingData = data
}

func (s *Server) exportSnapshot() string {
	str, _ := json.Marshal(s.RatingData)
	return string(str)
}
