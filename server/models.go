package main

type BookID string

type Book struct {
	ID     BookID `json:"bookId"`
	Title  string `json:"title"`
	Author string `json:"author"`
	Isbn   string `json:"isbn"`

	Rating float64 `json:"rating"`
	RD     float64 `json:"rd"`
}

type Matchup struct {
	BookA Book `json:"bookA"`
	BookB Book `json:"bookB"`
}

type MatchupResult struct {
	BookA  Book   `json:"bookA"`
	BookB  Book   `json:"bookB"`
	Result float64 `json:"result"`
}

type BookData map[BookID]Book

type Server struct {
	RatingData map[BookID]Book
	LastActions []State // most recent action on end
}

// Stores state of some subset of books at a given time to restore from
type State struct {
	Books []Book
}
