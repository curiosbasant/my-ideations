import {
  createNewGame,
  editPlayerName,
  joinGame,
  kickPlayer,
  makeMove,
  startGame,
} from "../services/dots-and-boxes"
import { withAuth } from "./utils"

export const createOne = withAuth(async (req, res, user) => {
  let rows = +req.body.rows || 8,
    cols = +req.body.cols || 12

  if (rows > 20) rows = 20
  else if (rows < 3) rows = 3
  if (cols > 20) cols = 20
  else if (cols < 3) cols = 3

  const gameRef = await createNewGame({ rows, cols, opId: user.uid })

  res.redirect(`/games/dots-and-boxes/${gameRef.id}`)
})

export const updateOne = withAuth(async (req, res, user) => {
  const playerId = user.uid
  const gameId = req.cookies.gameId

  switch (req.query.action) {
    case "join-game": {
      try {
        const result = await joinGame(gameId, playerId)
        res.status(200).json({ message: "Success!" })
        console.log(result)
      } catch (msg) {
        switch (msg) {
          case "not-found":
            res.status(404).json({ error: `The game with id ${gameId}, doesn't exist` })
            break
          case "player-already-joined":
          case "max-players-reached":
            res.status(403).json({ error: "Already a dash there!" })
            break

          default:
            break
        }
      }
      break
    }
    case "start-game": {
      startGame(gameId, playerId)
      break
    }
    case "make-move": {
      const { dash } = req.body
      try {
        const result = await makeMove(gameId, playerId, dash)
        res.status(200).json({ message: "Success!" })
      } catch (msg) {
        switch (msg) {
          case "not-found":
            res.status(404).json({
              error: { code: msg, message: `That game with id ${gameId}, doesn't exist` },
            })
            break
          case "can't-overwrite":
            res.status(403).json({ error: { code: msg, message: "Already a dash there!" } })
            break

          default:
            res.status(403).json({ error: { code: msg, message: msg } })
            break
        }
      }
      break
    }
    case "kick-player": {
      const { playerId: toKick } = req.body
      kickPlayer(gameId, playerId, toKick)
      break
    }
    case "edit-player-name": {
      const { newName } = req.body
      editPlayerName(gameId, playerId, newName)
      break
    }

    default:
      break
  }
  res.end()
})
