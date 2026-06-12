//go:build js && wasm

package main

import (
	"encoding/json"
	"syscall/js"
)

func jsAddBooksFromCSV(s Server) js.Func {
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

func jsGetMatchup(s Server) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 0 {
			return "Invalid number of arguments"
		}

		m := s.chooseMatchup()
		j, _ := json.Marshal(m)

		return string(j)
	})
}
