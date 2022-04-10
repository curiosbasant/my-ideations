import { collections, FieldValue, firestore } from "@/server/firebase"
import type { DocumentData } from "firebase-admin/firestore"

export function createNewGame({ rows, cols, opId }: { rows: number; cols: number; opId: string }) {
  return collections.dotsAndBoxes.add({
    config: { rows, cols },
    players: [
      {
        id: opId,
        display: `Guest_${opId.slice(0, 5)}`,
      },
    ],
    activePlayer: 0,
    dashes: {},
    boxes: {},
    status: "waiting",
  })
}

function parse<T>(gameId: string, callback: (data: DocumentData) => T) {
  return firestore.runTransaction(async (transaction) => {
    const gameRef = collections.dotsAndBoxes.doc(gameId)
    const snapshot = await transaction.get(gameRef)
    if (!snapshot.exists) throw "not-found"
    const data = snapshot.data()!

    transaction.update(gameRef, callback(data))

    return "player-joined-successfully"
  })
}

export function startGame(gameId: string, playerId: string) {
  return parse(gameId, (data) => {
    if (data.players[0].id != playerId) throw "not-op"

    return {
      status: "started",
    }
  })
}

export function joinGame(gameId: string, playerId: string) {
  return parse(gameId, (data) => {
    if (data.players.some((p) => p.id == playerId)) throw "player-already-joined"
    if (data.players.length > 3) throw "max-players-reached"

    return {
      players: FieldValue.arrayUnion({ id: playerId, display: `Guest_${playerId.slice(0, 5)}` }),
    }
  })
}

export function makeMove(gameId: string, playerId: string, dash: string) {
  return parse(gameId, (data) => {
    if (data.status == "waiting") throw "game-not-started"
    if (data.status == "finished") throw "game-finished"
    if (data.players[data.activePlayer].id !== playerId) throw "not-your-turn"
    if (dash in data.dashes) throw "can't-overwrite"

    const toUpdate: Record<string, any> = {
      activePlayer: (data.activePlayer + 1) % data.players.length,
      [`dashes.${dash}`]: data.activePlayer,
      lastDash: dash,
    }

    if (
      Object.keys(data.dashes).length + 1 ==
      2 * data.config.rows * data.config.cols + data.config.rows + data.config.cols
    ) {
      toUpdate.status = "finished"
    }

    // a is always less than b
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
    return toUpdate
  })
}

export function kickPlayer(gameId: string, playerId: string, playerIdToKick: string) {
  return parse(gameId, (data) => {
    if (data.status != "waiting") throw "game-already-started"
    if (data.players[0].id != playerId) throw "not-op"

    return {
      players: data.players.filter((p) => p.id != playerIdToKick),
    }
  })
}

export function editPlayerName(gameId: string, playerId: string, newName: string) {
  return parse(gameId, (data) => ({
    players: data.players.map((p) => (p.id == playerId ? { ...p, display: newName } : p)),
  }))
}
