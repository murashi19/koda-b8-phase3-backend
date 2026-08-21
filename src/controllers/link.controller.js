import { Op } from "sequelize";
import { default as db } from "../models/index.cjs";
import { constants } from "node:http2";
import redis from "../lib/redis.js";

const { Links } = db;

const LINK_CACHE_TTL_SECONDS = 3600; // 1 jam
const LIST_CACHE_TTL_SECONDS = 60;

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalLinks = await Links.count({
      where: { user_id: userId },
    });

    const recentLinks = await Links.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit: 2,
    });

    const formattedRecent = recentLinks.map((link) => ({
      id: link.id,
      original_url: link.original_url,
      slug: link.slug,
      short_url: `${req.protocol}://${req.get("host")}/${link.slug}`,
      created_at: link.created_at,
    }));

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved",
      results: {
        totalLinks,
        recentLinks: formattedRecent,
      },
    });
  } catch (error) {
    next(error);
  }
};

export async function getAllLinks(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const userId = req.user.id;
    const search = req.query.search?.trim();
    const cacheKey = buildListCacheKey(userId, { page, limit, search });

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.status(constants.HTTP_STATUS_OK).json(JSON.parse(cached));
      }
    } catch (cacheError) {
      console.error("Redis get error:", cacheError.message);
    }

    const offset = (page - 1) * limit;
    const where = { user_id: userId };
    if (search) {
      where[Op.or] = [
        { slug: { [Op.iLike]: `%${search}%` } },
        { original_url: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const total = await Links.count({ where });

    const totalPages = Math.ceil(total / limit);
    const links = await Links.findAll({
      where,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const results = links.map((link) => ({
      id: link.id,
      original_url: link.original_url,
      slug: link.slug,
      short_url: `${req.protocol}://${req.get("host")}/${link.slug}`,
      created_at: link.created_at,
    }));

    const payload = {
      success: true,
      message: "Lists Links",
      results,
      pagination: {
        page,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    try {
      await redis.set(cacheKey, JSON.stringify(payload), {
        EX: LIST_CACHE_TTL_SECONDS,
      });
    } catch (cacheError) {
      console.error("Redis set error:", cacheError.message);
    }

    return res.status(constants.HTTP_STATUS_OK).json(payload);
  } catch (error) {
    console.error("GetAllLinks:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch links",
    });
  }
}

function buildListCacheKey(userId, { page, limit, search }) {
  return `links:list:${userId}:page=${page}:limit=${limit}:search=${search || ""}`;
}

async function invalidateUserListCache(userId) {
  try {
    const pattern = `links:list:${userId}:*`;
    for await (const key of redis.scanIterator({ MATCH: pattern })) {
      await redis.del(key);
    }
  } catch (cacheError) {
    console.error("Redis list cache invalidation error:", cacheError.message);
  }
}

export async function createLink(req, res) {
  try {
    const { originalUrl, customSlug } = req.body;
    const userId = req.user.id;
    if (!originalUrl) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Original Url is required",
      });
    }
    try {
      new URL(originalUrl);
    } catch {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Original Url is not valid",
      });
    }

    const RESERVED_SLUGS = ["api", "login", "register", "dashboard"];
    let slug;

    if (customSlug) {
      slug = customSlug.trim();

      if (slug.length < 3 || slug.length > 50) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Custom slug must be between 3 and 50 characters",
        });
      }
      if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Custom slug can only contain letters, numbers, and hyphens",
        });
      }
      if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "This slug is reserved and cannot be used",
        });
      }

      const taken = await Links.findOne({ where: { slug } });
      if (taken) {
        return res.status(constants.HTTP_STATUS_CONFLICT).json({
          success: false,
          message: "Slug already taken",
          results: null,
        });
      }
    } else {
      slug = generatedSlug();
      let taken = await Links.findOne({ where: { slug } });
      while (taken) {
        slug = generatedSlug();
        taken = await Links.findOne({ where: { slug } });
      }
    }
    const link = await Links.create({
      user_id: userId,
      original_url: originalUrl,
      slug,
    });

    await invalidateUserListCache(userId);

    res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Link created successfully",
      results: {
        id: link.id,
        original_url: originalUrl,
        slug: link.slug,
        short_url: `${req.protocol}://${req.get("host")}/${link.slug}`,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

function generatedSlug(length = 6) {
  const chart =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chart[Math.floor(Math.random() * chart.length)];
  }
  return result;
}

export async function deleteLink(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const link = await Links.findOne({
      where: { id, user_id: userId },
    });
    if (!link) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Link not found",
      });
    }
    await link.destroy();

    try {
      await redis.del(link.slug);
    } catch (cacheError) {
      console.error("Redis del error:", cacheError.message);
    }
    await invalidateUserListCache(userId);

    res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Link deleted successfully",
      results: link,
    });
  } catch (error) {
    console.error("DeleteLink:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete link",
    });
  }
}

export async function redirectLink(req, res) {
  try {
    const { slug } = req.params;
    try {
      const cachedUrl = await redis.get(slug);
      if (cachedUrl) {
        return res.redirect(301, cachedUrl);
      }
    } catch (cacheError) {
      console.error("Redis get error:", cacheError.message);
    }

    const link = await Links.findOne({ where: { slug } });
    if (!link) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Link not found",
      });
    }

    try {
      await redis.set(slug, link.original_url, {
        EX: LINK_CACHE_TTL_SECONDS,
      });
    } catch (cacheError) {
      console.error("Redis set error:", cacheError.message);
    }

    res.redirect(301, link.original_url);
  } catch (error) {
    console.error("RedirectLink:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to redirect link",
    });
  }
}
