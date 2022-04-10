import { createOne, updateOne } from "@/server/controllers/dots-and-boxes"
import { NextApiHandler } from "next"

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "POST":
      return createOne(req, res)
    case "PATCH":
      return updateOne(req, res)
    case "DELETE":

    default:
      break
  }
}

export default handler
