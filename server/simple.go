//go:build js && wasm

// ^ only compile this file when target OS=js and target arch=wasm

package main

import (
	"encoding/csv"
	"io"
	"log"
	"strings"
	"syscall/js"
)

func main() {
	js.Global().Set("jsAdd", jsAdd())
	js.Global().Set("jsParseCSV", jsParseCSV())

	<-make(chan bool) // keep program alive
}

func add(x int, y int) int {
	return x + y
}

func jsAdd() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 2 {
			return "Invalid number of arguments"
		}
		x := args[0].Int()
		y := args[1].Int()

		return add(x, y)
	})
}

func parseCSV(text string) string {
	reader := csv.NewReader(strings.NewReader(text))

	// TODO - use header
	_, err := reader.Read()
	if err != nil {
		log.Fatal(err)
	}

	var titlesRead []string

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		// 21 = read count
		if record[21] != "0" {
			titlesRead = append(titlesRead, record[1])
		}
	}

	return strings.Join(titlesRead, ",")
}

func jsParseCSV() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			return "Invalid number of arguments"
		}
		csvText := args[0].String()

		return parseCSV(csvText)
	})
}
