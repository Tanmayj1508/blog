const {Router} = require('express')
const multer = require('multer')
const path = require('path')
const router = Router()
const Blog = require('../model/blog')
const Comment = require('../model/comment')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })

const upload = multer({ storage: storage })
router.get("/add-new", (req, res) => {
    res.render('addBlog', {
        user: req.user
    })
})

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy')
  const comment = await Comment.find({blogId: req.params.id}).populate('createdBy')
  return res.render('blog', {user: req.user, blog, comment})
})

router.post("/", upload.single("coverImage") ,async (req, res) => {
    // console.log(req.user)
    const {title, body} = req.body
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user.id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`) 
})

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user.id
  });
  return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router