const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");

const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post-controller");

router.get("/", getPosts);

router.get("/:postId", getPost);

router.post("/", authMiddleware, createPost);

router.put("/:postId", authMiddleware, updatePost);

router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;
