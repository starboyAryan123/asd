const cache = new Map();
const TTL_MS = 60 * 1000;

function cacheMiddleware(req, res, next) {
    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
        res.set("X-Cache", "HIT");
        return res.status(cached.status).json(cached.body);
    }

    if (cached) cache.delete(key);

    res.set("X-Cache", "MISS");
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cache.set(key, { body, status: res.statusCode, expiresAt: Date.now() + TTL_MS });
        }
        return originalJson(body);
    };

    next();
}

function invalidateCache(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) cache.clear();
    });
    next();
}

module.exports = { cacheMiddleware, invalidateCache, cache, TTL_MS };