
const express = require("express");
const router = express.Router();

const {
    getPosts,
    getAllPosts,
    getPostBySlug,
    getPostLikes,
    addPostLike,
    removePostLike,
    createPost,
    updatePost,
    deletePost,
} = require("../controllers/postController");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", getPosts);
router.get("/admin", authMiddleware, getAllPosts);

router.get("/:slug/likes", getPostLikes);
router.post("/:slug/likes", addPostLike);
router.delete("/:slug/likes", removePostLike);

router.get("/:slug", getPostBySlug);

// Rotas administrativas com upload de imagem
router.post(
    "/",
    authMiddleware,
    upload.single("coverImage"),
    createPost
);

router.put(
    "/:id",
    authMiddleware,
    upload.single("coverImage"),
    updatePost
);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
