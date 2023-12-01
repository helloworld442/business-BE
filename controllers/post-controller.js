const Post = require("../schemas/posts.js");

getPosts = async (req, res) => {
  try {
    const findPosts = await Post.find({}).sort("-createdAt");

    const allPosts = findPosts.map((post) => {
      return {
        postId: post._id,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글을 불러오는데 실패했습니다." });
  }
};

getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const findPost = await Post.findOne({ _id: postId });

    const post = {
      postId: findPost._id,
      userId: findPost.userId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };

    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
};

createPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId, nickname } = res.locals.user;

  try {
    if (!req.cookies) {
      res.status(403).json({ errorCode: "A001" });
      return;
    }

    await Post.create({ userId, nickname, title, content });

    res.status(201).json({ message: "게시글을 작성에 성공하였습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 작성에 실패했습니다." });
  }
};

updatePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  try {
    if (!req.cookies) {
      res.status(403).json({ errorCode: "A001" });
      return;
    }

    const update_target = await Post.findOne({ _id: postId });

    if (!update_target) {
      res.status(404).json({ errorCode: "P001" });
      return;
    }

    if (userId !== update_target.userId) {
      res.status(403).json({ errorCode: "P002" });
      return;
    }

    const updatedAt = new Date();
    updatedAt.setHours(updatedAt.getHours() + 9);

    const update_done = await Post.updateOne(
      { _id: postId },
      { $set: { title, content, updatedAt } }
    );

    if (update_done.modifiedCount === 0) {
      res.status(401).json({ errorMessage: "게시글 수정에 실패했습니다." });
      return;
    }

    res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 수정에 실패했습니다." });
  }
};

deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    if (!req.cookies) {
      res.status(403).json({ errorCode: "A001" });
      return;
    }

    const delete_target = await Post.findOne({ _id: postId });

    if (!delete_target) {
      res.status(404).json({ errorCode: "P001" });
      return;
    }

    if (userId !== delete_target.userId) {
      res.status(403).json({ errorCode: "P002" });
      return;
    }

    const delete_done = await Post.deleteOne({ _id: postId });

    if (delete_done.deletedCount === 0) {
      res.status(401).json({ errorMessage: "게시글 삭제에 실패했습니다." });
      return;
    }

    res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 삭제에 실패했습니다." });
  }
};

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
