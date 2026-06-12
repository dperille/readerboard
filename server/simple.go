//go:build js && wasm
// ^ only compile this file when target OS=js and target arch=wasm

package main

import "syscall/js"

func main() {
	js.Global().Set("jsAdd", jsAdd())

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
