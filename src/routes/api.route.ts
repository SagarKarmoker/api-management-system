import { Router } from "express";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';

const apiRouter = Router();

apiRouter.post("/", async (req, res) => {
    const { user_id, scopes, expires_in_days } = req.body;

    console.log(scopes)

    if (!user_id || !scopes || !expires_in_days) {
        return res.status(400).json({
            status: "error",
            message: "Missing required fields"
        })
    }

    const key_id = `key_${uuidv4().slice(0, 8)}`;
    const key_secret = randomBytes(32).toString('base64url');
    const hashed_secret = await bcrypt.hash(key_secret, 10);
    const full_key = `${key_id}.${key_secret}`;
    const now = new Date();
    // Calculate the expiration date by adding the number of days (expires_in_days) converted to milliseconds (1 day = 86400000 ms)
    // to the current time, then convert the resulting date to an ISO string.
    const expires_at = new Date(now.getTime() + expires_in_days * 86400000).toISOString();

    const newApiKey = await prisma.api.create({
        data: {
            user_id,
            hashed_secret,
            full_key,
            expires_at,
            scopes: scopes as string[] || ['read'],
            status: "active"
        }
    });

    if (!newApiKey) {
        return res.status(400).json({
            status: "error",
            message: "Failed to create API key"
        })
    }

    res.status(200).json({
        status: "success",
        data: newApiKey || null
    })
});

apiRouter.get("/keys", async (req, res) => {
    const {user_id} = req.query;
    if (!user_id) {
        return res.status(400).json({
            status: "error",
            message: "Missing user_id"
        })
    }

    const apiKeys = await prisma.api.findMany({
        where: {
            user_id: user_id as string
        }, 
        select: {
            id: true,
            full_key: true,
            expires_at: true
        }
    });

    if (!apiKeys) {
        return res.status(400).json({
            status: "error",
            message: "Failed to fetch API keys"
        })
    }

    res.status(200).json({
        status: "success",
        data: apiKeys || null
    })
})

apiRouter.delete("/keys/:key_id", async (req, res) => {
    const { key_id } = req.params;
    const { user_id } = req.query;

    if (!key_id || !user_id) {
        return res.status(400).json({
            status: "error",
            message: "Missing key_id or user_id"
        })
    }

    const deletedApiKey = await prisma.api.update({
        where: {
            id: key_id as string,
            user_id: user_id as string
        }, 
        data: {
            status: "deleted"
        }
    });

    if (!deletedApiKey) {
        return res.status(400).json({
            status: "error",
            message: "Failed to delete API key"
        })
    }

    res.status(200).json({
        status: "success",
        data: deletedApiKey || null
    })
})

apiRouter.get("/verify", async (req, res) => {
    const authHeader = req.headers['api-x'];
    if (!authHeader || typeof authHeader !== "string") {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized"
        });
    }

    // Expecting format: key_<id>.<secret>
    const [fullKeyId, keySecret] = authHeader.split(".");

    if (!fullKeyId || !keySecret) {
        return res.status(401).json({
            status: "error",
            message: "Invalid API key format"
        });
    }

    // Find the API key in the database
    const apiKey = await prisma.api.findFirst({
        where: {
            full_key: authHeader
        }
    });

    if (!apiKey) {
        return res.status(401).json({
            status: "error",
            message: "Invalid API key"
        });
    }

    // Check if the key is not deleted or expired
    if (apiKey.status !== "active") {
        return res.status(401).json({
            status: "error",
            message: "API key is not active"
        });
    }

    // Check if the key is expired
    if (new Date(apiKey.expires_at) < new Date()) {
        return res.status(401).json({
            status: "error",
            message: "API key expired"
        });
    }
    
    // Verify the secret using bcrypt
    const isSecretValid = await bcrypt.compare(keySecret, apiKey.hashed_secret);
    if (!isSecretValid) {
        return res.status(401).json({
            status: "error",
            message: "Invalid API key"
        });
    }

    res.status(200).json({
        status: "success",
        message: "API key is valid"
    });
});

apiRouter.post("/rotate/:key_id", async (req, res) => {
    const { key_id } = req.params;
    const { user_id } = req.query;
    
    if (!key_id || !user_id) {
        return res.status(400).json({
            status: "error",
            message: "Missing key_id or user_id"
        })
    }

    const apiKey = await prisma.api.findFirst({
        where: {
            id: key_id as string,
            user_id: user_id as string
        }
    });

    if (!apiKey) {
        return res.status(400).json({
            status: "error",
            message: "API key not found"
        })
    }

    const newKeySecret = randomBytes(32).toString('base64url');
    const hashed_secret = await bcrypt.hash(newKeySecret, 10);
    const newFullKey = `${key_id}.${newKeySecret}`;

    const updatedApiKey = await prisma.api.update({
        where: {
            id: key_id as string,
            user_id: user_id as string
        },
        data: {
            hashed_secret,
            full_key: newFullKey
        }
    });

    if (!updatedApiKey) {
        return res.status(400).json({
            status: "error",
            message: "Failed to rotate API key"
        })
    }
    
    res.status(200).json({
        status: "success",
        data: updatedApiKey || null
    })
})

export default apiRouter;