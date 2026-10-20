# Inventário de arquivos do repositório

Branch: `main` (base) · gerado via `git ls-files` (inventário autoritativo, sem artefatos de build).

## Total: 18 arquivos versionados

| # | Arquivo |
|---|---------|
| 1 | `.DS_Store` |
| 2 | `.gitignore` |
| 3 | `MARKDOWN/poemas_marcos_alcon.md` |
| 4 | `README.md` |
| 5 | `go.mod` |
| 6 | `install_certbot.sh` |
| 7 | `main.go` |
| 8 | `server/go.mod` |
| 9 | `static/.DS_Store` |
| 10 | `static/css/book.css` |
| 11 | `static/css/booklet.css` |
| 12 | `static/css/style.css` |
| 13 | `static/data/poems.json` |
| 14 | `static/img/foto1.jpg` |
| 15 | `static/js/book.js` |
| 16 | `templates/book.html` |
| 17 | `templates/book_single_page.html` |
| 18 | `templates/index.html` |

## Observações

- **Contagem autoritativa:** `git ls-files | wc -l` → **18**. Essa é a fonte de verdade
  porque conta apenas o que está versionado, ignorando artefatos de build e objetos
  internos do Git.
- **Binário de build:** `marcosgoweb` (saída de `go build ./...`) está em `.gitignore`
  (`/marcosgoweb`) e, portanto, NÃO entra na contagem, mesmo quando presente no disco.
- **Lixo do macOS:** existem dois `.DS_Store` commitados (raiz e `static/`). São arquivos
  legítimos do inventário, mas candidatos a limpeza futura — removê-los mudaria a contagem.
- **Dois `go.mod`:** há `go.mod` na raiz e `server/go.mod`, ou seja, dois módulos Go
  distintos no repositório.
- **Working tree limpo:** `git status --porcelain` não reporta arquivos não rastreados
  nem modificações pendentes.
