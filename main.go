package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
)

// Phrase represents a single phrase from the book
type Phrase struct {
	Number int    `json:"number"`
	Text   string `json:"text"`
}

// Book represents the entire book data
type Book struct {
	Title   string   `json:"title"`
	Author  string   `json:"author,omitempty"`
	Year    string   `json:"year,omitempty"`
	Phrases []Phrase `json:"poems"`
}

// TemplateData represents the data passed to the template
type TemplateData struct {
	Title  string
	Author string
	Year   string
	Poems  []Phrase
}

// loadBookDataFromJSON loads the book data from the JSON file
func loadBookDataFromJSON(filePath string) (Book, error) {
	var book Book

	// Read the JSON file
	content, err := os.ReadFile(filePath)
	if err != nil {
		return book, err
	}

	// Parse JSON data
	err = json.Unmarshal(content, &book)
	if err != nil {
		return book, err
	}

	return book, nil
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Only handle root path
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	// Load book data
	book, err := loadBookDataFromJSON("static/data/poems.json")
	if err != nil {
		http.Error(w, "Failed to load book data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Create template data with proper field mapping
	templateData := TemplateData{
		Title:  book.Title,
		Author: book.Author,
		Year:   book.Year,
		Poems:  book.Phrases,
	}

	// Create template with functions
	tmpl, err := template.New("index.html").Funcs(template.FuncMap{
		"add": func(a, b int) int {
			return a + b
		},
	}).ParseFiles("templates/index.html")

	if err != nil {
		http.Error(w, "Failed to load template: "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, templateData)
	if err != nil {
		http.Error(w, "Failed to render template: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func bookHandler(w http.ResponseWriter, r *http.Request) {
	// Load book data
	book, err := loadBookDataFromJSON("static/data/poems.json")
	if err != nil {
		http.Error(w, "Failed to load book data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Create template data
	templateData := TemplateData{
		Title:  book.Title,
		Author: book.Author,
		Year:   book.Year,
		Poems:  book.Phrases,
	}

	// Create template with functions
	tmpl, err := template.New("book_single_page.html").Funcs(template.FuncMap{
		"add": func(a, b int) int {
			return a + b
		},
	}).ParseFiles("templates/book_single_page.html")

	if err != nil {
		http.Error(w, "Failed to load template: "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, templateData)
	if err != nil {
		http.Error(w, "Failed to render template: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func apiPhrasesHandler(w http.ResponseWriter, r *http.Request) {
	// Load book data
	book, err := loadBookDataFromJSON("static/data/poems.json")
	if err != nil {
		http.Error(w, "Failed to load book data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert to JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(book)
	if err != nil {
		http.Error(w, "Failed to encode JSON: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func main() {
	// Check if JSON file exists
	_, err := os.Stat("static/data/poems.json")
	if os.IsNotExist(err) {
		log.Fatal("Error: JSON file not found at static/data/poems.json")
	}

	// Set up file server for static files
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Set up handlers
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/book", bookHandler)
	http.HandleFunc("/api/phrases", apiPhrasesHandler)

	// Start server
	port := "8080"
	fmt.Printf("Server started at http://localhost:%s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
