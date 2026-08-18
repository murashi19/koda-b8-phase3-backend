import { where } from "sequelize";
import { default as db } from "../models/index.cjs";
import { constants } from "node:http2";

const { Links } = db;

export async function GetAllLinks(req, res) {
  try {
    const links = await Links.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Links",
      results: links,
    });
  } catch (error) {
    console.error("GetAllProduct:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch links",
    });
  }
}
