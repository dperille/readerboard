//go:build js && wasm

package main

import (
	"encoding/json"
)

func (s *Server) putSnapshot(dataJson string) {
	var data BookData
	err := json.Unmarshal([]byte(dataJson), &data)
	if err != nil {
		return
	}

	s.Session = data
}

func (s *Server) exportSnapshot() string {
	str, _ := json.Marshal(s.Session)
	return string(str)
}
