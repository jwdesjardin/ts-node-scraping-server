# NHL Scraping server

This project will use typescript, node, express to create a server provided nhl hockey statistics. I will use cheerio js to visit sites and parse through html.

## endpoints

- [x] /api/standings 
- [x] /api/games 
- [x] /api/skaters 
- [x] /api/goalies 
- [x] /api/team/:teamID 
- [x] /api/game/:gameID 
- [x] /api/injuries

## todo list 

- [x] clean up file structure in lib dir
- [x] fix team injuries error
- [x] test data and remove null returns / iregularities in all endpoints
  - [x] injuries
  - [x] team
  - [x] skaters
  - [x] goalies
  - [x] gameSummary
  - [x] games
  - [x] standings
- [x] require API key
- [x] host / deploy

demo hosted at: [https://ts-node-scraping-nhl.herokuapp.com/](https://ts-node-scraping-nhl.herokuapp.com/) 
