package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"regexp"
)

// Phrase represents a single phrase from the book
type Phrase struct {
	Number int
	Text   string
}

// Book represents the entire book data
type Book struct {
	Title   string
	Phrases []Phrase
}

// extractPhrases parses the markdown content to extract phrases
func extractPhrases(content string) []Phrase {
	var phrases []Phrase
	re := regexp.MustCompile(`## (\d+)\. (.*)`)

	matches := re.FindAllStringSubmatch(content, -1)
	for _, match := range matches {
		if len(match) >= 3 {
			number := 0
			fmt.Sscanf(match[1], "%d", &number)
			phrases = append(phrases, Phrase{
				Number: number,
				Text:   match[2],
			})
		}
	}

	return phrases
}

// extractTitle parses the markdown content to extract the title
func extractTitle(content string) string {
	re := regexp.MustCompile(`# (.*)`)
	match := re.FindStringSubmatch(content)
	if len(match) >= 2 {
		return match[1]
	}
	return "FRASES DE MARCOS ALCON"
}

// loadBookData loads the book data from the markdown file
func loadBookData(filePath string) (Book, error) {
	var book Book

	// Read the markdown file
	content, err := os.ReadFile(filePath)
	if err != nil {
		return book, err
	}

	// Extract title and phrases
	book.Title = extractTitle(string(content))
	book.Phrases = extractPhrases(string(content))

	return book, nil
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Only handle root path
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	// Load book data
	book, err := loadBookData("../MARKDOWN/poemas_marcos_alcon.md")
	if err != nil {
		http.Error(w, "Failed to load book data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Pass book data to the template
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		http.Error(w, "Failed to load template: "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, book)
	if err != nil {
		http.Error(w, "Failed to render template: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func bookHandler(w http.ResponseWriter, r *http.Request) {
	// Load book data
	book, err := loadBookData("../MARKDOWN/poemas_marcos_alcon.md")
	if err != nil {
		http.Error(w, "Failed to load book data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Pass book data to the template
	tmpl, err := template.ParseFiles("templates/book_single_page.html")
	if err != nil {
		http.Error(w, "Failed to load template: "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, book)
	if err != nil {
		http.Error(w, "Failed to render template: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func apiPhrasesHandler(w http.ResponseWriter, r *http.Request) {
	// Load book data
	book, err := loadBookData("../MARKDOWN/poemas_marcos_alcon.md")
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
	// Check if markdown file exists
	_, err := os.Stat("../MARKDOWN/poemas_marcos_alcon.md")
	if os.IsNotExist(err) {
		log.Fatal("Error: Markdown file not found at ../MARKDOWN/poemas_marcos_alcon.md")
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
