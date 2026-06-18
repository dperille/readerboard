//go:build js && wasm

package main

import (
	"encoding/json"
	"syscall/js"
)

func jsAddBooksFromCSV(s *Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			return "Invalid number of arguments"
		}
		csvText := args[0].String()

		books, err := parseBooksRead(csvText)
		if err != nil {
			return err.Error()
		}
		s.addBooks(books)

		return ""
	})
}

func jsGetMatchup(s *Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 0 {
			return "Invalid number of arguments"
		}

		m := s.chooseMatchup()
		j, _ := json.Marshal(m)

		return string(j)
	})
}

func jsGetRankingData(s *Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 0 {
			return "Invalid number of arguments"
		}

		return s.exportSnapshot()
	})
}

func jsPutRankingData(s *Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			return "Invalid number of arguments"
		}

		jsonStr := args[0].String()
		s.putSnapshot(jsonStr)

		return ""
	})
}

func jsStoreMatchupResult(s *Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 3 {
			return "Invalid number of arguments"
		}

		idBookA := BookID(args[0].String())
		idBookB := BookID(args[1].String())
		result := args[2].Float()

		bookA := s.RatingData[idBookA]
		bookB := s.RatingData[idBookB]

		s.storeMatchupResult(MatchupResult{
			BookA:  &bookA,
			BookB:  &bookB,
			Result: result,
		})

		return ""
	})
}

func jsRemoveBook(s *Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			return "Invalid number of arguments"
		}

		bookId := BookID(args[0].String())
		s.removeBook(bookId)

		return ""
	})
}
