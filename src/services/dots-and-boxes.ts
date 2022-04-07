import { collections, FieldValue, firestore } from "@/firebase/admin"

export function joinGame(gameId: string, playerId: string) {
  return firestore.runTransaction(async (transaction) => {
    const gameRef = collections.dotsAndBoxes.doc(gameId)
    const snapshot = await transaction.get(gameRef)
    if (!snapshot.exists) throw "not-found"
    const data = snapshot.data()!

    if (data.players.includes(playerId)) throw "player-already-joined"
    if (data.players.length > 3) throw "max-players-reached"

    transaction.update(gameRef, {
      players: FieldValue.arrayUnion(playerId),
    })
    return "player-joined-successfully"
  })
}
export function startGame(gameId: string, playerId: string) {
  return firestore.runTransaction(async (transaction) => {
    const gameRef = collections.dotsAndBoxes.doc(gameId)
    const snapshot = await transaction.get(gameRef)
    if (!snapshot.exists) throw "not-found"
    const data = snapshot.data()!

    if (data.players[0] != playerId) throw "not-op"

    transaction.update(gameRef, {
      status: "started",
    })
    return "game-started-successfully"
  })
}

export function makeMove(gameId: string, playerId: string, dash: string) {
  return firestore.runTransaction(async (transaction) => {
    const gameRef = collections.dotsAndBoxes.doc(gameId)
    const snapshot = await transaction.get(gameRef)
    if (!snapshot.exists) throw "not-found"
    const data = snapshot.data()!

    // if (data.players[data.activePlayer] !== playerId) return
    if (dash in data.dashes) throw "can't-overwrite"

    const toUpdate: Record<string, any> = {
      activePlayer: (data.activePlayer + 1) % data.players.length,
      [`dashes.${dash}`]: data.activePlayer,
    }

    const [a, b] = dash.split("_").map((n) => +n)
    const isHori = b - a == 1
    const dotsWidth = data.config.cols + 1
    const offset = isHori ? dotsWidth : 1

    // top or left square
    if (
      `${a - offset}_${a}` in data.dashes &&
      `${a - offset}_${b - offset}` in data.dashes &&
      `${b - offset}_${b}` in data.dashes
    ) {
      toUpdate[`boxes.${a - ((a / dotsWidth) | 0) - (isHori ? data.config.cols : 1)}`] =
        data.activePlayer + 1
      delete toUpdate.activePlayer
    }
    // bottom or right square
    if (
      `${a}_${a + offset}` in data.dashes &&
      `${a + offset}_${b + offset}` in data.dashes &&
      `${b}_${b + offset}` in data.dashes
    ) {
      toUpdate[`boxes.${a - ((a / dotsWidth) | 0)}`] = data.activePlayer + 1
      delete toUpdate.activePlayer
    }

    transaction.update(gameRef, toUpdate)
    return "made move"
  })
}
