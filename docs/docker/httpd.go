package main

import (
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func main() {
	root := getenv("ROOT", "/srv")
	port := getenv("PORT", "8080")
	spa := os.Getenv("SPA") == "1"

	if err := http.ListenAndServe(":"+port, handler(root, spa)); err != nil {
		os.Stderr.WriteString(err.Error() + "\n")
		os.Exit(1)
	}
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func handler(root string, spa bool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		clean := path.Clean("/" + r.URL.Path)
		rel := strings.TrimPrefix(clean, "/")
		full := filepath.Join(root, filepath.FromSlash(rel))

		info, err := os.Stat(full)
		if err == nil && info.IsDir() {
			full = filepath.Join(full, "index.html")
			_, err = os.Stat(full)
			clean = path.Join(clean, "index.html")
		}

		if err != nil {
			if spa && !strings.HasPrefix(clean, "/assets/") && !strings.HasPrefix(clean, "/fonts/") {
				setHeaders(w, "/index.html")
				http.ServeFile(w, r, filepath.Join(root, "index.html"))
				return
			}
			http.NotFound(w, r)
			return
		}

		setHeaders(w, clean)
		http.ServeFile(w, r, full)
	})
}

func setHeaders(w http.ResponseWriter, requestPath string) {
	switch {
	case strings.HasPrefix(requestPath, "/assets/"), strings.HasPrefix(requestPath, "/fonts/"):
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	case requestPath == "/index.html" || requestPath == "/":
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	}
	if strings.HasPrefix(requestPath, "/fonts/") {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}
}
