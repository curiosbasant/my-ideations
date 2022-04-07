import { collections } from "@/firebase/admin"
import { joinGame, makeMove, startGame } from "@/services/dots-and-boxes"
import { withAuth } from "@/services/utils"

export default withAuth(async (request, response, user) => {
  const playerId = user.uid
  switch (request.method) {
    case "POST": {
      const { rows = 8, cols = 12 } = request.body
      const gameRef = await collections.dotsAndBoxes.add({
        config: { rows, cols },
        players: [playerId],
        activePlayer: 0,
        dashes: {},
        boxes: {},
        status: "waiting",
      })
      response.status(200).json({ message: "Success!", gameId: gameRef.id })
      break
    }
    case "PATCH": {
      if (request.query.action == "join-game") {
        const { gameId } = request.body
        try {
          const result = await joinGame(gameId, playerId)
          response.status(200).json({ message: "Success!" })
          console.log(result)
        } catch (msg) {
          switch (msg) {
            case "not-found":
              response.status(404).json({ error: `The game with id ${gameId}, doesn't exist` })
              break
            case "player-already-joined":
            case "max-players-reached":
              response.status(403).json({ error: "Already a dash there!" })
              break

            default:
              break
          }
        }
      } else if (request.query.action == "start-game") {
        const { gameId } = request.body
        await startGame(gameId, playerId)
        response.status(200).json({ message: "Success!" })
      } else if (request.query.action == "make-move") {
        const { gameId, dash } = request.body
        try {
          const result = await makeMove(gameId, playerId, dash)
          response.status(200).json({ message: "Success!" })
        } catch (msg) {
          switch (msg) {
            case "not-found":
              response.status(404).json({
                error: { code: msg, message: `That game with id ${gameId}, doesn't exist` },
              })
              break
            case "can't-overwrite":
              response.status(403).json({ error: { code: msg, message: "Already a dash there!" } })
              break

            default:
              break
          }
        }
      }
      break
    }
    case "DELETE": {
      break
    }
  }
})
