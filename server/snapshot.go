//go:build js && wasm

package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"strings"
)

func (s *Server) addBooks(books []Book) {
	for _, b := range books {
		s.Session[b.ID] = b
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
			fmt.Println(record[5])
			isbn = record[5][2:(len(record[5]) - 1)]
			fmt.Println(isbn)
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
	fmt.Println(dataJson)
	var data BookData
	err := json.Unmarshal([]byte(dataJson), &data)
	if err != nil {
		return
	}
	fmt.Println(data)

	s.Session = data
}

func (s *Server) exportSnapshot() string {
	str, _ := json.Marshal(s.Session)
	return string(str)
}
